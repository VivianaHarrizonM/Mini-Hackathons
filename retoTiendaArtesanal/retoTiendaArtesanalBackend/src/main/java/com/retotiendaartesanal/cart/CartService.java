package com.retotiendaartesanal.cart;

import com.retotiendaartesanal.cart.dto.*;
import com.retotiendaartesanal.catalog.Product;
import com.retotiendaartesanal.catalog.ProductRepository;
import com.retotiendaartesanal.exception.ItemCarritoNoEncontradoException;
import com.retotiendaartesanal.exception.ProductoNoEncontradoException;
import com.retotiendaartesanal.exception.StockInsuficienteException;
import com.retotiendaartesanal.security.CurrentUserProvider;
import com.retotiendaartesanal.user.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CartService {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;
    private final CurrentUserProvider currentUserProvider;

    @Transactional
    public Cart obtenerOcrearCarrito(User user) {
        return cartRepository.findByUserId(user.getId())
                .orElseGet(() -> cartRepository.save(Cart.builder().user(user).build()));
    }

    public CartResponse obtenerCarritoActual() {
        User user = currentUserProvider.getUsuarioActual();
        Cart cart = obtenerOcrearCarrito(user);
        return toResponse(cart);
    }

    @Transactional
    public CartResponse agregarItem(AddItemRequest request) {
        User user = currentUserProvider.getUsuarioActual();
        Cart cart = obtenerOcrearCarrito(user);

        Product producto = productRepository.findById(request.getProductoId())
                .orElseThrow(() -> new ProductoNoEncontradoException("Producto no encontrado: " + request.getProductoId()));

        var existente = cartItemRepository.findByCartIdAndProductoId(cart.getId(), producto.getId());

        int cantidadFinal = request.getCantidad() + existente.map(CartItem::getCantidad).orElse(0);

        if (cantidadFinal > producto.getStock()) {
            throw new StockInsuficienteException(
                    "Stock insuficiente para '" + producto.getNombre() + "'. Disponible: " + producto.getStock());
        }

        if (existente.isPresent()) {
            CartItem item = existente.get();
            item.setCantidad(cantidadFinal);
            cartItemRepository.save(item);
        } else {
            CartItem nuevoItem = CartItem.builder()
                    .cart(cart)
                    .producto(producto)
                    .cantidad(request.getCantidad())
                    .build();
            cartItemRepository.save(nuevoItem);
        }

        return toResponse(cartRepository.findById(cart.getId()).orElseThrow());
    }

    @Transactional
    public CartResponse actualizarItem(Long itemId, UpdateItemRequest request) {
        User user = currentUserProvider.getUsuarioActual();
        Cart cart = obtenerOcrearCarrito(user);

        CartItem item = cartItemRepository.findByIdAndCartId(itemId, cart.getId())
                .orElseThrow(() -> new ItemCarritoNoEncontradoException("Item no encontrado en el carrito"));

        if (request.getCantidad() > item.getProducto().getStock()) {
            throw new StockInsuficienteException(
                    "Stock insuficiente para '" + item.getProducto().getNombre() + "'. Disponible: " + item.getProducto().getStock());
        }

        item.setCantidad(request.getCantidad());
        cartItemRepository.save(item);

        return toResponse(cartRepository.findById(cart.getId()).orElseThrow());
    }

    @Transactional
    public CartResponse eliminarItem(Long itemId) {
        User user = currentUserProvider.getUsuarioActual();
        Cart cart = obtenerOcrearCarrito(user);

        CartItem item = cartItemRepository.findByIdAndCartId(itemId, cart.getId())
                .orElseThrow(() -> new ItemCarritoNoEncontradoException("Item no encontrado en el carrito"));

        cartItemRepository.delete(item);

        return toResponse(cartRepository.findById(cart.getId()).orElseThrow());
    }

    @Transactional
    public void vaciarCarrito(Cart cart) {
        cart.getItems().clear();
        cartRepository.save(cart);
    }

    private CartResponse toResponse(Cart cart) {
        List<CartItemResponse> items = cart.getItems().stream()
                .map(item -> CartItemResponse.builder()
                        .id(item.getId())
                        .productoId(item.getProducto().getId())
                        .slug(item.getProducto().getSlug())
                        .nombre(item.getProducto().getNombre())
                        .foto(item.getProducto().getFoto())
                        .precioUnitario(item.getProducto().getPrecio())
                        .cantidad(item.getCantidad())
                        .subtotal(item.getProducto().getPrecio().multiply(BigDecimal.valueOf(item.getCantidad())))
                        .stockDisponible(item.getProducto().getStock())
                        .build())
                .toList();

        BigDecimal total = items.stream()
                .map(CartItemResponse::getSubtotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        return new CartResponse(cart.getId(), items, total);
    }
}