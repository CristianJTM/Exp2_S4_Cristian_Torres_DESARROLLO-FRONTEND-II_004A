export default function LoadingSpinner({ label = 'Cargando libros…' }) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-stone-300 bg-white/70 px-6 py-16 text-center"
    >
      <span
        aria-hidden="true"
        className="h-10 w-10 animate-spin rounded-full border-4 border-amber-200 border-t-amber-600"
      />
      <span className="text-sm font-medium text-stone-600">{label}</span>
    </div>
  )
}
