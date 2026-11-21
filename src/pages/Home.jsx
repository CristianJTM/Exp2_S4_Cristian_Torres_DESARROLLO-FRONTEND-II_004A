import { useCategoriasContext } from '../context/CategoriasContext.jsx'
import CategoryCard from '../components/ui/CategoryCard.jsx'
import LoadingSpinner from '../components/ui/LoadingSpinner.jsx'
import ErrorMessage from '../components/ui/ErrorMessage.jsx'
import EmptyState from '../components/ui/EmptyState.jsx'

export default function Home() {
  const { categorias, loading, error, retry } = useCategoriasContext()

  return (
    <>
      <section className="border-b border-stone-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:py-20">
          <p className="text-sm font-semibold uppercase tracking-widest text-amber-700">
            Tienda de libros
          </p>
          <h1 className="mt-3 max-w-2xl text-3xl font-bold leading-tight tracking-tight text-stone-900 sm:text-4xl">
            Encuentra tu próxima lectura por categoría
          </h1>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-stone-600">
            Explora el catálogo y elige un género. Las categorías y los libros se
            cargan desde una API REST simulada con Mock Service Worker.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-stone-400">
          Categorías
        </h2>

        <div className="mt-6">
          {loading && <LoadingSpinner label="Cargando categorías…" />}

          {!loading && error && (
            <ErrorMessage
              title="No pudimos cargar las categorías"
              message={error.message}
              onRetry={retry}
            />
          )}

          {!loading && !error && categorias && categorias.length === 0 && (
            <EmptyState
              emoji="🗂️"
              title="Todavía no hay categorías"
              message="El catálogo está vacío por ahora. Intenta cargar la lista nuevamente."
            >
              <button
                type="button"
                onClick={retry}
                className="rounded-full bg-amber-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-amber-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2"
              >
                Reintentar
              </button>
            </EmptyState>
          )}

          {!loading && !error && categorias && categorias.length > 0 && (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {categorias.map((categoria) => (
                <CategoryCard key={categoria.slug} categoria={categoria} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  )
}
