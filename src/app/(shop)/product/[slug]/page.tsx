"use server";
import React from "react";
import { AiFillStar, AiOutlineStar } from "react-icons/ai";

import type { ProductDetails } from "@/interfaces";

import { getProductDetail, getProducts } from "@/actions";
import { notFound } from "next/navigation";

import { AddToCart, ImagesDetails, RelatedProducts } from "@/components";
interface Props {
  params : Promise<{ slug: string }>
}
export async function generateStaticParams() {
  const productos = await getProducts(); // o fetch a tu DB
  return productos.map((p) => ({ slug: p.slug.current }));
}
const ProductDetails = async ({ params }: Props) => {
  const { slug } = await params
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
          <p>{productDetail.descripcion}</p>
          <AddToCart  {...productDetail} imagenURI={productDetail.imagenes[0].url} />
        </div>
      </div>
      {/* tambien te puede gustar */}
      <RelatedProducts productId={productDetail.id} categoriaId={productDetail.categoria.id} marcaId={productDetail.marca.id} />
    </div>
  );
};

export default ProductDetails;
