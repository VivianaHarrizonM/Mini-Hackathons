package com.retotiendaartesanal.catalog;

import com.retotiendaartesanal.catalog.dto.CategoriaResponse;
import com.retotiendaartesanal.catalog.dto.ProductoResponse;
import org.springframework.stereotype.Component;

@Component
public class ProductMapper {

    public ProductoResponse toResponse(Product p) {
        return ProductoResponse.builder()
                .id(p.getId())
                .slug(p.getSlug())
                .nombre(p.getNombre())
                .categoria(p.getCategoria().getId())
                .precio(p.getPrecio())
                .foto(p.getFoto())
                .descripcionCorta(p.getDescripcionCorta())
                .descripcionLarga(p.getDescripcionLarga())
                .materiales(p.getMateriales())
                .imagenes(p.getImagenes())
                .stock(p.getStock())
                .artesano(p.getArtesano())
                .envioDias(p.getEnvioDias())
                .calificacion(p.getCalificacion())
                .numResenas(p.getNumResenas())
                .destacado(p.isDestacado())
                .tags(p.getTags())
                .build();
    }

    public CategoriaResponse toResponse(Category c) {
        return new CategoriaResponse(c.getId(), c.getNombre(), c.getSlug());
    }
}