// La API vive bajo el base de Vite: en GitHub Pages el service worker de MSW
// queda registrado en /<repo>/ y solo intercepta peticiones dentro de ese
// scope, así que no podemos pedir a la raíz del dominio.
export const API_BASE = `${import.meta.env.BASE_URL}api`

// Tope de espera por petición gestionada con AbortController. El mock demora
// 1 s, así que 8 s deja margen suficiente antes de declarar un timeout.
export const TIMEOUT_MS = 8000

/**
 * Error tipado de la capa de red. `kind` permite decidir en la UI qué hacer:
 * - not-found / bad-request → no tiene sentido reintentar la misma petición
 * - server / network / timeout / invalid → puede ser transitorio
 */
export class ApiError extends Error {
  constructor(kind, message, { status = null, cause } = {}) {
    super(message, { cause })
    this.name = 'ApiError'
    this.kind = kind
    this.status = status
  }
}

function kindParaStatus(status) {
  if (status === 404) return 'not-found'
  if (status === 400) return 'bad-request'
  if (status >= 500) return 'server'
  return 'http'
}

function mensajeParaStatus(status) {
  if (status === 404) return 'El recurso solicitado no existe.'
  if (status === 400) return 'La petición no es válida.'
  if (status >= 500) {
    return 'El servidor tuvo un problema. Intenta nuevamente en unos segundos.'
  }
  return `No pudimos completar la petición (código ${status}).`
}

/**
 * Pide JSON a la API y normaliza todos los fallos en un ApiError.
 *
 * - Aborta con AbortController al desmontar/cambiar de recurso.
 * - Aborta además al superar `timeoutMs`, para que ninguna petición deje la
 *   vista cargando para siempre.
 * - `validate` revisa la forma de los datos y descarta respuestas inesperadas.
 */
export async function pedirJson(
  url,
  { signal, timeoutMs = TIMEOUT_MS, validate } = {},
) {
  const controller = new AbortController()
  let timedOut = false

  const abortar = () => controller.abort(signal?.reason)
  if (signal) {
    if (signal.aborted) controller.abort(signal.reason)
    else signal.addEventListener('abort', abortar, { once: true })
  }

  const timer = setTimeout(() => {
    timedOut = true
    controller.abort()
  }, timeoutMs)

  try {
    const res = await fetch(url, { signal: controller.signal })

    if (!res.ok) {
      // El mock explica el motivo en { error }; si el body no es JSON,
      // caemos a un mensaje según el status.
      const body = await res.json().catch(() => null)
      const mensaje =
        typeof body?.error === 'string' && body.error.trim()
          ? body.error
          : mensajeParaStatus(res.status)

      throw new ApiError(kindParaStatus(res.status), mensaje, {
        status: res.status,
      })
    }

    let data
    try {
      data = await res.json()
    } catch (err) {
      throw new ApiError('invalid', 'La respuesta del servidor no es válida.', {
        cause: err,
      })
    }

    if (validate && !validate(data)) {
      throw new ApiError(
        'invalid',
        'El servidor respondió con un formato inesperado.',
      )
    }

    return data
  } catch (err) {
    if (err instanceof ApiError) throw err

    if (timedOut) {
      const segundos = Math.round(timeoutMs / 1000)
      throw new ApiError(
        'timeout',
        `El servidor tardó más de ${segundos} segundos en responder. Revisa tu conexión e intenta de nuevo.`,
      )
    }

    if (controller.signal.aborted) {
      // Cancelación intencional (navegación o cambio de recurso): no es un
      // error para la persona usuaria y el hook la ignora.
      throw new DOMException('Petición cancelada', 'AbortError')
    }

    throw new ApiError(
      'network',
      'No pudimos conectar con el servidor. Revisa tu conexión e intenta de nuevo.',
      { cause: err },
    )
  } finally {
    clearTimeout(timer)
    signal?.removeEventListener('abort', abortar)
  }
}
