import { useCallback, useEffect, useState } from 'react'

// La API vive bajo el base de Vite: en GitHub Pages el service worker de MSW
// queda registrado en /<repo>/ y solo intercepta peticiones dentro de ese
// scope, así que no podemos pedir a la raíz del dominio.
const API_BOOKS = `${import.meta.env.BASE_URL}api/books`

function mensajeParaStatus(status, genre) {
  if (status === 404) {
    return `No encontramos el género “${genre}”. Puede que no exista en el catálogo.`
  }
  if (status >= 500) {
    return 'El servidor tuvo un problema al cargar los libros. Intenta nuevamente en unos segundos.'
  }
  return `No pudimos cargar los libros (código ${status}).`
}

/**
 * Encapsula la petición de libros: fetch, AbortController y estados.
 *
 * @param {string | undefined} genre  Slug de la categoría.
 * @returns {{ libros: object[] | null, loading: boolean, error: string | null, retry: () => void }}
 */
export function useLibros(genre) {
  const [libros, setLibros] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [reload, setReload] = useState(0)

  useEffect(() => {
    // Sin género no hay nada que pedir.
    if (!genre) {
      setLibros(null)
      setError(null)
      setLoading(false)
      return
    }

    let activo = true
    const controller = new AbortController()

    setLoading(true)
    setError(null)
    setLibros(null)

    // Escotilla de pruebas del mock: /genre/misterio?fail=500 | ?fail=network
    const fail = new URLSearchParams(window.location.search).get('fail')
    const params = new URLSearchParams({ genre })
    if (fail) params.set('fail', fail)

    async function cargarLibros() {
      try {
        const res = await fetch(`${API_BOOKS}?${params.toString()}`, {
          signal: controller.signal,
        })

        if (!activo) return

        if (!res.ok) {
          // El mock explica el motivo en { error }. Si el body no es JSON,
          // caemos a un mensaje según el status (404 y 5xx distintos).
          const body = await res.json().catch(() => null)
          if (!activo) return
          setError(body?.error ?? mensajeParaStatus(res.status, genre))
          return
        }

        let data
        try {
          data = await res.json()
        } catch {
          if (activo) setError('La respuesta del servidor no es válida.')
          return
        }

        if (!Array.isArray(data)) {
          if (activo) setError('La respuesta del servidor no es válida.')
          return
        }

        if (activo) setLibros(data)
      } catch (err) {
        // Un abort es intencional: no es un error para el usuario.
        if (err.name === 'AbortError' || !activo) return
        setError(
          'No pudimos conectar con el servidor. Revisa tu conexión e intenta de nuevo.',
        )
      } finally {
        if (activo) setLoading(false)
      }
    }

    cargarLibros()

    // Cleanup: invalida la respuesta en vuelo y cancela la petición.
    return () => {
      activo = false
      controller.abort()
    }
  }, [genre, reload])

  const retry = useCallback(() => setReload((n) => n + 1), [])

  return { libros, loading, error, retry }
}
