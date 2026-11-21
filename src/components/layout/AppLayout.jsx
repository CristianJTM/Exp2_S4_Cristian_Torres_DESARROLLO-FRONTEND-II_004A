import { CategoriasProvider } from '../../context/CategoriasContext.jsx'
import { Outlet } from 'react-router'
import Navbar from './Navbar.jsx'

export default function AppLayout() {
  return (
    <CategoriasProvider>
      <div className="flex min-h-screen flex-col">
        <Navbar />

        <main className="flex-1">
          <Outlet />
        </main>

        <footer className="border-t border-stone-200 bg-white">
          <div className="mx-auto max-w-6xl px-4 py-6 text-sm text-stone-500">
            Datos simulados con Mock Service Worker · Desarrollo Frontend II
            (PFY2202)
          </div>
        </footer>
      </div>
    </CategoriasProvider>
  )
}
