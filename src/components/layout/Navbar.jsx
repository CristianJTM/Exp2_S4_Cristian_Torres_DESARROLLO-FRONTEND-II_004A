import { Link, NavLink } from 'react-router'
import { CATEGORIAS } from '../../data/categorias.js'

function claseEnlace({ isActive }) {
  return [
    'rounded-full px-3 py-1.5 text-sm font-medium transition-colors',
    isActive
      ? 'bg-amber-100 text-amber-900'
      : 'text-stone-600 hover:bg-stone-100 hover:text-stone-900',
  ].join(' ')
}

export default function Navbar() {
  return (
    <header className="sticky top-0 z-10 border-b border-stone-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3">
        <Link
          to="/"
          className="flex items-center gap-2 rounded-lg text-base font-bold tracking-tight text-stone-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2"
        >
          <span aria-hidden="true" className="text-xl">
            📚
          </span>
          Libroteca
        </Link>

        <nav aria-label="Navegación principal" className="flex items-center gap-1">
          <NavLink to="/" end className={claseEnlace}>
            Inicio
          </NavLink>

          <div className="hidden items-center gap-1 md:flex">
            {CATEGORIAS.map((categoria) => (
              <NavLink
                key={categoria.slug}
                to={`/genre/${categoria.slug}`}
                className={claseEnlace}
              >
                {categoria.nombre}
              </NavLink>
            ))}
          </div>
        </nav>
      </div>
    </header>
  )
}
