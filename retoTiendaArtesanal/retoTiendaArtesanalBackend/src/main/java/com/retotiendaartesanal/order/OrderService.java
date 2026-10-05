package com.retotiendaartesanal.order;

import com.retotiendaartesanal.cart.Cart;
import com.retotiendaartesanal.cart.CartItem;
import com.retotiendaartesanal.cart.CartRepository;
import com.retotiendaartesanal.cart.CartService;
import com.retotiendaartesanal.exception.CarritoVacioException;
import com.retotiendaartesanal.exception.PedidoNoEncontradoException;
import com.retotiendaartesanal.exception.StockInsuficienteException;
import com.retotiendaartesanal.order.dto.CrearPedidoRequest;
import com.retotiendaartesanal.order.dto.PedidoItemResponse;
import com.retotiendaartesanal.order.dto.PedidoResponse;
import com.retotiendaartesanal.security.CurrentUserProvider;
import com.retotiendaartesanal.user.User;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class OrderService {

    private final OrderRepository orderRepository;
    private final CartRepository cartRepository;
    private final CartService cartService;
    private final CurrentUserProvider currentUserProvider;

    @Transactional
    public PedidoResponse crearPedido(CrearPedidoRequest request) {
        User user = currentUserProvider.getUsuarioActual();

        Cart cart = cartRepository.findByUserId(user.getId())
                .orElseThrow(() -> {
                    log.warn("Usuario {} intentó crear un pedido con carrito inexistente", user.getId());
                    return new CarritoVacioException("Tu carrito está vacío");
                });

        if (cart.getItems().isEmpty()) {
            log.warn("Usuario {} intentó crear un pedido con el carrito vacío", user.getId());
            throw new CarritoVacioException("Tu carrito está vacío");
        }

        // Validar stock disponible para cada item (sin descontarlo todavía)
        for (CartItem item : cart.getItems()) {
            if (item.getCantidad() > item.getProducto().getStock()) {
                log.warn("Stock insuficiente para producto {} (usuario {}): solicitado={}, disponible={}",
                        item.getProducto().getId(), user.getId(), item.getCantidad(), item.getProducto().getStock());
                throw new StockInsuficienteException(
                        "Stock insuficiente para '" + item.getProducto().getNombre() +
                        "'. Disponible: " + item.getProducto().getStock());
            }
        }

        Order order = Order.builder()
                .user(user)
                .estado(OrderStatus.PENDIENTE_PAGO)
                .fechaCreacion(LocalDateTime.now())
                .nombreDestinatario(request.getNombreDestinatario())
                .telefono(request.getTelefono())
                .direccion(request.getDireccion())
                .ciudad(request.getCiudad())
                .estadoDireccion(request.getEstadoDireccion())
                .codigoPostal(request.getCodigoPostal())
                .total(BigDecimal.ZERO)
                .terminosAceptados(request.isAceptaTerminos())
                .versionTerminosAceptada(com.retotiendaartesanal.legal.LegalContent.VERSION_VIGENTE)
                .fechaAceptacionTerminos(LocalDateTime.now())
                .build();

        List<OrderItem> orderItems = cart.getItems().stream()
                .map(item -> OrderItem.builder()
                        .order(order)
                        .productoId(item.getProducto().getId())
                        .nombreProducto(item.getProducto().getNombre())
                        .precioUnitario(item.getProducto().getPrecio())
                        .cantidad(item.getCantidad())
                        .build())
                .toList();

        BigDecimal total = orderItems.stream()
                .map(oi -> oi.getPrecioUnitario()
                        .multiply(BigDecimal.valueOf(oi.getCantidad())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        order.setItems(orderItems);
        order.setTotal(total);

        orderRepository.save(order);

        // El carrito se vacía porque ya se "congeló" en el pedido.
        // El stock NO se descuenta aquí — eso pasa solo cuando Stripe confirme el pago (Paso 6).
        cartService.vaciarCarrito(cart);

        log.info("Pedido {} creado para usuario {} con {} items, total={}",
                order.getId(), user.getId(), orderItems.size(), total);

        return toResponse(order);
    }

    public List<PedidoResponse> listarPedidosDelUsuario() {
        User user = currentUserProvider.getUsuarioActual();
        return orderRepository.findByUserIdOrderByFechaCreacionDesc(user.getId())
                .stream().map(this::toResponse).toList();
    }

    public PedidoResponse obtenerPedido(Long id) {
        User user = currentUserProvider.getUsuarioActual();
        Order order = orderRepository.findByIdAndUserId(id, user.getId())
                .orElseThrow(() -> {
                    log.warn("Usuario {} intentó acceder a pedido {} inexistente o ajeno", user.getId(), id);
                    return new PedidoNoEncontradoException("Pedido no encontrado: " + id);
                });
        return toResponse(order);
    }

    private PedidoResponse toResponse(Order order) {
    List<PedidoItemResponse> items = order.getItems().stream()
            .map(oi -> PedidoItemResponse.builder()
                    .productoId(oi.getProductoId())
                    .nombreProducto(oi.getNombreProducto())
                    .precioUnitario(oi.getPrecioUnitario())
                    .cantidad(oi.getCantidad())
                    .subtotal(oi.getPrecioUnitario().multiply(BigDecimal.valueOf(oi.getCantidad())))
                    .build())
            .toList();

    return PedidoResponse.builder()
            .id(order.getId())
            .estado(order.getEstado())
            .total(order.getTotal())
            .fechaCreacion(order.getFechaCreacion())
            .items(items)
            .nombreDestinatario(order.getNombreDestinatario())
            .telefono(order.getTelefono())
            .direccion(order.getDireccion())
            .ciudad(order.getCiudad())
            .estadoDireccion(order.getEstadoDireccion())
            .codigoPostal(order.getCodigoPostal())
            .terminosAceptados(order.isTerminosAceptados())
            .versionTerminosAceptada(order.getVersionTerminosAceptada())
            .build();
    }
}