import { useCallback, useEffect, useState } from 'react'

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

    async function cargarLibros() {
      try {
        const res = await fetch(`/api/books?genre=${encodeURIComponent(genre)}`, {
          signal: controller.signal,
        })

        if (!activo) return

        if (!res.ok) {
          setError(mensajeParaStatus(res.status, genre))
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
