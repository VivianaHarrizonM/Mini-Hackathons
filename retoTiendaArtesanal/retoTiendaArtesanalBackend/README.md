# Hilo & Barro 
API REST de una tienda en línea de artesanías mexicanas hechas a mano. Cubre el flujo completo de compra: registro e inicio de sesión, catálogo, carrito, pedidos, **pago con Stripe Checkout (modo prueba)**, confirmación por webhook y correo de confirmación. El frontend vive en el repositorio hermano `retoTiendaArtesanalFront`.


## Stack

- Java 21 · Spring Boot 4.1.1 · Spring Security 7 · Spring Data JPA (Hibernate 7)
- MySQL 8 (Docker) · Mailpit (SMTP de desarrollo, Docker)
- Autenticación JWT sin estado, contraseñas con BCrypt
- Stripe Checkout (pago alojado por Stripe) + webhook
- Lombok · JUnit 5 · Mockito · AssertJ

## Flujo de compra

1. `POST /api/auth/register` o `/login` → devuelve un JWT.
2. `POST /api/carrito/items` agrega productos al carrito del usuario.
3. `POST /api/pedidos` crea el pedido (`PENDIENTE_PAGO`) con la dirección de envío y la aceptación de términos.
4. `POST /api/pedidos/{id}/checkout` devuelve `checkoutUrl`, la página de pago de Stripe.
5. Stripe redirige al frontend a `/pedidos/{id}?pago=exito` o `?pago=cancelado`.
6. Stripe llama a `POST /api/webhooks/stripe` (`checkout.session.completed`): el pedido pasa a `PAGADO`, se descuenta el stock y se envía el correo de confirmación.

## Decisiones de diseño

- **Nunca se tocan datos de tarjeta.** El pago ocurre en la página alojada de Stripe; la API solo recibe el resultado.
- **El webhook es la fuente de verdad del pago**, no la redirección del navegador (el usuario puede cerrar la pestaña o manipular la URL).
- **Webhook idempotente:** si el pedido ya no está en `PENDIENTE_PAGO`, el evento repetido se ignora (no se descuenta stock dos veces).
- **El stock se descuenta al confirmar el pago**, no al crear el pedido. Si dos clientes compran la última pieza, el descuento nunca baja de 0 y se registra un error en el log para revisión.
- **Los pedidos guardan una copia** del nombre y el precio de cada producto al momento de la compra; cambiar el catálogo después no altera pedidos anteriores.
- **Aceptación de términos registrada:** cada pedido guarda la versión de los términos aceptados y la fecha.
- **Límite de peticiones** por IP en rutas sensibles: login y registro 5/min, checkout 10/min. Responde `429` con `Retry-After`.
- **Errores uniformes** `{timestamp, status, error, path}`; los errores de validación devuelven un mapa campo → mensaje.
- **Logs estructurados** sin contraseñas, tokens ni datos de tarjeta.

## Endpoints

| Método | Ruta | Autenticación |
|---|---|---|
| POST | `/api/auth/register`, `/api/auth/login` | No |
| GET | `/api/productos`, `/api/productos/destacados`, `/api/productos/{id}`, `/api/productos/slug/{slug}` | No |
| GET | `/api/categorias` | No |
| GET | `/api/legal/terminos`, `/privacidad`, `/devoluciones` | No |
| GET | `/api/carrito` | Sí |
| POST / PUT / DELETE | `/api/carrito/items`, `/api/carrito/items/{itemId}` | Sí |
| POST / GET | `/api/pedidos`, `/api/pedidos/{id}` | Sí |
| POST | `/api/pedidos/{id}/checkout` | Sí |
| POST | `/api/webhooks/stripe` | Firma de Stripe |

La autenticación se envía como `Authorization: Bearer <token>`.

## Cómo correrlo

Requisitos: Java 21, Docker y el [CLI de Stripe](https://docs.stripe.com/stripe-cli).

```bash
# 1. Base de datos y Mailpit
docker compose up -d

# 2. Configuración local (este archivo NO se sube a git)
cp src/main/resources/application.properties.example src/main/resources/application.properties
```

Edita `application.properties`:

- `spring.datasource.password` → `reto_pass` (el de `docker-compose.yml`)
- `jwt.secret` → genera uno con `openssl rand -base64 48`
- `stripe.secret-key` → clave secreta **de prueba** (`sk_test_...`) de tu panel de Stripe
- `stripe.webhook-secret` → el `whsec_...` que imprime el paso 4
- `app.frontend-url` → `http://localhost:5173`

```bash
# 3. API en http://localhost:8080
./mvnw spring-boot:run

# 4. En otra terminal: reenvía los webhooks de Stripe a tu máquina
stripe listen --events checkout.session.completed --forward-to localhost:8080/api/webhooks/stripe
```

Los correos de confirmación se ven en Mailpit: <http://localhost:8025>.
Para pagar en modo prueba usa la tarjeta `4242 4242 4242 4242`, cualquier fecha futura y cualquier CVC.

## Pruebas

```bash
./mvnw test
```

Pruebas unitarias de autenticación, pedidos y webhook (JUnit 5 + Mockito). La prueba de carga de contexto requiere la base de datos de Docker encendida.

## Limitaciones conocidas

- El límite de peticiones vive en memoria: sirve para una sola instancia; con varias réplicas habría que moverlo a un almacén compartido (por ejemplo Redis).
- El catálogo hace muchas consultas por petición (patrón N+1); es una optimización pendiente.
- Los textos legales son una plantilla de portafolio, **no asesoría legal**. Un negocio real necesita razón social, domicilio, RFC y revisión de un abogado (aviso de privacidad conforme a la LFPDPPP).
- No hay panel de administración, reembolsos ni seguimiento de envíos.
- Las credenciales de `docker-compose.yml` son solo para desarrollo local.