# Libroteca · Tienda de Libros

SPA de tienda de libros que consume una API REST **simulada con Mock Service Worker (MSW v2)**.
No hay backend real: el "servidor" vive en `src/mocks/`.

Actividad formativa — Semana 4 de Desarrollo Frontend II (PFY2202).

## Stack

| Pieza | Versión |
|---|---|
| React | 18.3.1 |
| React Router | 7 (se importa desde `react-router`) |
| Vite | 5 |
| MSW | 2.x (solo desarrollo) |
| Tailwind CSS | 3 (PostCSS) |

## Instalación

```bash
npm install
npm run dev
```

Abrir <http://localhost:5173>. En la consola del navegador debe aparecer
`[MSW] Mocking enabled.`

> `public/mockServiceWorker.js` ya está versionado. Si actualizas MSW, regenéralo
> con `npx msw init public --save`.

## Rutas

| Ruta | Componente | Descripción |
|---|---|---|
| `/` | `Home` | Grilla de categorías |
| `/genre/:genre` | `GenreBooks` | Libros de la categoría (loading / error / vacío / data) |
| `*` | `NotFound` | 404 con enlace de retorno |

`:genre` usa **slugs**: `ficcion`, `ciencia-ficcion`, `misterio`, `drama`.

## Contrato del mock

`GET /api/books?genre=<slug>` · latencia simulada `delay(1000)`

| Caso | Status | Body |
|---|---|---|
| Género válido con libros | 200 | `Book[]` |
| Género válido sin libros (`drama`) | 200 | `[]` |
| Género inexistente | 404 | `{ "error": "Género no encontrado" }` |
| Falta `genre` | 400 | `{ "error": "Parámetro genre requerido" }` |

`Book = { id, title, author, price }`, con `price` entero en CLP.

### Probar los estados de error

El handler acepta un parámetro extra para pruebas manuales:

- `/genre/misterio?fail=500` → error de servidor
- `/genre/misterio?fail=network` → fallo de red
- `/genre/poesia` → 404 del mock
- DevTools → Network → Offline → recargar una categoría → error de conexión

## Arquitectura de datos

- `src/hooks/useLibros.js` es el **único** punto de red. Encapsula `fetch`,
  `AbortController`, `loading`, `error`, `data` y un `retry` manual.
- `useEffect` depende de `[genre, reload]`: una petición por género, cancelada al
  cambiar de categoría (incluido el doble montaje de `StrictMode`).
- `src/mocks/handlers.js` simula el backend y **no** importa constantes del
  frontend. Los slugs de `src/data/categorias.js` deben coincidir con las claves
  de `booksByGenre`: si agregas una categoría, actualiza ambos archivos.

## Nota sobre MSW y producción

`enableMocking()` en `src/main.jsx` usa `import.meta.env.DEV` (Vite, no
`process.env.NODE_ENV`) y un `import()` dinámico, por lo que MSW **no** se incluye
en el build de producción.

Consecuencia esperada: en `npm run build` + `npm run preview` no hay mock ni
backend, así que las páginas de género muestran el mensaje de error de conexión.
La app está pensada para ejecutarse con `npm run dev`.

## Despliegue en GitHub Pages

El sitio se publica desde la rama `gh_pages`:

```bash
npm run deploy
```

`predeploy` compila el proyecto y `postbuild` copia `dist/index.html` a
`dist/404.html`, de modo que un enlace directo (`/genre/ficcion`) o un refresco
sigan cargando la SPA.

- URL: <https://cristianjtm.github.io/Exp2_S4_Cristian_Torres_DESARROLLO-FRONTEND-II_004A/>
- Configuración en GitHub: *Settings → Pages → Source: Deploy from a branch →
  Branch: `gh_pages` / (root)*.
- El `base` de Vite se define con la constante `REPO` en `vite.config.js`: si el
  repositorio cambia de nombre, actualiza ese valor.

> En Pages se sirve un build de producción, así que el mock está apagado: la
> portada funciona, pero al entrar a una categoría se ve el estado de error.
> Es el comportamiento esperado y la evidencia de que MSW no viaja al build.

