export const revalidate = 14400;

import {
  AboutSection,
  AutoScrollableMarquee,
  BenefitsSection,
  HeroBanner,
  RaspaGanaSection,
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
      <div className="bg-white !pt-0 !mt-0 !min-h-screen w-full">
        {/* Sección de productos destacados y beneficios */}
        <div className="w-full">
          <HeroBanner />
          {/* Sección Raspa-Gana debajo del HeroBanner */}
          <RaspaGanaSection/>
          <AboutSection />
          <BenefitsSection />
          <TestimonialsSection />
          <div className="products-heading !mt-12 w-full">
            <h2 className="!text-2xl !font-bold !text-[#f02d34]">Productos más vendidos</h2>
            <p className="!text-gray-700">Descubrí las diferentes versiones más elegidas.</p>
          </div>
          <AutoScrollableMarquee products={products} />
          <div className="flex w-full justify-center">
            <Link href={"/catalogo"}>
              <button
                type="button"
                className="!bg-[#f02d34] cursor-pointer !text-white !rounded-2xl !py-2.5 !my-8 !px-4 !w-[170px] m-auto transform transition-transform duration-300 hover:!scale-110"
              >
                Ver más productos
              </button>
            </Link>
          </div>
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
          logo: `${process.env.NEXT_PUBLIC_APP_URL}/logo.png`,
          sameAs: [
            "https://www.facebook.com/share/16efa9JMz1/",
            "https://www.instagram.com/cyetech/profilecard/?igsh=enl0ZmNjbmE5czk3",
          ],
        })}
      </Script>
      {/* carrousel */}
      <Script id="homepage-product-list" type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "ItemList",
          itemListElement: products.map((p, i) => {
            const item = {
              "@type": "Product",
              name: p.name,
              image: p.image,
              url: `${process.env.NEXT_PUBLIC_APP_URL}/product/${p.slug.current}`,
              offers: {
                "@type": "Offer",
                price: p.price,
                priceCurrency: "ARS",
                availability: p.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
                itemCondition: "https://schema.org/NewCondition",
                ...(p.promocion && p.promocion.descuento
                  ? { discount: p.promocion.descuento, description: p.promocion.descripcion }
                  : {}),
              },
              ...(typeof p.averageRating === "number" && p.reviewsCount > 0
                ? {
                    aggregateRating: {
                      "@type": "AggregateRating",
                      ratingValue: p.averageRating.toFixed(1),
                      reviewCount: p.reviewsCount,
                    },
                  }
                : {}),
            };
            return {
              "@type": "ListItem",
              position: i + 1,
              url: item.url,
              item,
            };
          }),
        })}
      </Script>
    </>
  );
}

export async function generateMetadata() {
  const productos = await getLatestProducts();
  const nombres = productos.map((p) => p.nombre).filter(Boolean);
  const categorias = productos.map((p) => p.categoria?.nombre).filter(Boolean);
  const marcas = productos.map((p) => p.marca?.nombre).filter(Boolean);
  const heroImage = productos[0]?.imagenes?.[0]?.url || "/not-found-image.png";
  const title = nombres.length
    ? `CyE Tech | Novedades: ${nombres.slice(0, 3).join(", ")}`
    : "CyE Tech | Artículos tecnológicos";
  const categoriasUnicas = Array.from(new Set(categorias));
  const marcasUnicas = Array.from(new Set(marcas));
  const description = nombres.length
    ? `¡Descubrí las últimas novedades en tecnología! ${nombres.slice(0, 3).join(", ")}`
      + (categoriasUnicas.length ? ` en categorías como ${categoriasUnicas.join(", ")}` : "")
      + (marcasUnicas.length ? ` y marcas como ${marcasUnicas.join(", ")}` : "")
      + ". Comprá online en Córdoba Capital y todo el país, con envío rápido, cuotas sin interés y promociones exclusivas en CyE Tech."
    : "¡Descubrí las últimas novedades en tecnología! En CyE Tech encontrá productos innovadores, calidad y el mejor precio en Córdoba Capital y Argentina. No te pierdas nuestros lanzamientos exclusivos.";
  const keywords = [
    "tecnología", "comprar online", "ofertas", "novedades", "envío", "cuotas", "promociones", "CyE Tech",
    "Córdoba", "Córdoba Capital", "Argentina", "envío Córdoba", "tecnología Córdoba", "comprar tecnología Córdoba",
    ...nombres,
    ...categorias,
    ...marcas
  ].filter(Boolean).join(", ");

  return {
    title,
    description,
    keywords,
    openGraph: {
      title,
      description,
      images: [
        {
          url: heroImage,
          width: 1200,
          height: 630,
          alt: nombres[0] || "Imagen principal del Hero",
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
