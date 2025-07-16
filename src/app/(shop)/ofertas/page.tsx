// app/(shop)/ofertas/page.tsx

import Link from "next/link";


import { FaRegStar } from "react-icons/fa"; // o cualquier otro que te guste

import { Badge, Button } from "@/components";

export const metadata = {
  title: "Ofertas | CyE Tech",
  description:
    "Descubrí promociones, descuentos y oportunidades únicas para tus compras tecnológicas. Participá del nuevo juego Raspá y Ganá, ¡y obtené cupones exclusivos!",
};

export default function OfertasPage() {
  return (
    <div className="max-w-4xl !mx-auto !px-4 !py-12">
      <h1 className="text-3xl font-bold text-[#f02d34] !mb-4">
        Ofertas y Promociones
      </h1>
      <p className="text-base text-gray-700 !leading-relaxed !mb-6">
        En <span className="font-semibold">CyE Tech</span> trabajamos
        constantemente para acercarte lo mejor en tecnología al mejor precio.
        Visitá esta sección para descubrir nuestras últimas ofertas, productos
        en promoción, y juegos interactivos con los que podés ganar cupones de
        descuento.
        <br />
        Participá en sorteos, accedé a beneficios especiales y mantenete atento
        a nuestras novedades. ¡Siempre hay una oportunidad para ahorrar!
      </p>

      <div className="bg-gray-50 rounded-2xl border !p-6 shadow-sm !mb-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
            🎯 Raspá y Ganá
            <Badge className="bg-yellow-500 text-white uppercase !text-[10px] font-bold tracking-wide">
              Beta
            </Badge>
          </h2>
        </div>
        <p className="text-sm text-gray-600 !leading-relaxed !mb-4">
          Un juego divertido donde podés ganar cupones de descuento para usar en
          tus compras. Elegí tus 3 números, raspá tu tarjeta virtual y descubrí
          si ganaste.
        </p>
        <Link href="/raspa-gana">
          <Button className="bg-[#f02d34] cursor-pointer text-white hover:brightness-110 transition-all duration-200">
            <FaRegStar className="w-4 h-4 !mr-2" />
            Probar suerte ahora
          </Button>
        </Link>
      </div>

      <p className="text-sm text-gray-500 !leading-relaxed">
        Esta funcionalidad se encuentra en fase <strong>Beta</strong>. Los
        premios obtenidos actualmente no tienen validez real y se utilizan con
        fines de prueba. Pronto activaremos recompensas reales.
      </p>
    </div>
  );
}
