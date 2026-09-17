package com.retotiendaartesanal.catalog.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class CategoriaResponse {
    private String id;
    private String nombre;
    private String slug;
}