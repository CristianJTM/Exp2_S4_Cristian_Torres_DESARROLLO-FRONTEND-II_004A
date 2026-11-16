import { Link } from 'react-router'

export default function CategoryCard({ categoria }) {
  const { slug, nombre, descripcion, emoji } = categoria

  return (
    <Link
      to={`/genre/${slug}`}
      className="group flex h-full flex-col justify-between gap-6 rounded-2xl border border-stone-200 bg-white p-6 shadow-card transition hover:-translate-y-0.5 hover:border-amber-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2"
    >
      <div>
        <span aria-hidden="true" className="text-3xl">
          {emoji}
        </span>
        <h2 className="mt-4 text-lg font-semibold text-stone-900 group-hover:text-amber-800">
          {nombre}
        </h2>
        <p className="mt-1 text-sm leading-relaxed text-stone-500">{descripcion}</p>
      </div>
      <span className="inline-flex items-center gap-1 text-sm font-medium text-amber-700">
        Ver libros
        <span
          aria-hidden="true"
          className="transition-transform group-hover:translate-x-0.5"
        >
          →
        </span>
      </span>
    </Link>
  )
}
