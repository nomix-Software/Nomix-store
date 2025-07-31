export const revalidate = 60 * 60 * 2; // 2hs

import {
  AboutSection,
  AutoScrollableMarquee,
  BenefitsSection,
  HeroBanner,
  TestimonialsSection,
} from "@/components";
import React from "react";
import { getProducts, getLatestProducts } from "@/actions";
import Link from "next/link";
import Script from "next/script";

async function MyApp() {
  const products = await getProducts({});

  return (
    <>
      <div className="!pt-0 !mt-0">
        <HeroBanner />

        <AboutSection />
        <BenefitsSection />

        <TestimonialsSection />
        <div className="products-heading">
          <h2>Productos más vendidos</h2>
          <p>Descubrí las diferentes versiones más elegidas.</p>
        </div>
        <AutoScrollableMarquee products={products} />
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
      </div>
      {/* WebSite con acción de búsqueda */}
      <Script id="website-jsonld" type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: "CyE Tech",
          url: process.env.NEXT_PUBLIC_APP_URL,
          potentialAction: {
            "@type": "SearchAction",
            target: `${process.env.NEXT_PUBLIC_APP_URL}/search?q={search_term_string}`,
            "query-input": "required name=search_term_string",
          },
        })}
      </Script>
      {/* Organization */}
      <Script id="org-jsonld" type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "CyE Tech",
          url: process.env.NEXT_PUBLIC_APP_URL,
          logo: `${process.env.NEXT_PUBLIC_APP_URL}/logo.png`, // cambiá si tenés logo
          sameAs: [
            "https://www.facebook.com/share/16efa9JMz1/",
            "https://www.instagram.com/cyetech/profilecard/?igsh=enl0ZmNjbmE5czk3",
            // "https://www.linkedin.com/company/tupagina",
          ],
        })}
      </Script>
      {/* carrousel */}
      <Script id="homepage-product-list" type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "ItemList",
          itemListElement: products.map((p, i) => ({
            "@type": "ListItem",
            position: i + 1,
            url: `${process.env.NEXT_PUBLIC_APP_URL}/product/${p.slug}`,
          })),
        })}
      </Script>
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
