package com.retotiendaartesanal.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
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
    public ResponseEntity<Map<String, String>> handleEmailDuplicado(EmailYaRegistradoException ex) {
        return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("error", ex.getMessage()));
    }

    @ExceptionHandler(CredencialesInvalidasException.class)
    public ResponseEntity<Map<String, String>> handleCredenciales(CredencialesInvalidasException ex) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", ex.getMessage()));
    }
    @ExceptionHandler(ProductoNoEncontradoException.class)
    public ResponseEntity<Map<String, String>> handleProductoNoEncontrado(ProductoNoEncontradoException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", ex.getMessage()));
    }

    @ExceptionHandler(StockInsuficienteException.class)
      public ResponseEntity<Map<String, String>> handleStockInsuficiente(StockInsuficienteException ex) {
          return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("error", ex.getMessage()));
      }

      @ExceptionHandler(CarritoVacioException.class)
      public ResponseEntity<Map<String, String>> handleCarritoVacio(CarritoVacioException ex) {
          return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", ex.getMessage()));
      }

      @ExceptionHandler(PedidoNoEncontradoException.class)
      public ResponseEntity<Map<String, String>> handlePedidoNoEncontrado(PedidoNoEncontradoException ex) {
          return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", ex.getMessage()));
      }

      @ExceptionHandler(PedidoNoPagableException.class)
      public ResponseEntity<Map<String, String>> handlePedidoNoPagable(PedidoNoPagableException ex) {
          return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("error", ex.getMessage()));
      }
      @ExceptionHandler(ItemCarritoNoEncontradoException.class)
      public ResponseEntity<Map<String, String>> handleItemNoEncontrado(ItemCarritoNoEncontradoException ex) {
          return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", ex.getMessage()));
      }

}