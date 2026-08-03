# Cápsula del Tiempo — Backend

Spring Boot + MySQL + JWT. Mismo patrón que el proyecto de reto de ahorro.

## Requisitos
- Java 17
- Maven
- MySQL corriendo localmente

## Configura la base de datos
Edita `src/main/resources/application.properties` con tu usuario/contraseña de MySQL.
La base `capsula_db` se crea sola al arrancar (`createDatabaseIfNotExist=true`).

## Correr
```bash
mvn spring-boot:run
```
Backend en `http://localhost:8080`.

## Endpoints principales
- `POST /api/auth/register` / `POST /api/auth/login`
- `POST /api/capsulas` — crear cápsula (título, descripción, fechaApertura futura)
- `GET /api/capsulas` — mis cápsulas
- `GET /api/capsulas/{id}` — detalle (incluye si ya está abierta y cuántos recuerdos tiene)
- `GET /api/capsulas/{id}/participantes` / `POST /api/capsulas/{id}/participantes` — invitar por correo (la persona debe tener cuenta)
- `POST /api/capsulas/{id}/recuerdos` — agregar nota o foto (solo mientras está cerrada)
- `GET /api/capsulas/{id}/recuerdos` — devuelve vacío mientras está cerrada; línea de tiempo completa una vez abierta

## Regla de negocio clave
La cápsula **no guarda un estado "abierta" fijo**: se calcula en cada request comparando `fechaApertura` contra la fecha de hoy. Mientras no llegue esa fecha, nadie —ni el propio autor— puede ver el contenido de los recuerdos, solo cuántos hay.
