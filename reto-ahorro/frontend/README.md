# Reto de Ahorro — Frontend

React + Vite + Tailwind, conectado a la API de Spring Boot descrita en el backend.

## Cómo correrlo

```bash
npm install
cp .env.example .env   # ajusta VITE_API_URL si tu backend corre en otro puerto
npm run dev
```

## Estructura

```
src/
  api/            # axiosClient + servicios (auth, goals)
  components/     # Navbar, ProgressBar, GoalCard, ContributionForm, ContributionHistory, PrivateRoute
  context/        # AuthContext (login/register/logout, token en localStorage)
  pages/          # Login, Register, Dashboard, CreateGoal, GoalDetail, Profile
```

## Contrato de API esperado (ajusta a tu backend real)

- `POST /auth/register` `{ nombre, correo, password }` → `{ token, user }`
- `POST /auth/login` `{ correo, password }` → `{ token, user }`
- `GET /users/me` → `{ nombre, correo }`
- `GET /goals` → `[{ id, nombre, objetivo, montoActual, fechaLimite }]`
- `POST /goals` `{ nombre, objetivo, fechaLimite }` → meta creada
- `GET /goals/:id` → meta
- `GET /goals/:id/contributions` → `[{ id, usuarioNombre, cantidad, fecha }]`
- `POST /goals/:id/contributions` `{ cantidad }` → aportación creada

## Identidad visual

- Colores: `jade` (verde ahorro/crecimiento) + `gold` (acento de logro) sobre fondo `sage`.
- Tipografía: Fraunces (títulos) + Inter (texto) + IBM Plex Mono (montos, como en una libreta de ahorros).
- Elemento firma: la barra de progreso principal se dibuja como un frasco que se llena, con una "ola" animada — referencia directa al frasco de ahorros / cochinito.
