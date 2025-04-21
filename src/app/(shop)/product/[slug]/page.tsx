"use client";
import React, { useEffect, useState } from "react";
import {
  AiOutlineMinus,
  AiOutlinePlus,
  AiFillStar,
  AiOutlineStar,
} from "react-icons/ai";

// import { client, urlFor } from "../../lib/client";
// import { useStateContext } from "../../context/StateContext";
import type { ProductDetails } from "@/interfaces";
import Image from "next/image";
import { getProductDetail } from "@/actions";
import { notFound, useParams } from "next/navigation";
import { useCartStore } from "@/store";
import { Quantity } from "@/components";
interface Params {
  [key: string]: string;
  slug: string;
}
const ProductDetails = () => {
  const params = useParams<Params>();
  const [productDetail, setProductDetail] = useState<ProductDetails>();
  const [loading, setLoading] = useState(true);
  const [index, setIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const { addToCart, setShowCart } = useCartStore((state) => state);
  // const productDetail = useMemo(async () => await getProductDetail(params.slug), [])
  if (!loading && !productDetail) notFound();

  useEffect(() => {
    (async () => {
      const productDetail = await getProductDetail(params.slug);
      if (productDetail) {
        setProductDetail(productDetail);
      } else {
        console.error("Product detail not found");
        notFound();
      }
      setLoading(false);
      console.log(productDetail);
    })();
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  const { nombre, precio, descripcion, imagenes, stock } = productDetail!;
  //   const { decQty, incQty, qty, onAdd, setShowCart } = useStateContext();

  const handleBuyNow = () => {
    // onAdd(product, qty);
    if (!productDetail) return;
    addToCart({
      id: productDetail?.id,
      nombre: productDetail?.nombre,
      slug: productDetail?.slug,
      cantidad: quantity,
      precio: productDetail?.precio,
      stock: productDetail?.stock,
      imagen: productDetail?.imagenes[0].url,
    });
    setShowCart(true);
  };
  const handleChageQty = (value: number) => {
    if (value > stock || value < 0) return;
    setQuantity(value);
  };

  return (
    <div>
      <div className="product-detail-container">
        <div>
          <div className="image-container">
            {imagenes.length && (
              <Image
                src={imagenes[index].url}
                alt="product image"
                width={500}
                height={500}
                className="product-detail-image"
              />
            )}
          </div>
          <div className="small-images-container">
            {imagenes.length > 1 &&
              imagenes.map((imagen, i) => (
                <Image
                  key={`${imagen.id}-${i}`}
                  width={100}
                  height={100}
                  src={imagen.url}
                  alt="product image"
                  className={
                    i === index
                      ? " cursor-pointer small-image selected-image hover:opacity-50 hover:scale-110"
                      : "cursor-pointer small-image"
                  }
                  onMouseEnter={() => {
                    setIndex(i);
                  }}
                />
              ))}
          </div>
        </div>

        <div className="product-detail-desc">
          <h1 className="font-extrabold ">{nombre}</h1>
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
          <p>{descripcion}</p>
          <p className="price">${precio}</p>
          <Quantity
            quantity={quantity}
            onChange={(value) => handleChageQty(value)}
          />
          <div className="buttons">
            <button
              type="button"
              className="add-to-cart"
              disabled={stock === 0 || quantity === 0}
              onClick={() =>
                addToCart({
                  id: productDetail?.id,
                  nombre: productDetail?.nombre,
                  slug: productDetail?.slug,
                  cantidad: quantity,
                  precio: productDetail?.precio,
                  stock: productDetail?.stock,
                  imagen: productDetail?.imagenes[0].url,
                })
              }
            >
              Agregar al carrito
            </button>
            <button type="button" className="buy-now" onClick={handleBuyNow}>
              Comprar ahora
            </button>
          </div>
        </div>
      </div>
      {/* tambien te puede gustar */}
      {/* <div className="maylike-products-wrapper">
        <h2>You may also like</h2>
        <div className="marquee">
          <div className="maylike-products-container track">
            {products.map((item: ProductItem) => (
              <Product key={item._id} product={item} />
            ))}
          </div>
        </div>
      </div> */}
    </div>
  );
};

export default ProductDetails;
