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

La app reenvía al mock el parámetro `fail` que venga en la URL (ver
`src/hooks/useLibros.js`):

- `/genre/misterio?fail=500` → respuesta 500 (`Error interno del servidor`)
- `/genre/misterio?fail=network` → fallo de conexión (`HttpResponse.error()`)
- `/genre/poesia` → 404 del mock (`Género no encontrado`)
- `/genre/drama` → 200 con `[]` → estado vacío amigable (no es un error)

> Con MSW activo, poner DevTools en modo *Offline* no reproduce el error de
> conexión: el service worker responde desde el navegador sin salir a la red.
> Para ese caso usa `?fail=network`.

## Arquitectura de datos

- `src/hooks/useLibros.js` es el **único** punto de red. Encapsula `fetch`,
  `AbortController`, `loading`, `error`, `data` y un `retry` manual.
- `useEffect` depende de `[genre, reload]`: una petición por género, cancelada al
  cambiar de categoría (incluido el doble montaje de `StrictMode`).
- Los libros se guardan en el estado del hook: al volver al Home y entrar de
  nuevo a una categoría se hace una petición nueva (no hay caché). Es
  intencional, para que la demo muestre siempre datos frescos.
- `src/mocks/handlers.js` simula el backend y **no** importa constantes del
  frontend. Los slugs de `src/data/categorias.js` deben coincidir con las claves
  de `booksByGenre`: si agregas una categoría, actualiza ambos archivos.

## Nota sobre MSW y producción

`enableMocking()` en `src/main.jsx` usa `import.meta.env.DEV` (Vite, no
`process.env.NODE_ENV`) y un `import()` dinámico, por lo que MSW **no** se incluye
en el build de producción.

En el build de demostración (`vite build --mode pages`) el mock sí se activa: el
worker se registra con `import.meta.env.BASE_URL` y la ruta de la API se arma
igual (`<base>api/books`) tanto en el handler como en el hook, para que la
petición quede dentro del scope del service worker.

Consecuencia esperada: en `npm run build` + `npm run preview` no hay mock ni
backend, así que las páginas de género muestran el mensaje de error de conexión.
La app está pensada para ejecutarse con `npm run dev`.

