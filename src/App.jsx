import { BrowserRouter, Route, Routes } from 'react-router'
import AppLayout from './components/layout/AppLayout.jsx'
import Home from './pages/Home.jsx'
import GenreBooks from './pages/GenreBooks.jsx'
import NotFound from './pages/NotFound.jsx'

export default function App() {
  return (
    <BrowserRouter>
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
