import React from "react";
import Link from "next/link";
import Image from "next/image";
import { getLatestProduct } from "@/actions";
import notFoundImage from "../../public/not-found-image.png";
import { FaArrowRight } from "react-icons/fa";

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

const truncateText = (text: string, maxLength: number) => {
  return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
};

export const HeroBanner: React.FC<HeroBannerProps> = async ({ heroBanner }) => {
  const productLatest = await getLatestProduct();

  return (
    <section className="!bg-white !rounded-2xl !shadow-lg !overflow-hidden !mt-8">
      <div className="flex flex-col md:flex-row">
        {/* Imagen */}
        <div className="w-full md:w-1/2 !bg-gray-50 flex items-center justify-center p-6">
          <div className="relative w-full max-w-[500px] aspect-square">
            <Image
              src={productLatest?.imagenes?.[0]?.url || notFoundImage}
              alt={productLatest?.nombre || ''}
              fill
              className="!object-contain !rounded-xl"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        </div>

        {/* Info del producto */}
        <div className="w-full md:w-1/2 p-6 sm:p-10 flex items-center justify-center">
          <div className="w-full max-w-md flex flex-col gap-4 !p-2">
            <p className="!text-sm !uppercase !tracking-widest !text-gray-500">
              {heroBanner.smallText}
            </p>
            {productLatest?.categoria && (
              <span className="!text-sm !uppercase !font-semibold !text-[#f02d34]">
                {typeof productLatest.categoria === "object"
                  ? productLatest.categoria.nombre
                  : productLatest.categoria}
              </span>
            )}
            <h1 className="!text-3xl sm:!text-4xl !font-extrabold !text-gray-900">
              {productLatest?.nombre}
            </h1>
            <p className="!text-gray-700 !text-base">
              {truncateText(productLatest?.descripcion || "", 120)}
            </p>
            <div>
              <Link href={`/product/${productLatest?.slug}`}>
                <button className="!mt-2 inline-flex items-center justify-center gap-2 bg-[#f02d34] hover:bg-[#d32f2f] !text-white font-semibold !py-3 !px-6 !rounded-full !transition !duration-300">
                  Ver producto <FaArrowRight size={16} />
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
