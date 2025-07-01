export const revalidate = 60;

import { AboutSection, BenefitsSection, HeroBanner, Product, TestimonialsSection } from "@/components";
import React from "react";
import { getProducts, getLatestProducts } from "@/actions";
import Link from "next/link";

async function MyApp() {
  const products = await getProducts();

  return (
    <>
      <div className="!pt-0 !mt-0">
        <HeroBanner />
        <BenefitsSection />
        <AboutSection />
        <TestimonialsSection />
        <div className="products-heading">
          <h2>Productos más vendidos</h2>
          <p>Descubrí las diferentes versiones más elegidas.</p>
        </div>
        <div className="maylike-products-wrapper">
          <div className="marquee">
            <div className="maylike-products-container track ">
              {products.map((item) => (
                <div className="!w-[250px] !h-[250px]" key={item._id}>
                  <Product product={{ ...item, id: Number(item._id) }} />
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

export async function generateMetadata() {
  const productos = await getLatestProducts();
  const principal = productos?.[0];
  const heroImage = principal?.imagenes?.[0]?.url || "/not-found-image.png";
  const title = principal?.nombre
    ? `CyE Tech | Novedad: ${principal.nombre}`
    : "CyE Tech | Artículos tecnológicos";
  const description = principal?.nombre
    ? `¡Descubrí la última novedad en tecnología! ${principal.nombre} ya está disponible en CyE Tech. Innovación, calidad y el mejor precio para vos. No te pierdas este lanzamiento exclusivo y llevá tu experiencia al siguiente nivel.`
    : "¡Descubrí las últimas novedades en tecnología! En CyE Tech encontrá productos innovadores, calidad y el mejor precio. No te pierdas nuestros lanzamientos exclusivos.";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [
        {
          url: heroImage,
          width: 1200,
          height: 630,
          alt: principal?.nombre || "Imagen principal del Hero",
        },
      ],
      type: "website",
      locale: "es_AR",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [heroImage],
    },
  };
}

export default MyApp;
