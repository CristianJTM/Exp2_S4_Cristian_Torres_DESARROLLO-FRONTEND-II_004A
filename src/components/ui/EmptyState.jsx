export default function EmptyState({
  emoji = '📚',
  title = 'Sin libros por ahora',
  message,
  children,
}) {
  return (
    <div className="rounded-2xl border border-dashed border-stone-300 bg-white/70 px-6 py-16 text-center">
      <span aria-hidden="true" className="text-4xl">
        {emoji}
      </span>
      <h2 className="mt-4 text-lg font-semibold text-stone-900">{title}</h2>
      {message && (
        <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-stone-500">
          {message}
        </p>
      )}
      {children && <div className="mt-5">{children}</div>}
    </div>
  )
}
