package com.retotiendaartesanal.order;

import com.retotiendaartesanal.cart.Cart;
import com.retotiendaartesanal.cart.CartItem;
import com.retotiendaartesanal.cart.CartRepository;
import com.retotiendaartesanal.cart.CartService;
import com.retotiendaartesanal.catalog.Product;
import com.retotiendaartesanal.exception.CarritoVacioException;
import com.retotiendaartesanal.exception.PedidoNoEncontradoException;
import com.retotiendaartesanal.exception.StockInsuficienteException;
import com.retotiendaartesanal.legal.LegalContent;
import com.retotiendaartesanal.order.dto.CrearPedidoRequest;
import com.retotiendaartesanal.order.dto.PedidoResponse;
import com.retotiendaartesanal.security.CurrentUserProvider;
import com.retotiendaartesanal.user.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class OrderServiceTest {

    @Mock private OrderRepository orderRepository;
    @Mock private CartRepository cartRepository;
    @Mock private CartService cartService;
    @Mock private CurrentUserProvider currentUserProvider;

    @InjectMocks private OrderService orderService;

    private User usuario;

    @BeforeEach
    void setUp() {
        usuario = User.builder().id(1L).nombre("Ana").email("ana@test.com").build();
        when(currentUserProvider.getUsuarioActual()).thenReturn(usuario);
    }

    private Product producto(Long id, String nombre, String precio, int stock) {
        return Product.builder().id(id).nombre(nombre).precio(new BigDecimal(precio)).stock(stock).build();
    }

    private Cart carrito(CartItem... items) {
        return Cart.builder().id(1L).user(usuario).items(List.of(items)).build();
    }

    private CartItem lineaCarrito(Product producto, int cantidad) {
        return CartItem.builder().producto(producto).cantidad(cantidad).build();
    }

    private CrearPedidoRequest solicitud() {
        CrearPedidoRequest request = new CrearPedidoRequest();
        request.setNombreDestinatario("Viviana Prueba");
        request.setTelefono("5555555555");
        request.setDireccion("Calle Falsa 123");
        request.setCiudad("CDMX");
        request.setEstadoDireccion("CDMX");
        request.setCodigoPostal("01000");
        request.setAceptaTerminos(true);
        return request;
    }

    private Order pedidoGuardado(Long id) {
        OrderItem linea = OrderItem.builder()
                .productoId(1L)
                .nombreProducto("Taza")
                .precioUnitario(new BigDecimal("380.00"))
                .cantidad(1)
                .build();
        return Order.builder()
                .id(id)
                .estado(OrderStatus.PENDIENTE_PAGO)
                .total(new BigDecimal("380.00"))
                .items(List.of(linea))
                .build();
    }

    @Test
    @DisplayName("crearPedido: congela precios, calcula el total, registra términos y vacía el carrito sin tocar el stock")
    void crearPedidoExitoso() {
        Product taza = producto(1L, "Taza", "380.00", 5);
        Product plato = producto(2L, "Plato", "150.00", 10);
        Cart cart = carrito(lineaCarrito(taza, 2), lineaCarrito(plato, 1));

        when(cartRepository.findByUserId(1L)).thenReturn(Optional.of(cart));
        when(orderRepository.save(any(Order.class))).thenAnswer(inv -> {
            Order o = inv.getArgument(0);
            o.setId(20L);
            return o;
        });

        PedidoResponse response = orderService.crearPedido(solicitud());

        ArgumentCaptor<Order> captor = ArgumentCaptor.forClass(Order.class);
        verify(orderRepository).save(captor.capture());
        Order order = captor.getValue();

        assertThat(order.getEstado()).isEqualTo(OrderStatus.PENDIENTE_PAGO);
        assertThat(order.getUser()).isSameAs(usuario);
        assertThat(order.getTotal()).isEqualByComparingTo("910.00");
        assertThat(order.isTerminosAceptados()).isTrue();
        assertThat(order.getVersionTerminosAceptada()).isEqualTo(LegalContent.VERSION_VIGENTE);
        assertThat(order.getItems()).hasSize(2);

        OrderItem primera = order.getItems().get(0);
        assertThat(primera.getProductoId()).isEqualTo(1L);
        assertThat(primera.getNombreProducto()).isEqualTo("Taza");
        assertThat(primera.getPrecioUnitario()).isEqualByComparingTo("380.00");
        assertThat(primera.getCantidad()).isEqualTo(2);

        // El stock se descuenta hasta que Stripe confirme el pago, no aquí.
        assertThat(taza.getStock()).isEqualTo(5);
        assertThat(plato.getStock()).isEqualTo(10);

        verify(cartService).vaciarCarrito(cart);
        assertThat(response).extracting("id").isEqualTo(20L);
    }

    @Test
    @DisplayName("crearPedido: permite pedir exactamente el stock disponible")
    void crearPedidoConStockExacto() {
        Cart cart = carrito(lineaCarrito(producto(1L, "Taza", "380.00", 5), 5));
        when(cartRepository.findByUserId(1L)).thenReturn(Optional.of(cart));

        assertDoesNotThrow(() -> orderService.crearPedido(solicitud()));

        verify(orderRepository).save(any(Order.class));
    }

    @Test
    @DisplayName("crearPedido: si el usuario no tiene carrito lanza CarritoVacio y no guarda nada")
    void crearPedidoSinCarrito() {
        when(cartRepository.findByUserId(1L)).thenReturn(Optional.empty());

        assertThrows(CarritoVacioException.class, () -> orderService.crearPedido(solicitud()));

        verify(orderRepository, never()).save(any());
        verifyNoInteractions(cartService);
    }

    @Test
    @DisplayName("crearPedido: con el carrito vacío lanza CarritoVacio y no guarda nada")
    void crearPedidoConCarritoVacio() {
        when(cartRepository.findByUserId(1L)).thenReturn(Optional.of(carrito()));

        assertThrows(CarritoVacioException.class, () -> orderService.crearPedido(solicitud()));

        verify(orderRepository, never()).save(any());
        verifyNoInteractions(cartService);
    }

    @Test
    @DisplayName("crearPedido: con stock insuficiente lanza StockInsuficiente, no guarda y no vacía el carrito")
    void crearPedidoConStockInsuficiente() {
        Cart cart = carrito(lineaCarrito(producto(1L, "Taza", "380.00", 2), 3));
        when(cartRepository.findByUserId(1L)).thenReturn(Optional.of(cart));

        StockInsuficienteException ex = assertThrows(StockInsuficienteException.class,
                () -> orderService.crearPedido(solicitud()));

        assertThat(ex.getMessage()).contains("Taza").contains("2");
        verify(orderRepository, never()).save(any());
        verifyNoInteractions(cartService);
    }

    @Test
    @DisplayName("obtenerPedido: devuelve un pedido del usuario actual")
    void obtenerPedidoPropio() {
        when(orderRepository.findByIdAndUserId(10L, 1L)).thenReturn(Optional.of(pedidoGuardado(10L)));

        PedidoResponse response = orderService.obtenerPedido(10L);

        assertThat(response).extracting("id").isEqualTo(10L);
    }

    @Test
    @DisplayName("obtenerPedido: un pedido inexistente o de otro usuario lanza PedidoNoEncontrado")
    void obtenerPedidoAjeno() {
        when(orderRepository.findByIdAndUserId(99L, 1L)).thenReturn(Optional.empty());

        assertThrows(PedidoNoEncontradoException.class, () -> orderService.obtenerPedido(99L));
    }

    @Test
    @DisplayName("listarPedidosDelUsuario: devuelve los pedidos del usuario actual")
    void listarPedidos() {
        when(orderRepository.findByUserIdOrderByFechaCreacionDesc(1L))
                .thenReturn(List.of(pedidoGuardado(11L), pedidoGuardado(10L)));

        List<PedidoResponse> respuestas = orderService.listarPedidosDelUsuario();

        assertThat(respuestas).hasSize(2);
    }
}