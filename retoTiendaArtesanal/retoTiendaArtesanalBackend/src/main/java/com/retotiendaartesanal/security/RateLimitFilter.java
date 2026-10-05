package com.retotiendaartesanal.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;
import java.util.regex.Pattern;

/**
 * Limita la cantidad de peticiones POST a endpoints sensibles por IP
 * (ventana fija en memoria). Frena fuerza bruta en login, creación masiva
 * de cuentas y abuso de la creación de sesiones de Stripe.
 */
@Slf4j
public class RateLimitFilter extends OncePerRequestFilter {

    private record Regla(String nombre, Pattern ruta, int maxPeticiones, Duration ventana) {}

    private static final class Ventana {
        long inicio;
        int contador;
    }

    private static final List<Regla> REGLAS = List.of(
            new Regla("login", Pattern.compile("^/api/auth/login$"), 5, Duration.ofMinutes(1)),
            new Regla("register", Pattern.compile("^/api/auth/register$"), 5, Duration.ofMinutes(1)),
            new Regla("checkout", Pattern.compile("^/api/pedidos/\\d+/checkout$"), 10, Duration.ofMinutes(1))
    );

    private static final int MAX_ENTRADAS_ANTES_DE_LIMPIAR = 10_000;

    private final ConcurrentHashMap<String, Ventana> ventanas = new ConcurrentHashMap<>();

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain chain) throws ServletException, IOException {

        if (!"POST".equals(request.getMethod())) {
            chain.doFilter(request, response);
            return;
        }

        Optional<Regla> reglaOpt = REGLAS.stream()
                .filter(r -> r.ruta().matcher(request.getRequestURI()).matches())
                .findFirst();

        if (reglaOpt.isEmpty()) {
            chain.doFilter(request, response);
            return;
        }

        Regla regla = reglaOpt.get();
        long ahora = System.currentTimeMillis();
        long ventanaMs = regla.ventana().toMillis();
        String clave = regla.nombre() + ":" + request.getRemoteAddr();

        limpiarEntradasExpiradas(ahora);

        Ventana ventana = ventanas.computeIfAbsent(clave, k -> new Ventana());
        boolean permitido;
        long segundosRestantes = 0;

        synchronized (ventana) {
            if (ahora - ventana.inicio >= ventanaMs) {
                ventana.inicio = ahora;
                ventana.contador = 0;
            }
            if (ventana.contador < regla.maxPeticiones()) {
                ventana.contador++;
                permitido = true;
            } else {
                permitido = false;
                segundosRestantes = Math.max(1, (ventana.inicio + ventanaMs - ahora + 999) / 1000);
            }
        }

        if (permitido) {
            chain.doFilter(request, response);
            return;
        }

        log.warn("Rate limit excedido: regla={}, ip={}", regla.nombre(), request.getRemoteAddr());
        responderTooManyRequests(request, response, segundosRestantes);
    }

    private void limpiarEntradasExpiradas(long ahora) {
        if (ventanas.size() > MAX_ENTRADAS_ANTES_DE_LIMPIAR) {
            long maxVentanaMs = REGLAS.stream().mapToLong(r -> r.ventana().toMillis()).max().orElse(60_000);
            ventanas.entrySet().removeIf(e -> ahora - e.getValue().inicio >= maxVentanaMs);
        }
    }

    // La ruta ya pasó el regex (solo caracteres seguros), así que se puede escribir tal cual en el JSON.
    private void responderTooManyRequests(HttpServletRequest request,
                                          HttpServletResponse response,
                                          long segundosRestantes) throws IOException {
        String json = String.format(
                "{\"timestamp\":\"%s\",\"status\":%d,\"error\":\"%s\",\"path\":\"%s\"}",
                LocalDateTime.now(),
                HttpStatus.TOO_MANY_REQUESTS.value(),
                "Demasiados intentos. Intenta de nuevo en " + segundosRestantes + " segundos.",
                request.getRequestURI());

        response.setStatus(HttpStatus.TOO_MANY_REQUESTS.value());
        response.setHeader("Retry-After", String.valueOf(segundosRestantes));
        response.setContentType("application/json");
        response.setCharacterEncoding(StandardCharsets.UTF_8.name());
        response.getWriter().write(json);
    }
}