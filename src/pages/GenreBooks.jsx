import { Link, useParams } from 'react-router'
import { getCategoriaPorSlug } from '../data/categorias.js'
import { useLibros } from '../hooks/useLibros.js'
import BookCard from '../components/ui/BookCard.jsx'
import LoadingSpinner from '../components/ui/LoadingSpinner.jsx'
import ErrorMessage from '../components/ui/ErrorMessage.jsx'
import EmptyState from '../components/ui/EmptyState.jsx'

function capitalizar(texto = '') {
  return texto.charAt(0).toUpperCase() + texto.slice(1).replaceAll('-', ' ')
}

export default function GenreBooks() {
  const { genre } = useParams()
  const { libros, loading, error, retry } = useLibros(genre)

  const categoria = getCategoriaPorSlug(genre)
  const titulo = categoria?.nombre ?? capitalizar(genre)

  return (
    <section className="mx-auto max-w-6xl px-4 py-10">
      <Link
        to="/"
        className="inline-flex items-center gap-1 rounded-lg text-sm font-medium text-stone-500 transition-colors hover:text-amber-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2"
      >
        <span aria-hidden="true">←</span> Todas las categorías
      </Link>

      <header className="mt-4">
        <div className="flex flex-wrap items-center gap-3">
          {categoria && (
            <span aria-hidden="true" className="text-3xl">
              {categoria.emoji}
            </span>
          )}
          <h1 className="text-2xl font-bold tracking-tight text-stone-900 sm:text-3xl">
            {titulo}
          </h1>
        </div>

        <p className="mt-2 max-w-xl text-sm leading-relaxed text-stone-500">
          {categoria?.descripcion ??
            'Catálogo de libros disponible en esta categoría.'}
        </p>

        {!loading && !error && libros && libros.length > 0 && (
          <p className="mt-4 text-sm font-medium text-stone-500">
            {libros.length} {libros.length === 1 ? 'libro' : 'libros'} en esta
            categoría
          </p>
        )}
      </header>

      <div className="mt-8">
        {loading && <LoadingSpinner label={`Cargando libros de ${titulo}…`} />}

        {!loading && error && (
          <ErrorMessage
            title="No pudimos mostrar los libros"
            message={error}
            onRetry={retry}
          >
            <Link
              to="/"
              className="rounded-full border border-red-300 px-4 py-2 text-sm font-semibold text-red-800 transition-colors hover:bg-red-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 focus-visible:ring-offset-red-50"
            >
              Volver a las categorías
            </Link>
          </ErrorMessage>
        )}

        {!loading && !error && libros && libros.length === 0 && (
          <EmptyState
            emoji="📚"
            title="Todavía no tenemos libros en esta categoría"
            message={`Estamos preparando el catálogo de ${titulo}. Vuelve pronto o explora otro género.`}
          >
            <Link
              to="/"
              className="inline-flex rounded-full bg-amber-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-amber-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2"
            >
              Ver otras categorías
            </Link>
          </EmptyState>
        )}

        {!loading && !error && libros && libros.length > 0 && (
          <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {libros.map((libro) => (
              <li key={libro.id} className="animate-fade-in-up">
                <BookCard libro={libro} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  )
}
