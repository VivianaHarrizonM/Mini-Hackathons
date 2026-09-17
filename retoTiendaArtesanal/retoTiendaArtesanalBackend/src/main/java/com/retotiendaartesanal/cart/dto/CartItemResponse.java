package com.retotiendaartesanal.cart.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;

@Data
@Builder
@AllArgsConstructor
public class CartItemResponse {
    private Long id;
    private Long productoId;
    private String slug;
    private String nombre;
    private String foto;
    private BigDecimal precioUnitario;
    private Integer cantidad;
    private BigDecimal subtotal;
    private Integer stockDisponible;
}