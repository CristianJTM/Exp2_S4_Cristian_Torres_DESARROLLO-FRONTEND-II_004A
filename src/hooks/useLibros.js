import { API_BASE } from '../lib/api.js'
import { useRecurso } from './useRecurso.js'

function esLibro(libro) {
  return (
    libro !== null &&
    typeof libro === 'object' &&
    typeof libro.id === 'string' &&
    typeof libro.title === 'string' &&
    typeof libro.author === 'string' &&
    typeof libro.price === 'number'
  )
}

const esListaDeLibros = (data) =>
  Array.isArray(data) && data.every(esLibro)

/**
 * Encapsula la petición de libros de una categoría.
 *
 * @param {string | undefined} genre  Slug de la categoría.
 * @param {{ fail?: string }} options Escotilla de pruebas del mock (?fail=...).
 * @returns {{ libros: object[] | null, loading: boolean, error: ApiError | null, retry: () => void }}
 */
export function useLibros(genre, { fail } = {}) {
  let url = null

  if (genre) {
    const params = new URLSearchParams({ genre })
    if (fail) params.set('fail', fail)
    url = `${API_BASE}/books?${params.toString()}`
  }

  const { data, loading, error, retry } = useRecurso(url, {
    validate: esListaDeLibros,
  })

  return { libros: data, loading, error, retry }
}
