import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

/**
 * Activa Mock Service Worker SOLO en desarrollo.
 * En Vite el modo se lee con import.meta.env (MODE / DEV), no con process.env.NODE_ENV.
 * El import dinámico permite que Vite elimine msw del bundle de producción.
 */
async function enableMocking() {
  if (!import.meta.env.DEV) return

  const { worker } = await import('./mocks/browser.js')

  return worker.start({
    onUnhandledRequest: 'bypass',
  })
}

enableMocking().then(() => {
  ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  )
})
