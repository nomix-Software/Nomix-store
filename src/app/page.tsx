export const revalidate = 60;

import { HeroBanner, Product } from "@/components";
import React from "react";

import { getProducts } from "@/actions";
import Link from "next/link";

async function MyApp() {
  const products = await getProducts();

  return (
    <>
      <div className="!pt-0 !mt-0">
        <HeroBanner />

        <div className="products-heading">
          <h2>Productos más vendidos</h2>
          <p>Descubrí las diferentes versiones más elegidas.</p>
        </div>
        <div className="maylike-products-wrapper">
          <div className="marquee">
            <div className="maylike-products-container track ">
              {products.map((item) => (
                <div className="!w-[250px] !h-[250px]" key={item._id}>
                  <Product
                    
                    product={{ ...item, id: Number(item._id) }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className=" flex w-full justify-center">
          <Link href={"/catalogo"}>
            <button
              type="button"
              className="bg-[#f02d34] cursor-pointer text-white rounded-2xl !py-2.5 !my-8 !px-4 !w-[170px] m-auto transform transition-transform duration-300 hover:scale-110"
            >
              Ver más productos
            </button>
          </Link>
        </div>
        {/* <FooterBanner
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
        /> */}
      </div>
    </>
  );
}

export default MyApp;
