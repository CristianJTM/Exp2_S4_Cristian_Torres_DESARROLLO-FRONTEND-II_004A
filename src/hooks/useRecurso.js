import { useCallback, useEffect, useState } from 'react'
import { ApiError, pedirJson } from '../lib/api.js'

/**
 * Hook genérico para consumir un recurso REST.
 *
 * Encapsula fetch, AbortController, timeout, estados loading/error/data y un
 * reintento manual. Los hooks de dominio (useLibros, useCategorias) solo arman
 * la URL y validan la forma de la respuesta.
 *
 * @param {string | null} url  URL a pedir; si es null no se hace fetch.
 * @param {{ validate?: (data: unknown) => boolean, timeoutMs?: number }} options
 * @returns {{ data: unknown, loading: boolean, error: ApiError | null, retry: () => void }}
 */
export function useRecurso(url, { validate, timeoutMs } = {}) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [reload, setReload] = useState(0)

  useEffect(() => {
    // Sin URL no hay nada que pedir.
    if (!url) {
      setData(null)
      setError(null)
      setLoading(false)
      return
    }

    let activo = true
    const controller = new AbortController()

    setLoading(true)
    setError(null)
    setData(null)

    async function cargar() {
      try {
        const resultado = await pedirJson(url, {
          signal: controller.signal,
          timeoutMs,
          validate,
        })

        if (activo) setData(resultado)
      } catch (err) {
        // Un abort es intencional: no es un error para la persona usuaria.
        if (!activo || err?.name === 'AbortError') return

        setError(
          err instanceof ApiError
            ? err
            : new ApiError('network', 'Ocurrió un error inesperado.'),
        )
      } finally {
        if (activo) setLoading(false)
      }
    }

    cargar()

    // Cleanup: invalida la respuesta en vuelo y cancela la petición.
    return () => {
      activo = false
      controller.abort()
    }
  }, [url, reload, validate, timeoutMs])

  const retry = useCallback(() => setReload((n) => n + 1), [])

  return { data, loading, error, retry }
}
