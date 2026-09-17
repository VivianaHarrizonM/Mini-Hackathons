package com.retotiendaartesanal.catalog;

import com.retotiendaartesanal.catalog.dto.CategoriaResponse;
import com.retotiendaartesanal.catalog.dto.ProductoResponse;
import com.retotiendaartesanal.exception.ProductoNoEncontradoException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final ProductMapper mapper;

    public List<ProductoResponse> listarProductos(String categoriaSlug) {
        List<Product> productos = (categoriaSlug != null && !categoriaSlug.isBlank())
                ? productRepository.findByCategoriaId(categoriaSlug)
                : productRepository.findAll();

        return productos.stream().map(mapper::toResponse).toList();
    }

    public ProductoResponse obtenerPorId(Long id) {
        Product producto = productRepository.findById(id)
                .orElseThrow(() -> new ProductoNoEncontradoException("Producto no encontrado: " + id));
        return mapper.toResponse(producto);
    }

    public ProductoResponse obtenerPorSlug(String slug) {
        Product producto = productRepository.findBySlug(slug)
                .orElseThrow(() -> new ProductoNoEncontradoException("Producto no encontrado: " + slug));
        return mapper.toResponse(producto);
    }

    public List<ProductoResponse> listarDestacados() {
        return productRepository.findByDestacadoTrue().stream().map(mapper::toResponse).toList();
    }

    public List<CategoriaResponse> listarCategorias() {
        return categoryRepository.findAll().stream().map(mapper::toResponse).toList();
    }
}