# Reto de Ahorro — Backend (paso 1: Auth con JWT)

Spring Boot 3 + Java 21 + Spring Security + JWT + MySQL.

## Qué incluye este paso

- `POST /auth/register` — crea usuario, devuelve `{ token, user }`
- `POST /auth/login` — valida credenciales, devuelve `{ token, user }`
- `GET /users/me` — requiere JWT válido en `Authorization: Bearer <token>`
- Passwords hasheados con BCrypt
- Filtro JWT que autentica cada request
- CORS habilitado para `http://localhost:5173` (el frontend Vite)

## Cómo correrlo

1. Crea la base de datos (o deja que Hibernate la cree sola gracias a
   `createDatabaseIfNotExist=true` en `application.properties`):
   ```sql
   CREATE DATABASE IF NOT EXISTS reto_ahorro;
   ```
2. Ajusta usuario/password de MySQL en `src/main/resources/application.properties`
   si no usas `root` sin password.
3. Corre:
   ```bash
   mvn spring-boot:run
   ```
4. La API queda en `http://localhost:8080`.

## Probarlo rápido con curl

```bash
# Registro
curl -X POST http://localhost:8080/auth/register \
  -H "Content-Type: application/json" \
  -d '{"nombre":"Viviana","correo":"viviana@gmail.com","password":"123456"}'

# Login
curl -X POST http://localhost:8080/auth/login \
  -H "Content-Type: application/json" \
  -d '{"correo":"viviana@gmail.com","password":"123456"}'

# Ruta protegida (usa el token que te devolvió login/register)
curl http://localhost:8080/users/me \
  -H "Authorization: Bearer TU_TOKEN_AQUI"
```

## Estructura

```
src/main/java/com/retoahorro/
  RetoAhorroApplication.java
  config/SecurityConfig.java       # reglas de seguridad, CORS, beans
  security/JwtService.java         # generar/validar tokens
  security/JwtAuthFilter.java      # intercepta cada request
  user/
    User.java                      # entidad, implementa UserDetails
    UserRepository.java
    UserResponse.java              # DTO de salida (sin password)
    UserDetailsServiceImpl.java
    UserController.java            # GET /users/me
  auth/
    AuthController.java            # POST /auth/register, /auth/login
    AuthService.java
    dto/RegisterRequest.java
    dto/LoginRequest.java
    dto/AuthResponse.java
  exception/GlobalExceptionHandler.java
```

## Siguiente paso

Con esto ya deberías poder registrarte e iniciar sesión desde el frontend
de React sin el error "No se pudo crear la cuenta". Lo que sigue: las
entidades `Meta`, `Participante` y `Aportacion`, y sus endpoints.

⚠️ Nota: este backend no se compiló/probó dentro de este entorno (no hay
acceso a Maven Central desde aquí), así que corre `mvn spring-boot:run`
en tu máquina y avísame si algo truena para ajustarlo.
