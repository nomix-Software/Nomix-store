import React from "react";
import Link from "next/link";
import Image from "next/image";
import { getLatestProduct } from "@/actions";
import notFoundImage from '../../public/not-found-image.png'
interface HeroBannerProps {
  heroBanner: {
    smallText: string;
    midText: string;
    largeText1: string;
    image: string;
    product: string;
    buttonText: string;
    desc: string;
  };
}

export const HeroBanner: React.FC<HeroBannerProps> = async ({ heroBanner }) => {
  const productLatest = await getLatestProduct();
  return (
    <div className=" rounded-2xl bg-[#dcdcdc] p-4 sm:!p-10 ">
      <div className="flex flex-col md:flex-row items-center justify-around ">
        <div className="md:w-1/2">
          <p className="beats-solo text-4xl font-extrabold">
            {heroBanner.smallText}
          </p>
          {productLatest?.categoria && (
            <h3 className="text-[18px] sm:!text-2xl text-[#324d67] font-semibold">
              {typeof productLatest?.categoria === "object"
                ? productLatest.categoria.nombre
                : productLatest?.categoria}
            </h3>
          )}
          <h1 className="text-2xl font-extrabold  sm:!text-4xl md:!text-8xl !my-2 sm:!mt-3 products-heading !text-left">
            {productLatest?.nombre}
          </h1>
        </div>

        <div className="flex flex-col justify-center gap-2 sm:gap-4  w-full md:w-1/2 md:items-center">
          <Image
            src={productLatest?.imagenes[0].url || notFoundImage}
            width={300}
            height={300}
            alt="headphones"
            // className="hero-banner-image"
          />
          <div className="desc mb-5 !px-2 !w-full  flex flex-col gap-1 justify-end !items-end">
            <h5>Descripción</h5>
            <p>{productLatest?.descripcion}</p>
          </div>
          <Link href={`/product/${productLatest?.slug}`} className=" flex justify-center !mb-2">
            <button
              type="button"
              className="bg-[#f02d34] cursor-pointer text-white rounded-2xl !py-2.5 !px-4 !w-[140px] transform transition-transform duration-300 hover:scale-110"
            >
              {heroBanner.buttonText}
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};
