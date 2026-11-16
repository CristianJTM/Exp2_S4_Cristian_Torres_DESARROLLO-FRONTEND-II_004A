import { CATEGORIAS } from '../data/categorias.js'
import CategoryCard from '../components/ui/CategoryCard.jsx'

export default function Home() {
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
            Explora el catálogo y elige un género. Los libros se cargan desde una API
            REST simulada con Mock Service Worker.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-stone-400">
          Categorías
        </h2>

        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {CATEGORIAS.map((categoria) => (
            <CategoryCard key={categoria.slug} categoria={categoria} />
          ))}
        </div>
      </section>
    </>
  )
}
