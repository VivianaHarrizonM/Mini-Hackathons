package com.retotiendaartesanal.catalog;

import com.retotiendaartesanal.catalog.dto.CategoriaResponse;
import com.retotiendaartesanal.catalog.dto.ProductoResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;

    @GetMapping("/productos")
    public List<ProductoResponse> listarProductos(
            @RequestParam(required = false) String categoria) {
        return productService.listarProductos(categoria);
    }

    @GetMapping("/productos/destacados")
    public List<ProductoResponse> listarDestacados() {
        return productService.listarDestacados();
    }

    @GetMapping("/productos/{id}")
    public ProductoResponse obtenerPorId(@PathVariable Long id) {
        return productService.obtenerPorId(id);
    }

    @GetMapping("/productos/slug/{slug}")
    public ProductoResponse obtenerPorSlug(@PathVariable String slug) {
        return productService.obtenerPorSlug(slug);
    }

    @GetMapping("/categorias")
    public List<CategoriaResponse> listarCategorias() {
        return productService.listarCategorias();
    }
}