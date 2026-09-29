package com.retotiendaartesanal.payment;

import com.retotiendaartesanal.exception.PedidoNoEncontradoException;
import com.retotiendaartesanal.exception.PedidoNoPagableException;
import com.retotiendaartesanal.order.Order;
import com.retotiendaartesanal.order.OrderRepository;
import com.retotiendaartesanal.order.OrderStatus;
import com.retotiendaartesanal.payment.dto.CheckoutResponse;
import com.retotiendaartesanal.security.CurrentUserProvider;
import com.retotiendaartesanal.user.User;
import com.stripe.exception.StripeException;
import com.stripe.model.checkout.Session;
import com.stripe.param.checkout.SessionCreateParams;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class CheckoutService {

    private final OrderRepository orderRepository;
    private final CurrentUserProvider currentUserProvider;

    @Value("${app.frontend-url}")
    private String frontendUrl;

    @Transactional
    public CheckoutResponse crearSesionCheckout(Long pedidoId) {
        User user = currentUserProvider.getUsuarioActual();

        Order order = orderRepository.findByIdAndUserId(pedidoId, user.getId())
                .orElseThrow(() -> new PedidoNoEncontradoException("Pedido no encontrado: " + pedidoId));

        if (order.getEstado() != OrderStatus.PENDIENTE_PAGO) {
            throw new PedidoNoPagableException("Este pedido ya no está pendiente de pago");
        }

        SessionCreateParams.Builder paramsBuilder = SessionCreateParams.builder()
                .setMode(SessionCreateParams.Mode.PAYMENT)
                .setSuccessUrl(frontendUrl + "/pedidos/" + order.getId() + "?pago=exito")
                .setCancelUrl(frontendUrl + "/pedidos/" + order.getId() + "?pago=cancelado")
                .putMetadata("pedidoId", String.valueOf(order.getId()));

        order.getItems().forEach(item -> {
            long precioEnCentavos = item.getPrecioUnitario()
                    .multiply(java.math.BigDecimal.valueOf(100))
                    .longValueExact();

            SessionCreateParams.LineItem lineItem = SessionCreateParams.LineItem.builder()
                    .setQuantity(Long.valueOf(item.getCantidad()))
                    .setPriceData(
                            SessionCreateParams.LineItem.PriceData.builder()
                                    .setCurrency("mxn")
                                    .setUnitAmount(precioEnCentavos)
                                    .setProductData(
                                            SessionCreateParams.LineItem.PriceData.ProductData.builder()
                                                    .setName(item.getNombreProducto())
                                                    .build()
                                    )
                                    .build()
                    )
                    .build();

            paramsBuilder.addLineItem(lineItem);
        });

        try {
            Session session = Session.create(paramsBuilder.build());
            order.setStripeSessionId(session.getId());
            orderRepository.save(order);
            return new CheckoutResponse(session.getUrl());
        } catch (StripeException e) {
            throw new RuntimeException("Error al crear la sesión de pago: " + e.getMessage(), e);
        }
    }
}