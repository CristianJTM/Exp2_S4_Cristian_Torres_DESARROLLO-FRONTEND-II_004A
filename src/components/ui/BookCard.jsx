// Una sola instancia: crear el formateador en cada render sería costoso.
const formatoCLP = new Intl.NumberFormat('es-CL', {
  style: 'currency',
  currency: 'CLP',
  maximumFractionDigits: 0,
})

export default function BookCard({ libro }) {
  const { title, author, price } = libro

  return (
    <article className="flex h-full flex-col justify-between rounded-2xl border border-stone-200 bg-white p-5 shadow-card transition hover:-translate-y-0.5 hover:border-amber-300">
      <div>
        <div className="flex items-start justify-between gap-3">
          <span aria-hidden="true" className="text-2xl">
            📕
          </span>
          <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">
            Disponible
          </span>
        </div>
        <h3 className="mt-4 text-base font-semibold leading-snug text-stone-900">
          {title}
        </h3>
        <p className="mt-1 text-sm text-stone-500">{author}</p>
      </div>
      <p className="mt-6 text-lg font-semibold tracking-tight text-amber-700">
        {formatoCLP.format(price)}
      </p>
    </article>
  )
}
