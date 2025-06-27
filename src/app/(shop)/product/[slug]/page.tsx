export const revalidate = 60; // en segundos
import React from "react";
import { AiFillStar, AiOutlineStar } from "react-icons/ai";
import type { Metadata } from "next";

import type { ProductDetails } from "@/interfaces";

import { getProductDetail, getProducts } from "@/actions";
import { notFound } from "next/navigation";

import { AddToCart, ImagesDetails, RelatedProducts } from "@/components";
import { MdErrorOutline } from "react-icons/md";
interface Props {
  params: Promise<{ slug: string }>;
}
export async function generateStaticParams() {
  const productos = await getProducts(); // o fetch a tu DB
  return productos.map((p) => ({ slug: p.slug.current }));
}
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const productDetail: ProductDetails | null = await getProductDetail(params.slug);
  if (!productDetail) return {};
  return {
    title: `${productDetail.nombre} | ${productDetail.marca.nombre} | ${productDetail.categoria.nombre} | CYE TECH` ,
    description: productDetail.descripcion,
    openGraph: {
      title: `${productDetail.nombre} | ${productDetail.marca.nombre} | ${productDetail.categoria.nombre} | CYE TECH`,
      description: productDetail.descripcion,
      type: "website",
      images: [productDetail.imagenes ? productDetail.imagenes[0]?.url : ''],
    },
    keywords: [productDetail.nombre, productDetail.categoria.nombre, productDetail.marca.nombre, "CYE TECH", "tecnología", "comprar", "accesorios"],
  };
}
const ProductDetails = async ({ params }: Props) => {
  const { slug } = await params;
  const productDetail: ProductDetails | null = await getProductDetail(slug);
  if (!productDetail) notFound();

  return (
    <div>
      <div className="product-detail-container">
        <ImagesDetails images={productDetail.imagenes} />

        <div className="product-detail-desc">
          <h1 className="font-extrabold ">{productDetail.nombre}</h1>
          <div className="reviews">
            <div className="flex flex-row gap-1 items-center">
              <AiFillStar />
              <AiFillStar />
              <AiFillStar />
              <AiFillStar />
              <AiOutlineStar />
            </div>
            <p>(20)</p>
          </div>
          <h4 className="font-bold">Detalle: </h4>
          <p className="whitespace-pre-line">{productDetail.descripcion}</p>
          {productDetail.stock <= 0 ? (
            <div className="inline-flex items-center gap-2 bg-red-200 text-red-800 text-base font-semibold !px-4 !py-1.5 !mt-6 mx-auto rounded-full !mb-4 shadow-sm">
              <MdErrorOutline className="text-xl" />
              Sin stock disponible
            </div>
          ): 
          <AddToCart
            {...productDetail}
            imagenURI={productDetail.imagenes[0].url}
          />
          }
        </div>
      </div>
      {/* tambien te puede gustar */}
      <RelatedProducts
        productId={productDetail.id}
        categoriaId={productDetail.categoria.id}
        marcaId={productDetail.marca.id}
      />
    </div>
  );
};

export default ProductDetails;
