# Cápsula del Tiempo — Frontend

React + Vite + Tailwind.

## Instalar y correr
```bash
npm install
cp .env.example .env
npm run dev
```
Frontend en `http://localhost:5173` (necesita el backend corriendo en el puerto 8080).

## Flujo
1. Regístrate / inicia sesión
2. Crea una cápsula con título y fecha futura de apertura
3. Invita a tu pareja por correo (debe tener cuenta ya creada)
4. Ambos agregan notas o fotos — nadie ve el contenido todavía, solo el conteo
5. Cuando llega la fecha, la cápsula se abre sola y aparece la línea de tiempo con todo
