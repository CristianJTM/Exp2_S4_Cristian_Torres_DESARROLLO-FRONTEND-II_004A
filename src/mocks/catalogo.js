/**
 * Fuente única de verdad del catálogo simulado.
 *
 * De este archivo se derivan tanto el endpoint de categorías
 * (GET /api/genres) como el de libros (GET /api/books?genre=<slug>), así que
 * un slug solo se define acá y no puede quedar desincronizado.
 *
 * Vive dentro de src/mocks/ a propósito: el frontend no lo importa, solo lo
 * consume a través de la API simulada.
 */
export const CATEGORIAS = [
  {
    slug: 'ficcion',
    nombre: 'Ficción',
    emoji: '📖',
    descripcion: 'Novelas y relatos que exploran la condición humana.',
    libros: [
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
  },
  {
    slug: 'ciencia-ficcion',
    nombre: 'Ciencia Ficción',
    emoji: '🚀',
    descripcion: 'Futuros posibles, tecnología y viajes más allá de las estrellas.',
    libros: [
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
  },
  {
    slug: 'misterio',
    nombre: 'Misterio',
    emoji: '🔍',
    descripcion: 'Enigmas, detectives y casos que parecen imposibles de resolver.',
    libros: [
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
  },
  {
    slug: 'aventura',
    nombre: 'Aventura',
    emoji: '🧭',
    descripcion: 'Expediciones, tesoros y viajes que ponen a prueba a sus protagonistas.',
    libros: [
      {
        id: 'ave-1',
        title: 'La isla del tesoro',
        author: 'Robert Louis Stevenson',
        price: 17990,
      },
      {
        id: 'ave-2',
        title: 'Veinte mil leguas de viaje submarino',
        author: 'Julio Verne',
        price: 19990,
      },
      {
        id: 'ave-3',
        title: 'El hobbit',
        author: 'J. R. R. Tolkien',
        price: 22990,
      },
    ],
  },
  {
    slug: 'drama',
    nombre: 'Drama',
    emoji: '🎭',
    descripcion: 'Historias intensas de conflicto, pérdida y emoción.',
    // Categoría válida sin libros: sirve para probar el estado vacío.
    libros: [],
  },
]

/** Claves = slugs de categoría; valores = libros. */
export const librosPorGenero = Object.fromEntries(
  CATEGORIAS.map(({ slug, libros }) => [slug, libros]),
)

/** Categorías sin los libros, con el total para mostrarlo en la grilla. */
export const categoriasPublicas = CATEGORIAS.map(({ libros, ...categoria }) => ({
  ...categoria,
  total: libros.length,
}))
