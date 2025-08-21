export const revalidate = 60; // en segundos
import React, { Suspense } from "react";
import type { Metadata } from "next";

import type { ProductDetails } from "@/interfaces";

import { getProductAggregateRating, getProductDetail, getProducts } from "@/actions";
import { notFound } from "next/navigation";

import {
  ImagesDetails,
  RelatedProducts,
  AddToCartButton,
  ProductReviews,
} from "@/components";
import { formatPrice } from "@/utils/formatPrice";
import Script from "next/script";
export async function generateStaticParams() {
  const productos = await getProducts({}); // o fetch a tu DB
  return productos.map((p) => ({ slug: p.slug.current }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const productDetail: ProductDetails | null = await getProductDetail(slug);
  if (!productDetail) return {};
  const tienePromo = productDetail.promocion && productDetail.promocion.descuento > 0;
  const precioPromo = tienePromo
    ? productDetail.precio * (1 - productDetail.promocion!.descuento / 100)
    : productDetail.precio;
  // Palabras clave long tail dinámicas
  const nombre = productDetail.nombre;
  const categoria = productDetail.categoria.nombre;
  const marca = productDetail.marca.nombre;
  const ubicacion = "Córdoba";
  const tienda = "CyE Tech";
const longTail = [
    // Palabras clave existentes y muy efectivas (transaccionales y locales)
    `${categoria} ${marca} ${ubicacion}`,
    `comprar ${nombre} online ${ubicacion}`,
    `${nombre} ${marca} ofertas ${ubicacion}`,
    `${categoria} ${marca} precio en ${ubicacion}`,
    `${nombre} ${categoria} ${marca} ${tienda} ${ubicacion}`,
    `${categoria} ${marca} envío a domicilio ${ubicacion}`,
    `${categoria} ${marca} cuotas sin interés ${ubicacion}`,
    `mejor precio ${nombre} ${ubicacion}`,
    `ofertas ${categoria} ${marca} ${ubicacion}`,
    `comprar ${categoria} ${marca} en ${ubicacion}`,
    `venta de ${categoria} ${marca} en ${ubicacion}`,
    `mejores ${categoria} ${marca} ${ubicacion}`,
    `ofertas ${nombre} ${ubicacion}`,
    `dónde comprar ${nombre} en ${ubicacion}`,
    `precio ${nombre} ${ubicacion}`,
    `opiniones ${nombre} ${ubicacion}`,
    `reseñas ${nombre} ${ubicacion}`,
    `nuevo ${nombre} ${ubicacion}`,
    `últimos lanzamientos ${categoria} ${ubicacion}`,
    `productos ${categoria} ${marca} ${ubicacion}`,

    // Nuevas combinaciones sugeridas para mayor especificidad e intención
    // Preguntas y búsquedas informativas/comparativas
    `¿dónde conseguir ${nombre} en ${ubicacion}?`,
    `${nombre} características y precio ${ubicacion}`,
    `${nombre} vs [otro modelo] ${ubicacion}`, // Ejemplo: Auriculares Bluetooth JBL Tune 510BT vs Tune 710BT Córdoba
    `cómo conectar ${nombre} a [dispositivo]`, // Ejemplo: cómo conectar Auriculares Bluetooth JBL Tune 510BT a PC
    `${nombre} duración batería`,
    `${nombre} con micrófono para llamadas ${ubicacion}`,
    `problemas ${nombre} no enciende`,
    `solución ${nombre} no carga`,
    `${nombre} para hacer deporte ${ubicacion}`,
    `${nombre} para home office ${ubicacion}`,
    `accesorios originales ${marca} ${categoria} ${ubicacion}`,
    `tiendas de ${categoria} ${marca} en ${ubicacion} centro`,
    `descuentos ${nombre} ${ubicacion}`,
    `${categoria} inalámbricos ${marca} ${ubicacion}`,
    `${categoria} baratos ${marca} ${ubicacion}`,
    `${categoria} on ear ${marca} ${ubicacion}`, // Especificación del tipo de auricular
    `${categoria} over ear ${marca} ${ubicacion}`,
    `${categoria} in ear ${marca} ${ubicacion}`,
    `${nombre} ${tienda} opiniones`,
    `envío gratis ${categoria} ${marca} ${ubicacion}`,
    `retiro en tienda ${categoria} ${marca} ${ubicacion}`,
    `garantía ${nombre} ${ubicacion}`,
    `servicio técnico ${marca} ${categoria} ${ubicacion}`,
    `${nombre} para gamers ${ubicacion}`,
    `${nombre} para escuchar música ${ubicacion}`,
    `precio ${nombre} en ${tienda} ${ubicacion}`,
    `stock ${nombre} ${ubicacion}`,
    `mejor oferta ${nombre} ${ubicacion} hoy`
];
  // Título SEO optimizado
  const seoTitle = `${productDetail.nombre} | ${productDetail.categoria.nombre} - CyE Tech Córdoba`;
  const title = seoTitle.length > 60 ? seoTitle.slice(0, 57) + '...' : seoTitle;
  // Descripción SEO optimizada
  const beneficioClave = productDetail.descripcion.split('.')[0];
  const descPromo = tienePromo ? ` ¡Aprovechá ${productDetail.promocion?.descuento}% OFF! Precio: ${formatPrice(precioPromo)}.` : "";
  const descUbic = " Disponible en Córdoba Capital y envío a todo el país.";
  let description = `${beneficioClave}.${descPromo}${descUbic}`;
  // Añadir keywords long tail si hay espacio
  if (description.length < 140) {
    const extra = longTail.filter(k => description.indexOf(k) === -1).slice(0, 1).join('. ');
    description += (extra ? ' ' + extra : '');
  }
  if (description.length > 160) description = description.slice(0, 157) + '...';
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      images: [productDetail.imagenes ? productDetail.imagenes[0]?.url : ""],
      ...(tienePromo && {
        price: precioPromo,
        priceCurrency: "ARS",
        discount: productDetail.promocion?.descuento,
        originalPrice: productDetail.precio,
      }),
    },
    keywords: [
      productDetail.nombre,
      productDetail.categoria.nombre,
      productDetail.marca.nombre,
      "CYE TECH",
      "tecnología",
      "comprar",
      "accesorios",
      "Córdoba",
      "Córdoba Capital",
      "Argentina",
      "envío Córdoba",
      "comprar tecnología Córdoba",
      ...(tienePromo ? ["descuento", "oferta", `${productDetail.promocion?.descuento}% OFF`] : []),
      ...longTail
    ],
  };
}
const ProductDetails = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  const { slug } = await params;

  const productDetail: ProductDetails | null = await getProductDetail(slug);
  if (!productDetail) notFound();
  // Obtener averageRating y reviewsCount solo para el schema
  const { averageRating, reviewsCount } = await getProductAggregateRating(productDetail.id);
  // Variables para promoción y precio promocional
  const tienePromo = !!(productDetail.promocion && productDetail.promocion.descuento > 0);
  const precioPromo = tienePromo && productDetail.promocion
    ? productDetail.precio * (1 - productDetail.promocion.descuento / 100)
    : productDetail.precio;

  return (
    <div>
      <div className="product-detail-container">
  <ImagesDetails images={productDetail.imagenes} />

        <div className="product-detail-desc">
          <h1 className="font-extrabold text-2xl">{productDetail.nombre}</h1>
          <h2 className="text-lg font-semibold mt-2">{productDetail.categoria.nombre} en Córdoba - {productDetail.marca.nombre}</h2>
          <h3 className="text-base font-medium mt-1 text-gray-600">{productDetail.nombre} | {productDetail.categoria.nombre} | {productDetail.marca.nombre} | CyE Tech Córdoba</h3>
          <div className="!my-2 !flex !items-center !gap-4">
            <ProductReviews
              productId={productDetail.id}
              userHasBought={true}
              mode="summary"
            />
          </div>
          <h4 className="font-semibold text-[#324d67] !text-[16px]">
            Detalle:{" "}
          </h4>
          <p className="whitespace-pre-line">{productDetail.descripcion}</p>
        <div className="flex flex-col gap-2 !mt-4">
          {productDetail.promocion && productDetail.promocion.descuento > 0 ? (
            <div className="flex flex-col gap-1">
              <div className="flex items-end gap-3">
                <span className="text-gray-400 line-through text-base md:text-lg font-semibold">
                  {formatPrice(productDetail.precio)}
                </span>
                <span className="text-[#f02d34] font-bold text-2xl md:text-3xl">
                  {formatPrice(productDetail.precio * (1 - productDetail.promocion.descuento / 100))}
                </span>
                <span className="bg-[#f02d34] text-white text-xs md:text-sm font-bold px-2 py-1 rounded shadow animate-pulse">
                  -{productDetail.promocion.descuento}% OFF
                </span>
              </div>
            </div>
          ) : (
            <span className="!text-2xl w-fit !font-bold !text-[#f02d34] !bg-[#fff0f0] !rounded-xl !px-4 !py-1 !shadow-sm">
              {formatPrice(productDetail.precio)}
            </span>
          )}
          <Suspense fallback={<div>Cargando...</div>}>
            <AddToCartButton productDetail={{
              ...productDetail,
              precioOriginal: tienePromo ? productDetail.precio : undefined,
              descuento: tienePromo && productDetail.promocion ? productDetail.promocion.descuento : undefined,
              precio: tienePromo && productDetail.promocion ? precioPromo : productDetail.precio,
            }} />
          </Suspense>
        </div>
        </div>
      </div>
      {/* Reseñas de clientes y formulario (solo listado y form, sin estrellas) */}
      <div className="mt-8">
        <ProductReviews
          productId={productDetail.id}
          userHasBought={true}
          mode="list"
        />
      </div>
      {/* tambien te puede gustar */}
      <RelatedProducts
        productId={productDetail.id}
        categoriaId={productDetail.categoria.id}
      />
      <Script id="product-jsonld" type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org/",
          "@type": "Product",
          name: productDetail.nombre,
          image: productDetail.imagenes?.map((img) => img.url) || [],
          description: productDetail.descripcion,
          sku: productDetail.id.toString(),
          brand: {
            "@type": "Brand",
            name: productDetail.marca.nombre,
          },
          category: productDetail.categoria.nombre,
          offers: {
            "@type": "Offer",
            url: `${process.env.NEXT_PUBLIC_APP_URL}/product/${productDetail.slug}`,
            priceCurrency: "ARS",
            price: tienePromo ? precioPromo : productDetail.precio,
            ...(tienePromo && {
              priceValidUntil: undefined,
              originalPrice: productDetail.precio,
              discount: productDetail.promocion?.descuento,
              description: `¡${productDetail.promocion?.descuento}% OFF! Precio promocional: ${formatPrice(precioPromo)}`,
            }),
            availability:
              productDetail.stock > 0
                ? "https://schema.org/InStock"
                : "https://schema.org/OutOfStock",
            itemCondition: "https://schema.org/NewCondition",
            seller: {
              "@type": "Organization",
              name: "CyE Tech",
              url: process.env.NEXT_PUBLIC_APP_URL,
            },
            hasMerchantReturnPolicy: {
              "@type": "MerchantReturnPolicy",
              applicableCountry: "AR",
              returnPolicyCategory:
                "https://schema.org/MerchantReturnFiniteReturnWindow",
              merchantReturnDays: 10,
              returnMethod: "https://schema.org/ReturnByMail",
              returnFees: "https://schema.org/ReturnShippingFees",
            },
            shippingDetails: {
              "@type": "OfferShippingDetails",
              shippingDestination: {
                "@type": "DefinedRegion",
                addressCountry: "AR",
              },
              deliveryTime: {
                "@type": "ShippingDeliveryTime",
                handlingTime: {
                  "@type": "QuantitativeValue",
                  minValue: 0,
                  maxValue: 1,
                  unitCode: "DAY",
                },
                transitTime: {
                  "@type": "QuantitativeValue",
                  minValue: 3,
                  maxValue: 7,
                  unitCode: "DAY",
                },
              },
            },
          },
          ...(typeof averageRating === "number" && reviewsCount > 0
            ? {
                aggregateRating: {
                  "@type": "AggregateRating",
                  ratingValue: averageRating.toFixed(1),
                  reviewCount: reviewsCount,
                }
              }
            : {}),
        })}
      </Script>
    </div>
  );
};

export default ProductDetails;