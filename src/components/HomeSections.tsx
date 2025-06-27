import { FaStar, FaShippingFast, FaShieldAlt, FaHeadset, FaMapMarkerAlt, FaWhatsapp } from "react-icons/fa";

export const AboutSection = () => (
  <section className="!py-12 !bg-white !border-y !border-gray-200">
    <div className="!max-w-4xl !mx-auto !px-4 sm:!px-8 flex flex-col !gap-4">
      <h2 className="!text-3xl sm:!text-4xl !font-extrabold !text-[#324d67] !mb-2 !text-center">
        Sobre Nosotros
      </h2>
      <p className="!mb-4 !text-gray-700 !text-lg !text-center !leading-relaxed">
        En <strong>CYE TECH</strong> ofrecemos una cuidadosa selección de
        accesorios tecnológicos y gadgets de última moda, desde cables y
        cargadores hasta regalos ideales para el Día del Padre o el mate.
      </p>
      <div className="flex flex-col sm:flex-row items-center justify-center !gap-4 !mt-2">
        <div className="flex items-center !gap-2 !text-gray-600">
          <FaMapMarkerAlt className="!text-blue-500 !text-xl" />
          <a
            href="https://www.google.com/maps?q=Emilio+Salgari+1181,+Barrio+Acosta,+C%C3%B3rdoba"
            target="_blank"
            rel="noopener noreferrer"
            className="!text-base !underline hover:!text-blue-700 transition-colors"
          >
            Emilio Salgari 1181, Barrio Acosta, Córdoba
          </a>
        </div>
        <div className="flex items-center !gap-2 !text-gray-600">
          <FaWhatsapp className="!text-green-500 !text-xl" />
          <span className="!text-base">WhatsApp: +54 351 219‑6753</span>
        </div>
      </div>
    </div>
  </section>
);

export const TestimonialsSection = () => (
  <section className="!py-12 !bg-gray-50 !border-y !border-gray-200">
    <div className="!max-w-4xl !mx-auto !px-4 sm:!px-8 flex flex-col !gap-8">
      <h2 className="!text-3xl sm:!text-4xl !font-extrabold !text-[#324d67] !mb-2 !text-center">Lo que dicen nuestros clientes</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center text-center">
          <FaStar className="text-yellow-400 text-2xl mb-2" />
          <p className="text-gray-700 italic mb-2">“Excelente atención y productos de calidad. ¡Recomiendo 100%!”</p>
          <span className="text-sm text-gray-500 font-semibold">María G.</span>
        </div>
        <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center text-center">
          <FaStar className="text-yellow-400 text-2xl mb-2" />
          <p className="text-gray-700 italic mb-2">“El envío fue rapidísimo y el producto llegó perfecto.”</p>
          <span className="text-sm text-gray-500 font-semibold">Lucas P.</span>
        </div>
        <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center text-center">
          <FaStar className="text-yellow-400 text-2xl mb-2" />
          <p className="text-gray-700 italic mb-2">“Siempre encuentro el regalo ideal y a buen precio.”</p>
          <span className="text-sm text-gray-500 font-semibold">Sofía R.</span>
        </div>
      </div>
    </div>
  </section>
);

export const BenefitsSection = () => (
  <section className="!py-12 !bg-white !border-b !border-gray-200">
    <div className="!max-w-4xl !mx-auto !px-4 sm:!px-8 flex flex-col !gap-8">
      <h2 className="!text-3xl sm:!text-4xl !font-extrabold !text-[#324d67] !mb-2 !text-center">¿Por qué elegir CYE TECH?</h2>
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
        <div className="flex flex-col items-center text-center gap-2">
          <FaShippingFast className="text-blue-500 text-3xl mb-1" />
          <span className="font-semibold text-gray-700">Envíos rápidos</span>
          <span className="text-sm text-gray-500">A todo el país y en 24hs en Córdoba capital.</span>
        </div>
        <div className="flex flex-col items-center text-center gap-2">
          <FaShieldAlt className="text-green-500 text-3xl mb-1" />
          <span className="font-semibold text-gray-700">Compra segura</span>
          <span className="text-sm text-gray-500">Tus datos y pagos protegidos con tecnología de punta.</span>
        </div>
        <div className="flex flex-col items-center text-center gap-2">
          <FaHeadset className="text-red-500 text-3xl mb-1" />
          <span className="font-semibold text-gray-700">Atención personalizada</span>
          <span className="text-sm text-gray-500">Te asesoramos por WhatsApp antes y después de tu compra.</span>
        </div>
        <div className="flex flex-col items-center text-center gap-2">
          <FaStar className="text-yellow-400 text-3xl mb-1" />
          <span className="font-semibold text-gray-700">Clientes felices</span>
          <span className="text-sm text-gray-500">Más de 500 valoraciones positivas en redes y Mercado Libre.</span>
        </div>
      </div>
    </div>
  </section>
);
