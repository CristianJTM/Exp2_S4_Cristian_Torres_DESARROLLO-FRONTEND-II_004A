import { Link } from 'react-router'

export default function NotFound() {
  return (
    <section className="mx-auto flex max-w-2xl flex-col items-center px-4 py-24 text-center">
      <span aria-hidden="true" className="text-5xl">
        🔎
      </span>
      <p className="mt-6 text-sm font-semibold uppercase tracking-widest text-amber-700">
        Error 404
      </p>
      <h1 className="mt-2 text-3xl font-bold tracking-tight text-stone-900">
        Esta página no existe
      </h1>
      <p className="mt-3 max-w-md text-sm leading-relaxed text-stone-500">
        Puede que el enlace esté equivocado o que la categoría haya cambiado de
        nombre.
      </p>
      <Link
        to="/"
        className="mt-8 rounded-full bg-stone-900 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-stone-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-500 focus-visible:ring-offset-2"
      >
        Volver a la tienda
      </Link>
    </section>
  )
}
