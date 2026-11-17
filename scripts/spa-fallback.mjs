import { copyFile } from 'node:fs/promises'
import { join } from 'node:path'

/**
 * GitHub Pages no reescribe las rutas del cliente. Copiar index.html a 404.html
 * hace que un acceso directo a /genre/ficcion (o un refresh) cargue la SPA y
 * React Router resuelva la ruta con el basename del repositorio.
 */
const dist = join(process.cwd(), 'dist')

await copyFile(join(dist, 'index.html'), join(dist, '404.html'))
console.log('postbuild: dist/404.html generado (fallback SPA para GitHub Pages)')
