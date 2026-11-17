import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

/**
 * Activa Mock Service Worker en desarrollo y en el build de demostración de
 * GitHub Pages (vite build --mode pages).
 * En Vite el modo se lee con import.meta.env (MODE / DEV), no con process.env.NODE_ENV.
 * En un build de producción normal el primer `if` corta la ejecución y Vite
 * elimina el import dinámico, así que msw no entra al bundle.
 */
async function enableMocking() {
  if (!import.meta.env.DEV && import.meta.env.MODE !== 'pages') return

  const { worker } = await import('./mocks/browser.js')

  return worker.start({
    onUnhandledRequest: 'bypass',
    // En Pages el sitio vive bajo /<repo>/, donde se publica el worker.
    serviceWorker: {
      url: `${import.meta.env.BASE_URL}mockServiceWorker.js`,
    },
  })
}

enableMocking().then(() => {
  ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  )
})
