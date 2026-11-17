import { http, HttpResponse, delay } from 'msw'

/**
 * "Backend" simulado. Las claves son los slugs que usa /genre/:genre
 * (ver src/data/categorias.js) y deben coincidir con la grilla de Home.
 *
 * Contrato de GET /api/books?genre=<slug>:
 *   200 → Book[]        (array vacío si la categoría existe pero no tiene libros)
 *   400 → { error }     (falta el parámetro genre)
 *   404 → { error }     (género no definido)
 *
 * Book = { id, title, author, price } con price entero en CLP.
 */
export const booksByGenre = {
  ficcion: [
    {
      id: 'fic-1',
      title: 'Cien años de soledad',
      author: 'Gabriel García Márquez',
      price: 24990,
    },
    {
      id: 'fic-2',
      title: 'Rayuela',
      author: 'Julio Cortázar',
      price: 21990,
    },
    {
      id: 'fic-3',
      title: 'La casa de los espíritus',
      author: 'Isabel Allende',
      price: 19990,
    },
    {
      id: 'fic-4',
      title: 'El túnel',
      author: 'Ernesto Sabato',
      price: 15990,
    },
  ],
  'ciencia-ficcion': [
    {
      id: 'cf-1',
      title: 'Dune',
      author: 'Frank Herbert',
      price: 27990,
    },
    {
      id: 'cf-2',
      title: 'Fundación',
      author: 'Isaac Asimov',
      price: 23990,
    },
    {
      id: 'cf-3',
      title: 'Neuromante',
      author: 'William Gibson',
      price: 25990,
    },
    {
      id: 'cf-4',
      title: 'El problema de los tres cuerpos',
      author: 'Cixin Liu',
      price: 26990,
    },
  ],
  misterio: [
    {
      id: 'mis-1',
      title: 'El nombre de la rosa',
      author: 'Umberto Eco',
      price: 25990,
    },
    {
      id: 'mis-2',
      title: 'Diez negritos',
      author: 'Agatha Christie',
      price: 14990,
    },
    {
      id: 'mis-3',
      title: 'El sabueso de los Baskerville',
      author: 'Arthur Conan Doyle',
      price: 16990,
    },
  ],
  drama: [],
}

// La ruta se resuelve contra el base de Vite: en GitHub Pages el worker se
// registra en /<repo>/ y solo intercepta peticiones dentro de ese scope.
const API_BOOKS = `${import.meta.env.BASE_URL}api/books`

export const handlers = [
  http.get(API_BOOKS, async ({ request }) => {
    // Latencia simulada en todas las ramas, incluido el 404.
    await delay(1000)

    const { searchParams } = new URL(request.url)
    const genre = searchParams.get('genre')
    const fail = searchParams.get('fail')

    // Escotilla de pruebas manuales: ?genre=misterio&fail=500 | fail=network
    if (fail === '500') {
      return HttpResponse.json(
        { error: 'Error interno del servidor' },
        { status: 500 },
      )
    }
    if (fail === 'network') {
      return HttpResponse.error()
    }

    if (!genre) {
      return HttpResponse.json(
        { error: 'Parámetro genre requerido' },
        { status: 400 },
      )
    }

    if (!Object.hasOwn(booksByGenre, genre)) {
      return HttpResponse.json({ error: 'Género no encontrado' }, { status: 404 })
    }

    return HttpResponse.json(booksByGenre[genre])
  }),
]
