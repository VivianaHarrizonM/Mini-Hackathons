package com.retotiendaartesanal.catalog.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
public class ProductoResponse {
    private Long id;
    private String slug;
    private String nombre;
    private String categoria; // solo el slug, ej. "ceramica"
    private BigDecimal precio;
    private String foto;
    private String descripcionCorta;
    private String descripcionLarga;
    private List<String> materiales;
    private List<String> imagenes;
    private Integer stock;
    private String artesano;
    private Integer envioDias;
    private Double calificacion;
    private Integer numResenas;
    private boolean destacado;
    private List<String> tags;
}