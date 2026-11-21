import { createContext, useContext } from 'react'
import { useSearchParams } from 'react-router'
import { useCategorias } from '../hooks/useCategorias.js'

const CategoriasContext = createContext(null)

/**
 * Una sola consulta a /api/genres para toda la app: Navbar, Home y la
 * cabecera de GenreBooks comparten las mismas categorías.
 *
 * `?failCategorias=...` permite probar los estados de error de la grilla sin
 * afectar la consulta de libros (`?fail=...`).
 */
export function CategoriasProvider({ children }) {
  const [searchParams] = useSearchParams()
  const fail = searchParams.get('failCategorias') ?? undefined
  const categorias = useCategorias({ fail })

  return (
    <CategoriasContext.Provider value={categorias}>
      {children}
    </CategoriasContext.Provider>
  )
}

export function useCategoriasContext() {
  const contexto = useContext(CategoriasContext)

  if (!contexto) {
    throw new Error(
      'useCategoriasContext debe usarse dentro de <CategoriasProvider>',
    )
  }

  return contexto
}
