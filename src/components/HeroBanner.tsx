import React from "react";
import { getLatestProducts } from "@/actions";
import Link from "next/link";
import { HeroSlider } from "./HeroSlider";



export const HeroBanner: React.FC = async () => {
  const productsLatest = await getLatestProducts();
if(!productsLatest) return null
  return (
    <section className="relative  [mask-image:linear-gradient(to_bottom,transparent_0%,black_15%,black_85%,transparent_100%)]">
      <div className="h-[450px] md:h-[500px] overflow-hidden relative">
        <HeroSlider products={productsLatest} />
        {/* Capa de superposición de texto */}
        <div className="!absolute !inset-0 !flex !flex-col !items-center !justify-center  !text-center !p-4 !z-20 !pointer-events-none">
          <h1 className="text-4xl md:text-6xl font-extrabold text-[#324d67]  [text-shadow:0_2px_4px_rgba(255,255,255,0.7)]">
            Tecnología al Alcance de tu Mano
          </h1>
          <p className="!mt-4 text-lg md:text-xl max-w-2xl text-gray-800 font-bold  bg-white/25  [text-shadow:0_1px_3px_rgba(255,255,255,0.9)]">
            Descubrí las mejores ofertas en tus productos favoritos y equipate con lo último en tecnología.
          </p>
          <Link href="/catalogo"
              className="bg-[#f02d34] !cursor-pointer !text-white rounded-2xl !py-2.5 !my-8 !px-4 !w-[170px] m-auto transform transition-transform duration-300 hover:scale-110 !pointer-events-auto"
          >
            Explorar Catálogo
          </Link>
        </div>
      </div>
    </section>
  );
};
