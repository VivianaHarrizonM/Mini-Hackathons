package com.retotiendaartesanal.payment;

import com.retotiendaartesanal.catalog.Product;
import com.retotiendaartesanal.catalog.ProductRepository;
import com.retotiendaartesanal.notification.EmailService;
import com.retotiendaartesanal.order.Order;
import com.retotiendaartesanal.order.OrderItem;
import com.retotiendaartesanal.order.OrderRepository;
import com.retotiendaartesanal.order.OrderStatus;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class WebhookServiceTest {

    private static final String SESSION_ID = "cs_test_123";

    @Mock private OrderRepository orderRepository;
    @Mock private ProductRepository productRepository;
    @Mock private EmailService emailService;

    @InjectMocks private WebhookService webhookService;

    private Order pedido(OrderStatus estado, OrderItem... items) {
        return Order.builder()
                .id(10L)
                .estado(estado)
                .stripeSessionId(SESSION_ID)
                .items(List.of(items))
                .build();
    }

    private OrderItem item(Long productoId, int cantidad) {
        return OrderItem.builder().productoId(productoId).cantidad(cantidad).build();
    }

    private Product producto(Long id, int stock) {
        return Product.builder().id(id).stock(stock).build();
    }

    @Test
    @DisplayName("pago confirmado: descuenta stock, marca PAGADO y envía el correo")
    void confirmaPago() {
        Order order = pedido(OrderStatus.PENDIENTE_PAGO, item(1L, 2));
        Product product = producto(1L, 5);

        when(orderRepository.findByStripeSessionId(SESSION_ID)).thenReturn(Optional.of(order));
        when(productRepository.findById(1L)).thenReturn(Optional.of(product));

        webhookService.confirmarPagoPorSessionId(SESSION_ID);

        assertThat(product.getStock()).isEqualTo(3);
        assertThat(order.getEstado()).isEqualTo(OrderStatus.PAGADO);
        verify(productRepository).save(product);
        verify(orderRepository).save(order);
        verify(emailService).enviarConfirmacionPedido(order);
    }

    @Test
    @DisplayName("pedido con varios productos: descuenta el stock de cada uno")
    void confirmaPagoConVariosProductos() {
        Order order = pedido(OrderStatus.PENDIENTE_PAGO, item(1L, 2), item(2L, 1));
        Product taza = producto(1L, 5);
        Product plato = producto(2L, 4);

        when(orderRepository.findByStripeSessionId(SESSION_ID)).thenReturn(Optional.of(order));
        when(productRepository.findById(1L)).thenReturn(Optional.of(taza));
        when(productRepository.findById(2L)).thenReturn(Optional.of(plato));

        webhookService.confirmarPagoPorSessionId(SESSION_ID);

        assertThat(taza.getStock()).isEqualTo(3);
        assertThat(plato.getStock()).isEqualTo(3);
        assertThat(order.getEstado()).isEqualTo(OrderStatus.PAGADO);
    }

    @Test
    @DisplayName("webhook duplicado: si el pedido ya está pagado no toca stock ni manda correo")
    void ignoraWebhookDuplicado() {
        Order order = pedido(OrderStatus.PAGADO, item(1L, 2));
        when(orderRepository.findByStripeSessionId(SESSION_ID)).thenReturn(Optional.of(order));

        webhookService.confirmarPagoPorSessionId(SESSION_ID);

        verifyNoInteractions(productRepository, emailService);
        verify(orderRepository, never()).save(any());
        assertThat(order.getEstado()).isEqualTo(OrderStatus.PAGADO);
    }

    @Test
    @DisplayName("sesión sin pedido asociado: no hace nada")
    void ignoraSesionSinPedido() {
        when(orderRepository.findByStripeSessionId(SESSION_ID)).thenReturn(Optional.empty());

        webhookService.confirmarPagoPorSessionId(SESSION_ID);

        verifyNoInteractions(productRepository, emailService);
        verify(orderRepository, never()).save(any());
    }

    @Test
    @DisplayName("stock insuficiente al confirmar: lo deja en cero, no negativo, y confirma el pago")
    void stockNuncaQuedaNegativo() {
        Order order = pedido(OrderStatus.PENDIENTE_PAGO, item(1L, 3));
        Product product = producto(1L, 1);

        when(orderRepository.findByStripeSessionId(SESSION_ID)).thenReturn(Optional.of(order));
        when(productRepository.findById(1L)).thenReturn(Optional.of(product));

        webhookService.confirmarPagoPorSessionId(SESSION_ID);

        assertThat(product.getStock()).isZero();
        assertThat(order.getEstado()).isEqualTo(OrderStatus.PAGADO);
        verify(emailService).enviarConfirmacionPedido(order);
    }

    @Test
    @DisplayName("producto inexistente: lanza error y no marca el pedido como pagado")
    void productoNoEncontrado() {
        Order order = pedido(OrderStatus.PENDIENTE_PAGO, item(99L, 1));

        when(orderRepository.findByStripeSessionId(SESSION_ID)).thenReturn(Optional.of(order));
        when(productRepository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(IllegalStateException.class,
                () -> webhookService.confirmarPagoPorSessionId(SESSION_ID));

        verify(orderRepository, never()).save(any());
        verifyNoInteractions(emailService);
    }
}