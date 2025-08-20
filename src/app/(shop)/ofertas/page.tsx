// app/(shop)/ofertas/page.tsx


import { AutoScrollableMarquee } from "@/components";
import { getPromoProductsByCategory, PromoProductsByCategory } from '@/actions';
import React from "react";
import Script from "next/script";


export async function generateMetadata() {
  // Obtener productos en promoción
  const promosByCategory = await getPromoProductsByCategory();
  // Buscar la primera imagen disponible
  let promoImage = "/not-found-image.png";
  for (const cat of promosByCategory) {
    const prodWithImg = cat.products.find(p => p.image && p.image !== "");
    if (prodWithImg) {
      promoImage = prodWithImg.image;
      break;
    }
  }
  const title = "Ofertas y Promociones en Tecnología | CyE Tech";
  const description = "Aprovechá las mejores ofertas, descuentos y promociones en productos tecnológicos. Encontrá auriculares, parlantes, cargadores, tablets y más al mejor precio en CyE Tech. ¡Actualizamos nuestras promociones todas las semanas!";
  return {
    title,
    description,
    keywords: [
      "ofertas tecnología",
      "promociones tecnología",
      "descuentos tecnología",
      "productos tecnológicos baratos",
      "auriculares en oferta",
      "parlantes en promoción",
      "cargadores descuento",
      "tablets oferta",
      "comprar tecnología online",
      "CyE Tech",
      "ecommerce tecnología",
      "mejores precios tecnología",
      "liquidación tecnología",
      "rebajas tecnología"
    ],
    openGraph: {
      title,
      description,
      url: `${process.env.NEXT_PUBLIC_APP_URL}/ofertas`,
      type: "website",
      locale: "es_AR",
      images: [
        {
          url: promoImage.startsWith("http") ? promoImage : `${process.env.NEXT_PUBLIC_APP_URL}${promoImage}`,
          width: 1200,
          height: 630,
          alt: "Ofertas y Promociones en Tecnología CyE Tech",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [promoImage.startsWith("http") ? promoImage : `${process.env.NEXT_PUBLIC_APP_URL}${promoImage}`],
    },
  };
}



const OfertasPage = async () => {
  const promosByCategory: PromoProductsByCategory[] = await getPromoProductsByCategory();

  // Datos estructurados para SEO (ItemList de productos en oferta)
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "Ofertas y Promociones de CyE Tech",
    "description": "Listado de productos tecnológicos en oferta y promoción en CyE Tech.",
    "itemListElement": promosByCategory.flatMap(({ products }) =>
      products.map((product, idx) => ({
        "@type": "ListItem",
        "position": idx + 1,
        "name": product.name,
        "image": product.image,
        "url": `${process.env.NEXT_PUBLIC_APP_URL}/product/${product.slug.current}`,
      }))
    ),
  };

  return (
    <>
      <div className="max-w-6xl !mx-auto !px-4 !py-12">
      <h1 className="text-3xl font-bold text-[#f02d34] !mb-4">
        Ofertas y Promociones en Tecnología
      </h1>
      <p className="text-base text-gray-700 !leading-relaxed !mb-6">
        Bienvenido a la sección de <strong>ofertas y promociones</strong> de <span className="font-semibold">CyE Tech</span>. Aquí vas a encontrar los mejores <strong>descuentos</strong> en <strong>auriculares</strong>, <strong>parlantes</strong>, <strong>cargadores</strong>, <strong>tablets</strong> y muchos productos tecnológicos más. Aprovechá nuestras <strong>liquidaciones</strong> y <strong>rebajas</strong> exclusivas, actualizadas semanalmente.<br/><br/>
        Comprá tecnología online con <strong>envío rápido</strong> y <strong>garantía</strong>. ¡No te pierdas las mejores oportunidades para renovar tus dispositivos al mejor precio!
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
      <Script id="ofertas-jsonld" type="application/ld+json">
        {JSON.stringify(jsonLd)}
      </Script>
    </>
  );
};

export default OfertasPage;
