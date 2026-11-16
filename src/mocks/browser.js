import { setupWorker } from 'msw/browser'
import { handlers } from './handlers.js'

// Este módulo se importa de forma dinámica desde main.jsx, solo en desarrollo.
export const worker = setupWorker(...handlers)
