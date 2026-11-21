import { API_BASE } from '../lib/api.js'
import { useRecurso } from './useRecurso.js'

function esCategoria(categoria) {
  return (
    categoria !== null &&
    typeof categoria === 'object' &&
    typeof categoria.slug === 'string' &&
    typeof categoria.nombre === 'string' &&
    typeof categoria.total === 'number'
  )
}

const esListaDeCategorias = (data) =>
  Array.isArray(data) && data.every(esCategoria)

/**
 * Categorías del catálogo, servidas por GET /api/genres.
 *
 * @param {{ fail?: string }} options Escotilla de pruebas del mock (?fail=...).
 * @returns {{ categorias: object[] | null, loading: boolean, error: ApiError | null, retry: () => void }}
 */
export function useCategorias({ fail } = {}) {
  const params = new URLSearchParams()
  if (fail) params.set('fail', fail)

  const query = params.toString()
  const url = `${API_BASE}/genres${query ? `?${query}` : ''}`

  const { data, loading, error, retry } = useRecurso(url, {
    validate: esListaDeCategorias,
  })

  return { categorias: data, loading, error, retry }
}
