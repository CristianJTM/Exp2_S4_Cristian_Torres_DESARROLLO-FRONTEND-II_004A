export default function ErrorMessage({
  title = 'Algo salió mal',
  message,
  onRetry,
  children,
}) {
  return (
    <div
      role="alert"
      className="rounded-2xl border border-red-200 bg-red-50 p-6 text-left"
    >
      <div className="flex items-start gap-4">
        <span aria-hidden="true" className="text-2xl">
          ⚠️
        </span>
        <div className="flex-1">
          <h2 className="text-base font-semibold text-red-900">{title}</h2>
          <p className="mt-1 text-sm leading-relaxed text-red-800">{message}</p>

          {(onRetry || children) && (
            <div className="mt-4 flex flex-wrap items-center gap-3">
              {onRetry && (
                <button
                  type="button"
                  onClick={onRetry}
                  className="rounded-full bg-red-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 focus-visible:ring-offset-red-50"
                >
                  Reintentar
                </button>
              )}
              {children}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
