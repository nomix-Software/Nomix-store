// app/(shop)/ofertas/page.tsx


import { AutoScrollableMarquee } from "@/components";
import { getPromoProductsByCategory, PromoProductsByCategory } from '@/actions';
import React from "react";

export const metadata = {
  title: "Ofertas | CyE Tech",
  description:
    "Descubrí promociones, descuentos y oportunidades únicas para tus compras tecnológicas. Participá del nuevo juego Raspá y Ganá, ¡y obtené cupones exclusivos!",
};



const OfertasPage = async () => {
  const promosByCategory: PromoProductsByCategory[] = await getPromoProductsByCategory();

  return (
    <div className="max-w-6xl !mx-auto !px-4 !py-12">
      <h1 className="text-3xl font-bold text-[#f02d34] !mb-4">
        Ofertas y Promociones
      </h1>
      <p className="text-base text-gray-700 !leading-relaxed !mb-6">
        En <span className="font-semibold">CyE Tech</span> trabajamos constantemente para acercarte lo mejor en tecnología al mejor precio. Descubrí nuestras últimas ofertas y productos en promoción.
      </p>

      {/* Marquees por categoría */}
      {promosByCategory.length === 0 && (
        <div className="text-center text-gray-500 my-10">No hay productos en promoción actualmente.</div>
      )}
      {promosByCategory.map(({ categoria, products }) => (
        <div key={categoria} className="mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 pl-2">{categoria}</h2>
          <AutoScrollableMarquee products={products} />
        </div>
      ))}
    </div>
  );
};

export default OfertasPage;
