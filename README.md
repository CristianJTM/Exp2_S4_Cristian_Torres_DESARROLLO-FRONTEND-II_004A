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
| `/` | `Home` | Grilla de categorías cargada desde la API |
| `/genre/:genre` | `GenreBooks` | Libros de la categoría (loading / error / vacío / data) |
| `*` | `NotFound` | 404 con enlace de retorno |

`:genre` usa los **slugs** definidos en `src/mocks/catalogo.js`:
`ficcion`, `ciencia-ficcion`, `misterio`, `aventura` y `drama`.

## Contrato del mock

### `GET /api/genres` · latencia simulada `delay(1000)`

Devuelve todas las categorías del catálogo:

```json
[
  {
    "slug": "aventura",
    "nombre": "Aventura",
    "emoji": "🧭",
    "descripcion": "Expediciones, tesoros y viajes…",
    "total": 3
  }
]
```

### `GET /api/books?genre=<slug>` · latencia simulada `delay(1000)`

| Caso | Status | Body |
|---|---|---|
| Género válido con libros | 200 | `Book[]` |
| Género válido sin libros (`drama`) | 200 | `[]` |
| Género inexistente | 404 | `{ "error": "Género no encontrado" }` |
| Falta `genre` | 400 | `{ "error": "Parámetro genre requerido" }` |

`Book = { id, title, author, price }`, con `price` entero en CLP.

### Fuente única de datos

`src/mocks/catalogo.js` define cada categoría junto con sus libros. De ahí se
derivan los dos endpoints y las claves de libros, así que **un slug no puede
quedar desincronizado**. Para agregar una categoría basta con editar ese
archivo: Home, Navbar y las rutas la toman automáticamente, sin tocar el
frontend.

## Probar los estados

La app reenvía al mock el parámetro `fail` de la URL (`?fail=...`). Para las
categorías de Home se usa `?failCategorias=...`, de modo que probar el error de
la grilla no afecta la consulta de libros.

| URL | Qué simula |
|---|---|
| `/genre/misterio?fail=500` | Respuesta 500 del servidor |
| `/genre/misterio?fail=network` | Fallo de conexión (`HttpResponse.error()`) |
| `/genre/misterio?fail=timeout` | Respuesta que nunca llega (el cliente aborta a los 8 s) |
| `/genre/misterio?fail=invalid` | Body que no es JSON |
| `/genre/misterio?fail=500-once` | El fallo ocurre solo en la primera consulta |
| `/genre/poesia` | 404 del mock (`Género no encontrado`) |
| `/genre/drama` | 200 con `[]` → estado vacío amigable (no es un error) |
| `/?failCategorias=500` | Error al cargar la grilla de categorías |
| `/?failCategorias=500-once` | Error de categorías recuperable con «Reintentar» |

Los modos `-once` fallan la primera consulta de la página; al pulsar
**Reintentar** la siguiente responde normal. Recarga la página para repetir el
escenario.

### Política de reintento

- `404` / `400`: no se ofrece «Reintentar» (la misma URL no va a cambiar); solo
  se ofrece volver al catálogo.
- `500`, fallo de red, timeout y respuesta inválida: sí se ofrece «Reintentar»,
  porque el fallo puede ser transitorio.
- Cancelaciones por navegación no se muestran como error.

> Con MSW activo, poner DevTools en modo *Offline* no reproduce el error de
> conexión: el service worker responde desde el navegador sin salir a la red.
> Para ese caso usa `?fail=network` o `?fail=network-once`.

## Escenarios de prueba manual

| Escenario | Cómo probarlo | Estado visible | Salida disponible |
|---|---|---|---|
| Categoría nueva | Abrir `/` | 5 tarjetas, incluida Aventura; también en el Navbar | Ver libros |
| Cambio de parámetros con la vista montada | Entrar a `/genre/misterio` y editar la URL agregando o quitando `?fail=500` | La vista no recarga: aborta la consulta anterior y muestra el nuevo estado | Reintentar / volver |
| Género inexistente | `/genre/poesia` | Error 404 con el nombre del género | Solo volver al catálogo |
| Fallo de red transitorio | `/genre/misterio?fail=network-once` | Error de conexión | Reintentar → aparecen los libros |
| Respuesta que no llega | `/genre/misterio?fail=timeout` | Spinner ~8 s y luego error de espera agotada | Reintentar / volver |
| Respuesta inválida | `/genre/misterio?fail=invalid` | Mensaje de respuesta no válida | Reintentar / volver |
| Categoría vacía | `/genre/drama` | Estado vacío amigable | Ver otras categorías |
| Home sin respuesta | `/?failCategorias=timeout` | Spinner y luego error de categorías | Reintentar |

## Arquitectura de datos

- `src/lib/api.js` centraliza la red: `pedirJson()` usa `fetch` +
  `AbortController`, aplica un **timeout de 8 s** por petición y normaliza los
  fallos en un `ApiError` tipado (`not-found`, `bad-request`, `server`,
  `network`, `timeout`, `invalid`).
- `src/hooks/useRecurso.js` encapsula `loading`, `error`, `data`, cancelación y
  reintento. `useLibros` y `useCategorias` solo arman la URL y validan la forma
  de la respuesta (array de libros / de categorías).
- `CategoriasProvider` (en `AppLayout`) hace **una sola** consulta a
  `/api/genres` y la comparte con Navbar, Home y la cabecera de `GenreBooks`.
  Home ya no importa un arreglo fijo: el catálogo se alimenta desde el mock.
- `GenreBooks` lee `?fail=` con `useSearchParams()`; el hook ya no toca
  `window.location`. Cambiar la query con la vista montada vuelve a consultar y
  cancela la petición anterior.
- El efecto depende de la URL y del contador de reintento: una petición por
  recurso, cancelada al cambiar de género (incluido el doble montaje de
  `StrictMode`).
- Al volver al Home y entrar de nuevo a una categoría se piden libros frescos
  (no hay caché de libros). Las categorías sí quedan en memoria mientras la app
  está montada.

## Nota sobre MSW y producción

`enableMocking()` en `src/main.jsx` usa `import.meta.env.DEV` (Vite, no
`process.env.NODE_ENV`) y un `import()` dinámico, por lo que MSW **no** se incluye
en el build de producción.

En el build de demostración (`vite build --mode pages`) el mock sí se activa.

### MSW en local y en GitHub Pages

El mismo mock corre en ambos entornos; cambia solo el prefijo de la URL.

- **Local (`npm run dev`):** `BASE_URL` es `/`, el worker se registra en la raíz
  con scope `/` y la API es `/api/genres` y `/api/books`.
- **GitHub Pages:** `BASE_URL` es `/<repo>/`, el worker queda con scope
  `/<repo>/` y la API es `/<repo>/api/genres` y `/<repo>/api/books`. Las rutas se
  arman con `import.meta.env.BASE_URL` tanto en el handler como en
  `src/lib/api.js`, porque un service worker solo intercepta las peticiones
  dentro de su scope.
- **`npm run build` (producción normal):** el mock no se carga; en
  `npm run preview` la app no tiene backend y muestra un error al pedir las
  categorías.
- Si actualizas la demo publicada, haz un *hard refresh*: el navegador puede
  conservar el service worker anterior.

La app está pensada para ejecutarse con `npm run dev` o con el build de
demostración (`--mode pages`).
