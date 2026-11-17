import { BrowserRouter, Route, Routes } from 'react-router'
import AppLayout from './components/layout/AppLayout.jsx'
import Home from './pages/Home.jsx'
import GenreBooks from './pages/GenreBooks.jsx'
import NotFound from './pages/NotFound.jsx'

// En GitHub Pages la app se sirve bajo /<repo>/: el basename evita que
// React Router interprete ese prefijo como parte de la ruta.
const basename = import.meta.env.BASE_URL.replace(/\/$/, '') || '/'

export default function App() {
  return (
    <BrowserRouter basename={basename}>
      <Routes>
        <Route element={<AppLayout />}>
          <Route index element={<Home />} />
          <Route path="genre/:genre" element={<GenreBooks />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
