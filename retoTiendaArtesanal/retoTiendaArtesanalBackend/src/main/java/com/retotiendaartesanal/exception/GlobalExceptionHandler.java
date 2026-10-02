
package com.retotiendaartesanal.exception;

import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
@Slf4j
public class GlobalExceptionHandler {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, String>> handleValidation(MethodArgumentNotValidException ex) {
        Map<String, String> errores = new HashMap<>();
        ex.getBindingResult().getFieldErrors().forEach(error ->
                errores.put(error.getField(), error.getDefaultMessage())
        );
        return ResponseEntity.badRequest().body(errores);
    }

    @ExceptionHandler(EmailYaRegistradoException.class)
    public ResponseEntity<ErrorResponse> handleEmailDuplicado(EmailYaRegistradoException ex, HttpServletRequest request) {
        return construirRespuesta(HttpStatus.CONFLICT, ex.getMessage(), request);
    }

    @ExceptionHandler(CredencialesInvalidasException.class)
    public ResponseEntity<ErrorResponse> handleCredenciales(CredencialesInvalidasException ex, HttpServletRequest request) {
        return construirRespuesta(HttpStatus.UNAUTHORIZED, ex.getMessage(), request);
    }

    @ExceptionHandler(ProductoNoEncontradoException.class)
    public ResponseEntity<ErrorResponse> handleProductoNoEncontrado(ProductoNoEncontradoException ex, HttpServletRequest request) {
        return construirRespuesta(HttpStatus.NOT_FOUND, ex.getMessage(), request);
    }

    @ExceptionHandler(StockInsuficienteException.class)
    public ResponseEntity<ErrorResponse> handleStockInsuficiente(StockInsuficienteException ex, HttpServletRequest request) {
        return construirRespuesta(HttpStatus.CONFLICT, ex.getMessage(), request);
    }

    @ExceptionHandler(CarritoVacioException.class)
    public ResponseEntity<ErrorResponse> handleCarritoVacio(CarritoVacioException ex, HttpServletRequest request) {
        return construirRespuesta(HttpStatus.BAD_REQUEST, ex.getMessage(), request);
    }

    @ExceptionHandler(PedidoNoEncontradoException.class)
    public ResponseEntity<ErrorResponse> handlePedidoNoEncontrado(PedidoNoEncontradoException ex, HttpServletRequest request) {
        return construirRespuesta(HttpStatus.NOT_FOUND, ex.getMessage(), request);
    }

    @ExceptionHandler(ItemCarritoNoEncontradoException.class)
    public ResponseEntity<ErrorResponse> handleItemNoEncontrado(ItemCarritoNoEncontradoException ex, HttpServletRequest request) {
        return construirRespuesta(HttpStatus.NOT_FOUND, ex.getMessage(), request);
    }

    @ExceptionHandler(PedidoNoPagableException.class)
    public ResponseEntity<ErrorResponse> handlePedidoNoPagable(PedidoNoPagableException ex, HttpServletRequest request) {
        return construirRespuesta(HttpStatus.CONFLICT, ex.getMessage(), request);
    }

    // Catch-all: cualquier excepción no prevista cae aquí.
    // Se registra completa en el log (para que el equipo pueda depurarla),
    // pero al cliente solo se le da un mensaje genérico y seguro.
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleGeneral(Exception ex, HttpServletRequest request) {
        log.error("Error no controlado en {} {}: {}", request.getMethod(), request.getRequestURI(), ex.getMessage(), ex);
        return construirRespuesta(HttpStatus.INTERNAL_SERVER_ERROR, "Ocurrió un error inesperado. Intenta de nuevo más tarde.", request);
    }

    private ResponseEntity<ErrorResponse> construirRespuesta(HttpStatus status, String mensaje, HttpServletRequest request) {
        ErrorResponse body = ErrorResponse.builder()
                .timestamp(LocalDateTime.now())
                .status(status.value())
                .error(mensaje)
                .path(request.getRequestURI())
                .build();
        return ResponseEntity.status(status).body(body);
    }
}