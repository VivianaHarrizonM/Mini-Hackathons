# Hilo & Barro 

Tienda en línea de artesanías mexicanas hechas a mano. Interfaz en React que consume la API del repositorio hermano `retoTiendaArtesanalBackend`.

## Stack

React 19 · Vite 8 · React Router 7 · Tailwind CSS 3 · Oxlint

## Qué incluye

- Catálogo con búsqueda y filtro por categoría, y detalle de producto
- Registro e inicio de sesión (JWT guardado en el navegador)
- Carrito y checkout con dirección de envío y aceptación de términos
- **Pago con Stripe Checkout:** la app nunca ve ni guarda datos de tarjeta
- Pantalla de resultado del pago (`/pedidos/:id?pago=exito|cancelado`) que espera la confirmación del webhook, con opción de reintentar el pago
- Historial de pedidos con su estado (pendiente, pagado, cancelado)
- Términos y condiciones, aviso de privacidad y política de devoluciones

## Cómo correrlo

Primero levanta el backend (ver su README). Después:

```bash
npm install
npm run dev
```

La app corre en <http://localhost:5173>. Ese puerto debe coincidir con `app.frontend-url` y con el CORS del backend.

Si el backend no está en `http://localhost:8080`, crea un archivo `.env.local` con:

```
VITE_API_URL=http://localhost:8080
```

## Scripts

| Comando | Qué hace |
|---|---|
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Compilación de producción en `dist/` |
| `npm run preview` | Sirve la compilación (usa `-- --port 5173` para que coincida con el CORS) |
| `npm run lint` | Revisión con Oxlint |

## Notas

- En modo desarrollo React ejecuta los efectos dos veces (StrictMode), por eso verás peticiones `GET` duplicadas en la pestaña Network; en la compilación de producción salen una sola vez.
- El carrito se guarda en el navegador y se copia al backend justo antes de pagar.