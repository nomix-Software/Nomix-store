import React from "react";
import { getLatestProducts } from "@/actions";
import Link from "next/link";
import { HeroSlider } from "./HeroSlider";



export const HeroBanner: React.FC = async () => {
  const productsLatest = await getLatestProducts();
if(!productsLatest) return null
  return (
    <section className="relative [mask-image:linear-gradient(to_bottom,transparent_0%,black_15%,black_85%,transparent_100%)]">
      <div className="h-[450px] md:h-[500px] overflow-hidden relative">
        <HeroSlider products={productsLatest} />
        {/* Capa de superposición para mejorar la legibilidad del texto */}
        <div className="!absolute !inset-0 !bg-gradient-to-t from-black/60 via-black/20 to-transparent !z-10 !pointer-events-none"></div>
        <div className="!absolute !inset-0 !flex !flex-col !items-center !justify-center !text-center !text-white !p-4 !z-20 !pointer-events-none">
          <h1 className="text-4xl md:text-6xl font-extrabold drop-shadow-lg">
            Tecnología al Alcance de tu Mano
          </h1>
          <p className="!mt-4 text-lg md:text-xl max-w-2xl drop-shadow-md">
            Descubrí las mejores ofertas en tus productos favoritos y equipate con lo último en tecnología.
          </p>
          <Link href="/catalogo" className="!mt-8 inline-block bg-red-600 text-white font-bold !py-3 !px-8 rounded-2xl hover:bg-red-700 transition-colors shadow-lg !pointer-events-auto">
            Explorar Catálogo
          </Link>
        </div>
      </div>
    </section>
  );
};
