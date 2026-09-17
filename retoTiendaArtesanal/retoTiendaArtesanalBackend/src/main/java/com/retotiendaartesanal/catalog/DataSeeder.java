package com.retotiendaartesanal.catalog;

import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.List;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;

    @Override
    public void run(String... args) {
        if (categoryRepository.count() > 0) {
            return; // ya hay datos, no duplicar
        }

        categoryRepository.saveAll(List.of(
                new Category("ceramica", "Cerámica", "ceramica"),
                new Category("textil", "Textil", "textil"),
                new Category("joyeria", "Joyería", "joyeria"),
                new Category("madera", "Madera", "madera"),
                new Category("cuero", "Cuero", "cuero"),
                new Category("papel", "Papel", "papel")
        ));

        Category ceramica = categoryRepository.findById("ceramica").orElseThrow();
        Category textil = categoryRepository.findById("textil").orElseThrow();
        Category joyeria = categoryRepository.findById("joyeria").orElseThrow();
        Category madera = categoryRepository.findById("madera").orElseThrow();
        Category cuero = categoryRepository.findById("cuero").orElseThrow();
        Category papel = categoryRepository.findById("papel").orElseThrow();

        productRepository.saveAll(List.of(
            Product.builder()
                .slug("taza-esmalte-ceniza").nombre("Taza de esmalte ceniza").categoria(ceramica)
                .precio(new BigDecimal("380")).foto("/images/productos/taza-esmalte-ceniza.jpg")
                .descripcionCorta("Taza torneada a mano con esmalte de ceniza de madera, cada pieza sale distinta del horno.")
                .descripcionLarga("Cada taza se tornea a mano en el taller y se cubre con un esmalte hecho a base de ceniza de madera recolectada del mismo horno de leña. El resultado es una superficie con variaciones únicas de textura y tono — no hay dos piezas iguales. Capacidad de 300ml, apta para microondas y lavavajillas en ciclo suave.")
                .materiales(List.of("Gres", "Esmalte de ceniza natural"))
                .imagenes(List.of("#c9beac", "#b8ab94"))
                .stock(14).artesano("Taller Barro Norte").envioDias(5)
                .calificacion(4.8).numResenas(32).destacado(true).tags(List.of("nuevo"))
                .build(),

            Product.builder()
                .slug("rebozo-algodon-indigo").nombre("Rebozo de algodón teñido con índigo").categoria(textil)
                .precio(new BigDecimal("890")).foto("/images/productos/rebozo-algodon-indigo.jpg")
                .descripcionCorta("Tejido en telar de cintura y teñido a mano con añil natural, técnica de reserva (amarrado).")
                .descripcionLarga("Este rebozo se teje en telar de cintura, un proceso que puede tomar hasta dos semanas por pieza. El teñido usa añil (índigo) natural fermentado en tina, con técnica de amarrado para lograr el patrón. El azul se profundiza con cada lavado durante los primeros meses de uso.")
                .materiales(List.of("Algodón 100%", "Tinte de añil natural"))
                .imagenes(List.of("#33465c", "#425875"))
                .stock(6).artesano("Cooperativa Hilo Azul").envioDias(7)
                .calificacion(5.0).numResenas(18).destacado(true).tags(List.of("pieza única"))
                .build(),

            Product.builder()
                .slug("aretes-plata-martillada").nombre("Aretes de plata martillada").categoria(joyeria)
                .precio(new BigDecimal("540")).foto("/images/productos/aretes-plata-martillada.jpg")
                .descripcionCorta("Plata 950 forjada y martillada a mano, acabado orgánico con textura irregular intencional.")
                .descripcionLarga("Forjados a partir de lámina de plata 950, cada arete se martilla individualmente para lograr una textura orgánica — las pequeñas irregularidades son parte del diseño, no un defecto. Broche de mariposa, largo total de 3cm.")
                .materiales(List.of("Plata 950"))
                .imagenes(List.of("#8c8579", "#a39c8e"))
                .stock(21).artesano("Estudio Forja Sur").envioDias(4)
                .calificacion(4.6).numResenas(45).destacado(false).tags(List.of())
                .build(),

            Product.builder()
                .slug("tabla-cortar-parota").nombre("Tabla para cortar de parota").categoria(madera)
                .precio(new BigDecimal("620")).foto("/images/productos/tabla-cortar-parota.jpg")
                .descripcionCorta("Tallada de una sola pieza de madera de parota recuperada, veta natural visible.")
                .descripcionLarga("Cada tabla se corta y lija a mano de madera de parota proveniente de árboles caídos o de manejo forestal certificado — no se tala nada nuevo para hacerlas. Se sella con aceite mineral apto para alimentos. Mide aproximadamente 35x22cm, el grosor y la veta varían pieza a pieza.")
                .materiales(List.of("Madera de parota", "Aceite mineral food-grade"))
                .imagenes(List.of("#a8503a", "#8f4530"))
                .stock(9).artesano("Carpintería El Roble").envioDias(6)
                .calificacion(4.9).numResenas(27).destacado(true).tags(List.of("sustentable"))
                .build(),

            Product.builder()
                .slug("bolsa-cuero-vegetal").nombre("Bolsa de cuero curtido vegetal").categoria(cuero)
                .precio(new BigDecimal("1450")).foto("/images/productos/bolsa-cuero-vegetal.jpg")
                .descripcionCorta("Curtido vegetal (sin cromo), cosido a mano con hilo encerado, herrajes de latón macizo.")
                .descripcionLarga("El cuero se curte con taninos vegetales, un proceso más lento pero libre de químicos agresivos. Cada costura se hace a mano con hilo encerado y punto de silla, mucho más resistente que la máquina. Con el uso, el cuero desarrolla una pátina única.")
                .materiales(List.of("Cuero curtido vegetal", "Latón macizo", "Hilo encerado"))
                .imagenes(List.of("#707d54", "#5f6b46"))
                .stock(5).artesano("Talabartería Sur").envioDias(8)
                .calificacion(4.7).numResenas(14).destacado(true).tags(List.of("edición limitada"))
                .build(),

            Product.builder()
                .slug("cuaderno-papel-algodon").nombre("Cuaderno de papel de algodón").categoria(papel)
                .precio(new BigDecimal("210")).foto("/images/productos/cuaderno-papel-algodon.jpg")
                .descripcionCorta("Papel hecho a mano con fibra de algodón reciclado, encuadernación cosida tipo japonesa.")
                .descripcionLarga("El papel se elabora a mano con pulpa de algodón reciclado, lo que le da una textura ligeramente irregular y muy agradable al escribir. La encuadernación es cosida (no pegada), técnica japonesa que permite que el cuaderno abra completamente plano. 80 hojas.")
                .materiales(List.of("Papel de algodón reciclado", "Hilo de algodón"))
                .imagenes(List.of("#e8dcc0", "#d9c7a3"))
                .stock(40).artesano("Papelería Origen").envioDias(3)
                .calificacion(4.5).numResenas(61).destacado(false).tags(List.of("reciclado"))
                .build(),

            Product.builder()
                .slug("jarron-torneado-negro").nombre("Jarrón torneado en gres negro").categoria(ceramica)
                .precio(new BigDecimal("720")).foto("/images/productos/jarron-torneado-negro.jpg")
                .descripcionCorta("Gres oscuro con óxido de manganeso, cocción en horno de leña a 1250°C.")
                .descripcionLarga("Torneado en gres oscuro, este jarrón se cubre con un engobe de óxido de manganeso antes de la cocción en horno de leña a alta temperatura. El fuego directo deja marcas de ceniza asimétricas en cada pieza. Mide 28cm de alto.")
                .materiales(List.of("Gres", "Óxido de manganeso"))
                .imagenes(List.of("#2b2620", "#3d372f"))
                .stock(7).artesano("Taller Barro Norte").envioDias(5)
                .calificacion(4.9).numResenas(9).destacado(false).tags(List.of("pieza única"))
                .build(),

            Product.builder()
                .slug("collar-semillas-naturales").nombre("Collar de semillas naturales").categoria(joyeria)
                .precio(new BigDecimal("320")).foto("/images/productos/collar-semillas-naturales.jpg")
                .descripcionCorta("Semillas de huayruro y ojo de venado recolectadas de forma sustentable, hilo de algodón.")
                .descripcionLarga("Las semillas se recolectan de árboles ya caídos, nunca se cortan ramas para obtenerlas. Cada collar combina huayruro (rojo) y ojo de venado (café), ensartados a mano en hilo de algodón encerado. Largo ajustable.")
                .materiales(List.of("Semillas naturales", "Algodón encerado"))
                .imagenes(List.of("#a8503a", "#8c8579"))
                .stock(30).artesano("Colectivo Raíz").envioDias(4)
                .calificacion(4.4).numResenas(22).destacado(false).tags(List.of("sustentable"))
                .build()
        ));
    }
}