import { FooterBanner, HeroBanner, Product } from "@/components";
import React from "react";

import { getProducts } from "@/actions";

async function MyApp() {
  const products = await getProducts();
  return (
    <>
      <div>
        <HeroBanner
          heroBanner={{
            buttonText: "Comprar ahora",
            desc: "El juego empieza aquí. Con los auriculares para gaming Immortal 1000D, no solo juegues: siéntelo, vívelo y aduéñate de él. Mejora tu audio con 7.1 canales",
            image:
              "https://cdn.sanity.io/images/kyml1h03/production/a205aaa5ac2c75342801e683c3b78ea2fff8913b-600x600.webp",
            largeText1: "Auriculares",
            // largeText2: "texto
            midText: "Inhalambrico",
            product: "product-1",
            smallText: "Novedades",
          }}
        />
        <div className="products-heading">
          <h2>Productos más vendidos</h2>
          <p>Descubrí las diferentes versiones más elegidas.</p>
        </div>

        <div className="flex flex-col w-[250px] justify-center items-center !m-auto sm:flex-row gap-4 sm:w-auto ">
          {products?.map((product) => (
            <Product key={product._id} product={product} />
          ))}
        </div>
        <div className=" flex w-full justify-center">
          <button
            type="button"
            className="bg-[#f02d34] cursor-pointer text-white rounded-2xl !py-2.5 !px-4 !w-[170px] m-auto transform transition-transform duration-300 hover:scale-110"
          >
            Ver más productos
          </button>
        </div>
        <FooterBanner
          footerBanner={{
            discount: "29% de descuento",
            buttonText: "Comprar ahora",
            desc: "Empresa que ha crecido de 270 a 480 empleados en los últimos 12 meses",
            image:
              "https://cdn.sanity.io/images/kyml1h03/production/a64b345016e96adfb8849af5521c8e0ecfe8f027-555x555.webp",
            largeText1: "Bien",
            largeText2: "Sonrisa",
            midText: "Rebajas de verano",
            product: "Beats Solo Air",
            saleTime: "29 de abril al 29 de mayo",
            smallText: "Beats Solo Air",
          }}
        />
      </div>
    </>
  );
}

export default MyApp;
