import { FaFacebook, FaInstagram, FaWhatsapp } from "react-icons/fa";

// src/app/ayuda/page.tsx
export const metadata = {
  title: "Ayuda | CyE Tech",
  description:
    "¿Necesitás ayuda con tu compra? Conocé todo sobre envíos, devoluciones, medios de pago y el proceso de compra en CyE Tech.",
};

export default function AyudaPage() {
  return (
    <main className="max-w-4xl !mx-auto !px-4 !py-12">
      <h1 className="text-3xl font-bold text-center text-[#324d67] !mb-10">
        Centro de Ayuda
      </h1>

      <section className="!mb-10">
        <h2 className="text-2xl font-semibold text-[#f02d34] !mb-4">
          ¿Cómo comprar?
        </h2>
        <p className="text-base text-[#324d67] !leading-relaxed">
          Navegá nuestro <span className="font-semibold">catálogo</span>,
          seleccioná el producto que te interesa y hacé clic en{" "}
          <span className="italic">"Agregar al carrito"</span>. Una vez que
          tengas todos los productos que querés, accedé al carrito y seguí los
          pasos para confirmar tu compra.
        </p>
      </section>

      <section className="!mb-10">
        <h2 className="text-2xl font-semibold text-[#f02d34] !mb-4">
          Medios de pago
        </h2>
        <p className="text-base text-[#324d67] !leading-relaxed">
          Aceptamos tarjetas de crédito, débito y pagos a través de Mercado
          Pago. También podés abonar con transferencia bancaria o efectivo en
          puntos habilitados.
        </p>
      </section>

      <section className="!mb-10">
        <h2 className="text-2xl font-semibold text-[#f02d34] !mb-4">
          Envíos y tiempos de entrega
        </h2>
        <p className="text-base text-[#324d67] !leading-relaxed">
          Realizamos envíos a todo el país. El tiempo estimado de entrega varía
          entre <span className="font-semibold">3 y 7 días hábiles</span>,
          dependiendo de tu ubicación. También podés retirar sin cargo por
          nuestra sucursal (una vez confirmado tu pedido).
        </p>
      </section>

      <section className="!mb-10">
        <h2 className="text-2xl font-semibold text-[#f02d34] !mb-4">
          Política de devoluciones
        </h2>
        <p className="text-base text-[#324d67] !leading-relaxed">
          Tenés hasta <span className="font-semibold">10 días corridos</span>{" "}
          desde que recibiste el producto para solicitar un cambio o devolución.
          El artículo debe estar en las mismas condiciones en que lo recibiste y
          con su embalaje original. En caso de falla de fábrica, cubrimos el
          costo del envío de vuelta.
        </p>
      </section>
      <section className="!mb-10">
        <h2 className="text-xl font-semibold !mb-4 text-[#f02d34]">
          Política de Privacidad
        </h2>
        <p className="!text-base text-[#324d67] !mb-4">
          En <strong>CyE Tech</strong> valoramos tu privacidad. Toda la
          información que recopilamos es utilizada exclusivamente para brindarte
          una mejor experiencia de compra, procesar tus pedidos y mejorar
          nuestros servicios.
        </p>
        <p className="!text-base text-[#324d67] !mb-4">
          No compartimos tu información personal con terceros, salvo que sea
          estrictamente necesario para completar una transacción (por ejemplo,
          con servicios de pago o envío).
        </p>
        <p className="!text-base text-[#324d67]">
          Podés solicitar la eliminación de tus datos en cualquier momento
          escribiéndonos a nuestro canal de atención. Toda la información se
          maneja conforme a la Ley de Protección de Datos Personales de
          Argentina (Ley 25.326).
        </p>
      </section>

      <section className="!mb-10">
        <h2 className="text-xl font-semibold !mb-4 text-[#f02d34]">
          Términos y Condiciones
        </h2>
        <p className="!text-base text-[#324d67] !mb-4">
          Al utilizar nuestro sitio, aceptás nuestros términos de uso.{" "}
          <strong>CyE Tech</strong> se reserva el derecho de modificar
          productos, precios y promociones sin previo aviso.
        </p>
        <p className="!text-base text-[#324d67] !mb-4">
          Todos los productos están sujetos a disponibilidad de stock. Nos
          reservamos el derecho de cancelar pedidos por errores en el sistema o
          en la información del cliente.
        </p>
        <p className="!text-base text-[#324d67]">
          El uso indebido del sitio, incluyendo fraudes, intentos de vulneración
          o usos maliciosos, podrá implicar la suspensión de la cuenta y/o
          acciones legales correspondientes.
        </p>
      </section>
      <section className="!mb-10">
        <h2 className="text-xl font-semibold !mb-4 text-[#f02d34]">Compras</h2>
        <div className="!space-y-6 !mt-6">
          <div>
            <h3 className="text-lg font-semibold !text-[#324d67] !mb-2">
              ¿Necesito estar registrado para comprar?
            </h3>
            <p className="text-base text-[#324d67] !leading-relaxed">
              Sí, para realizar una compra en CyE Tech es necesario crear una
              cuenta. De este modo podrás acceder al seguimiento de tus pedidos,
              recibir notificaciones y gestionar tus compras de forma segura.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold !text-[#324d67] !mb-2">
              ¿Cómo sé si mi compra fue confirmada?
            </h3>
            <p className="text-base text-[#324d67] !leading-relaxed">
              Una vez que finalizás el pago, verás un mensaje de confirmación en
              pantalla. Luego, cuando Mercado Pago nos notifica que el pago fue
              aprobado, tu compra se registra automáticamente y podés consultar
              el estado del pedido desde la sección
              <span className="font-medium">"Mis pedidos"</span> en el menú
              lateral.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold !text-[#324d67] !mb-2">
              ¿Puedo cancelar o modificar una compra?
            </h3>
            <p className="text-base text-[#324d67] !leading-relaxed">
              Por el momento, no es posible modificar o cancelar una compra
              directamente desde la web. Si necesitás hacerlo, por favor
              comunicate con nuestro equipo de atención a través de WhatsApp,
              Instagram o Facebook. Estamos para ayudarte.
            </p>
          </div>
        </div>
      </section>
      <section className="!mb-10">
        <h2 className="text-xl font-semibold !mb-4 text-[#f02d34]">
          Seguimiento de pedidos
        </h2>
        <div className="!space-y-6 !mt-6">
          <div>
            <h3 className="text-lg font-semibold text-[#324d67] !mb-2">
              ¿Dónde puedo ver el estado de mi pedido?
            </h3>
            <p className="text-base text-gray-700 !leading-relaxed">
              Podés hacer el seguimiento de tu compra ingresando a la sección{" "}
              <span className="font-medium">"Mis pedidos"</span> desde el menú
              lateral o visitando directamente la página{" "}
              <span className="font-medium">/mis-pedidos</span>. Ahí vas a ver
              el estado actual y el detalle de cada uno de tus pedidos
              realizados.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-[#324d67] !mb-2">
              ¿Voy a recibir confirmaciones por email?
            </h3>
            <p className="text-base text-gray-700 !leading-relaxed">
              Sí. Una vez que tu pago es aprobado, recibirás un correo
              electrónico con el resumen de tu compra y un enlace directo al
              detalle de tu pedido. De todas formas, podés consultarlo en
              cualquier momento desde la sección{" "}
              <span className="font-medium">"Mis pedidos"</span>.
            </p>
          </div>
        </div>
      </section>

      <section className="!mb-10">
        <h2 className="text-xl font-semibold !mb-4 text-[#f02d34]">Envios</h2>
        <div className="space-y-6 !mt-6">
          <div>
            <h3 className="text-lg font-semibold text-[#324d67] !mb-2">
              ¿A dónde realizan envíos?
            </h3>
            <p className="text-base text-[#324d67] !leading-relaxed">
              Actualmente realizamos envíos únicamente dentro de{" "}
              <span className="font-medium">Córdoba Capital</span>. Utilizamos
              servicios de paquetería como mensajería propia, Uber, Rappi y
              otras opciones disponibles al momento de procesar el pedido.
              <br /> Si deseás realizar un envío fuera de Córdoba o al exterior,
              podés contactarnos por nuestros canales oficiales (WhatsApp,
              Instagram o Facebook) para evaluar la viabilidad y el costo del
              pedido.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-[#324d67] !mb-2">
              ¿Cuánto demora el envío?
            </h3>
            <p className="text-base text-[#324d67] !leading-relaxed">
              La demora depende del horario en que se realiza el pedido. En
              muchos casos, el envío puede realizarse el mismo día, aunque puede
              extenderse hasta
              <span className="font-medium"> 72 horas hábiles</span>,
              dependiendo de la disponibilidad de nuestros proveedores
              logísticos.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-[#324d67] !mb-2">
              ¿Tienen puntos de retiro?
            </h3>
            <p className="text-base text-[#324d67] !leading-relaxed">
              Sí, podés optar por retirar tu pedido sin costo en cualquiera de
              nuestros dos puntos habilitados:
            </p>
            <ul className="list-disc list-inside !mt-2 text-base text-[#324d67]">
              <li>
                <span className="font-medium">Sucursal:</span> Emilio Salgari
                1181, Córdoba Capital.
              </li>
              <li>
                <span className="font-medium">Punto de retiro:</span> Calfucir
                1058, Córdoba Capital.
              </li>
            </ul>
            <p className="text-base text-[#324d67] !leading-relaxed !mt-2">
              También podés seleccionar{" "}
              <span className="font-medium">envío a domicilio</span> si preferís
              recibirlo en tu dirección.
            </p>
          </div>
        </div>
      </section>
      <section className="!mb-10">
        <h2 className="text-xl font-semibold !mb-4 text-[#f02d34]">Pagos</h2>
        <div className="!space-y-6 !mt-6">
          <div>
            <h3 className="text-lg font-semibold !text-[#324d67] !mb-2">
              ¿Qué medios de pago aceptan?
            </h3>
            <p className="text-base text-gray-700 !leading-relaxed">
              Todos los pagos se procesan a través de{" "}
              <span className="font-medium">Mercado Pago</span>. Esto incluye
              tarjetas de crédito, débito, dinero en cuenta de Mercado Pago y
              opciones de pago en cuotas.
              <br />
              No se aceptan pagos en efectivo desde la tienda online. Si deseás
              pagar en efectivo, podés realizar tu compra directamente en
              nuestra <span className="font-medium">sucursal física</span>.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold !text-[#324d67] !mb-2">
              ¿Es seguro pagar en CyE Tech?
            </h3>
            <p className="text-base text-gray-700 !leading-relaxed">
              Sí, todos los pagos se realizan mediante la pasarela oficial de{" "}
              <span className="font-medium">Mercado Pago</span>, que garantiza
              un entorno de transacción seguro y confiable. Nunca almacenamos
              información de tarjetas ni datos sensibles de pago en nuestro
              sitio.
            </p>
          </div>
        </div>
      </section>

      <section className="!mb-10">
        <h2 className="text-2xl font-semibold text-[#f02d34] !mb-4">
          ¿Necesitás ayuda personalizada?
        </h2>
        <p className="text-base text-[#324d67] !leading-relaxed">
          Nuestro equipo está listo para asistirte. Podés escribirnos por{" "}
          <a
            href="https://www.instagram.com/cyetech/profilecard/?igsh=enl0ZmNjbmE5czk3"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-blue-600 underline"
          >
            <FaInstagram className="inline-block" /> Instagram
          </a>
          ,{" "}
          <a
            href="https://www.facebook.com/share/16efa9JMz1/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-blue-600 underline"
          >
            <FaFacebook className="inline-block" /> Facebook
          </a>{" "}
          o enviarnos un mensaje directo por{" "}
          <a
            href="https://wa.me/5493512196753"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-green-600 underline"
          >
            <FaWhatsapp className="inline-block" /> WhatsApp
          </a>
          . Atención únicamente por chat de WhatsApp.
        </p>
      </section>
    </main>
  );
}
