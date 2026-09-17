package com.retotiendaartesanal.order.dto;

import com.retotiendaartesanal.order.OrderStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
public class PedidoResponse {
    private Long id;
    private OrderStatus estado;
    private BigDecimal total;
    private LocalDateTime fechaCreacion;
    private List<PedidoItemResponse> items;
    private String nombreDestinatario;
    private String telefono;
    private String direccion;
    private String ciudad;
    private String estadoDireccion;
    private String codigoPostal;
}