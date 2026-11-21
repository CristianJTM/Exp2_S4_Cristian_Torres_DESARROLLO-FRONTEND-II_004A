import { http, HttpResponse, delay } from 'msw'
import { categoriasPublicas, librosPorGenero } from './catalogo.js'

/**
 * "Backend" simulado.
 *
 * Contratos:
 *   GET /api/genres
 *     200 → Genre[]  (slug, nombre, emoji, descripcion, total)
 *
 *   GET /api/books?genre=<slug>
 *     200 → Book[]        (array vacío si la categoría existe pero no tiene libros)
 *     400 → { error }     (falta el parámetro genre)
 *     404 → { error }     (género no definido)
 *
 * Book = { id, title, author, price } con price entero en CLP.
 */

// La ruta se resuelve contra el base de Vite: en GitHub Pages el worker se
// registra en /<repo>/ y solo intercepta peticiones dentro de ese scope.
const API = `${import.meta.env.BASE_URL}api`
const LATENCIA_MS = 1000
// Suficiente para que el timeout de 8 s del cliente se dispare antes.
const ESPERA_AGOTADA_MS = 30000

// Escotilla de pruebas: ?fail=500-once falla solo la primera consulta, así el
// botón «Reintentar» de la UI sí puede recuperarse. La ventana de 900 ms
// absorbe el doble montaje de StrictMode (la primera petición se aborta y la
// segunda es la que se ve) sin alcanzar a un reintento humano o automatizado.
const ventanasDeFallo = new Map()

function tipoDeFallo(fail) {
  if (!fail) return null
  return fail.endsWith('-once') ? fail.slice(0, -'-once'.length) : fail
}

function debeFallar(fail) {
  const tipo = tipoDeFallo(fail)
  if (!tipo) return null

  if (!fail.endsWith('-once')) return tipo

  const ahora = Date.now()
  const hasta = ventanasDeFallo.get(tipo)

  if (hasta === undefined) {
    ventanasDeFallo.set(tipo, ahora + 900)
    return tipo
  }

  return ahora <= hasta ? tipo : null
}

async function responder(fail, respuestaNormal) {
  // La decisión se toma al recibir la petición: la ventana de -once cuenta
  // desde la llegada, no desde que termina la latencia simulada.
  const fallo = debeFallar(fail)

  await delay(LATENCIA_MS)

  if (fallo === 'network') return HttpResponse.error()

  if (fallo === '500') {
    return HttpResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 },
    )
  }

  if (fallo === 'invalid') {
    return new HttpResponse('esto no es JSON', {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  if (fallo === 'timeout') {
    // El cliente aborta a los 8 s; acá solo mantenemos la respuesta colgada.
    await delay(ESPERA_AGOTADA_MS)
  }

  return respuestaNormal()
}

export const handlers = [
  http.get(`${API}/genres`, async ({ request }) => {
    const { searchParams } = new URL(request.url)
    return responder(searchParams.get('fail'), () =>
      HttpResponse.json(categoriasPublicas),
    )
  }),

  http.get(`${API}/books`, async ({ request }) => {
    const { searchParams } = new URL(request.url)
    const genre = searchParams.get('genre')

    return responder(searchParams.get('fail'), () => {
      if (!genre) {
        return HttpResponse.json(
          { error: 'Parámetro genre requerido' },
          { status: 400 },
        )
      }

      if (!Object.hasOwn(librosPorGenero, genre)) {
        return HttpResponse.json(
          { error: 'Género no encontrado' },
          { status: 404 },
        )
      }

      return HttpResponse.json(librosPorGenero[genre])
    })
  }),
]
