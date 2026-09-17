package com.retotiendaartesanal.order.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class CrearPedidoRequest {

    @NotBlank(message = "El nombre del destinatario es obligatorio")
    private String nombreDestinatario;

    @NotBlank(message = "El teléfono es obligatorio")
    private String telefono;

    @NotBlank(message = "La dirección es obligatoria")
    private String direccion;

    @NotBlank(message = "La ciudad es obligatoria")
    private String ciudad;

    @NotBlank(message = "El estado es obligatorio")
    private String estadoDireccion;

    @NotBlank(message = "El código postal es obligatorio")
    private String codigoPostal;
}