/**
 * Categorías de la tienda. El `slug` es la fuente de verdad para la URL
 * (/genre/:genre) y para las claves de `booksByGenre` en src/mocks/handlers.js.
 * Si agregas una categoría, debes agregarla también en el mock.
 */
export const CATEGORIAS = [
  {
    slug: 'ficcion',
    nombre: 'Ficción',
    emoji: '📖',
    descripcion: 'Novelas y relatos que exploran la condición humana.',
  },
  {
    slug: 'ciencia-ficcion',
    nombre: 'Ciencia Ficción',
    emoji: '🚀',
    descripcion: 'Futuros posibles, tecnología y viajes más allá de las estrellas.',
  },
  {
    slug: 'misterio',
    nombre: 'Misterio',
    emoji: '🔍',
    descripcion: 'Enigmas, detectives y casos que parecen imposibles de resolver.',
  },
  {
    slug: 'drama',
    nombre: 'Drama',
    emoji: '🎭',
    descripcion: 'Historias intensas de conflicto, pérdida y emoción.',
  },
]

export function getCategoriaPorSlug(slug) {
  return CATEGORIAS.find((categoria) => categoria.slug === slug)
}
