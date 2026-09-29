package com.retotiendaartesanal.notification;

import com.retotiendaartesanal.order.Order;
import com.retotiendaartesanal.order.OrderItem;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${mail.from}")
    private String remitente;

    public void enviarConfirmacionPedido(Order order) {
        try {
            MimeMessage mensaje = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mensaje, true, "UTF-8");

            helper.setFrom(remitente);
            helper.setTo(order.getUser().getEmail());
            helper.setSubject("Confirmación de tu pedido #" + order.getId() + " - Hilo & Barro");
            helper.setText(construirHtml(order), true);

            mailSender.send(mensaje);
            log.info("Correo de confirmación enviado para el pedido {}", order.getId());
        } catch (MessagingException e) {
            log.error("Error al enviar correo de confirmación del pedido {}: {}", order.getId(), e.getMessage());
        }
    }

    private String construirHtml(Order order) {
        StringBuilder filas = new StringBuilder();
        for (OrderItem item : order.getItems()) {
            BigDecimal subtotal = item.getPrecioUnitario().multiply(BigDecimal.valueOf(item.getCantidad()));
            filas.append("<tr>")
                 .append("<td style='padding:8px;border-bottom:1px solid #eee;'>").append(item.getNombreProducto()).append("</td>")
                 .append("<td style='padding:8px;border-bottom:1px solid #eee;text-align:center;'>").append(item.getCantidad()).append("</td>")
                 .append("<td style='padding:8px;border-bottom:1px solid #eee;text-align:right;'>$").append(item.getPrecioUnitario()).append("</td>")
                 .append("<td style='padding:8px;border-bottom:1px solid #eee;text-align:right;'>$").append(subtotal).append("</td>")
                 .append("</tr>");
        }

        return """
            <html>
            <body style="font-family: Arial, sans-serif; color:#333; max-width:600px; margin:0 auto;">
                <h2 style="color:#5b3a29;">¡Gracias por tu compra, %s!</h2>
                <p>Tu pedido <strong>#%d</strong> fue confirmado exitosamente.</p>

                <table style="width:100%%; border-collapse:collapse; margin-top:16px;">
                    <thead>
                        <tr style="background:#f4f0ea;">
                            <th style="padding:8px;text-align:left;">Producto</th>
                            <th style="padding:8px;text-align:center;">Cant.</th>
                            <th style="padding:8px;text-align:right;">Precio</th>
                            <th style="padding:8px;text-align:right;">Subtotal</th>
                        </tr>
                    </thead>
                    <tbody>
                        %s
                    </tbody>
                </table>

                <p style="text-align:right; font-size:18px; margin-top:12px;">
                    <strong>Total: $%s MXN</strong>
                </p>

                <h3 style="margin-top:24px;">Datos de envío</h3>
                <p>
                    %s<br>
                    %s<br>
                    %s, %s<br>
                    C.P. %s
                </p>

                <p style="margin-top:24px; color:#888; font-size:13px;">
                    Hilo & Barro — Artesanías hechas a mano
                </p>
            </body>
            </html>
            """.formatted(
                order.getUser().getNombre(),
                order.getId(),
                filas.toString(),
                order.getTotal(),
                order.getNombreDestinatario(),
                order.getDireccion(),
                order.getCiudad(),
                order.getEstadoDireccion(),
                order.getCodigoPostal()
            );
    }
}