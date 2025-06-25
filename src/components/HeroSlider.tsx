'use client';
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { FaArrowRight } from 'react-icons/fa';
import notFoundImage from '../../public/not-found-image.png';

interface Product {
  nombre: string;
  slug: string;
  descripcion: string;
  categoria: { nombre: string } | string;
  imagenes: { url: string }[];
}

interface HeroSliderProps {
  products: Product[];
}

const truncateText = (text: string, maxLength: number) => {
  return text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
};

export const HeroSlider: React.FC<HeroSliderProps> = ({ products }) => {
  return (
    <section className="!mt-8">
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        navigation
        pagination={{ clickable: true }}
        autoplay={{
          delay: 6000, // ⏱ cambia cada 6 segundos
          disableOnInteraction: false, // sigue automático aunque se haga click
        }}
        speed={1000} // 🐢 transición lenta (1s)
        loop
        className="!rounded-2xl !shadow-lg"
      >
        {products.map((product, index) => (
          <SwiperSlide key={index}>
            <div className="flex flex-col md:flex-row !bg-white">
              {/* Imagen */}
              <div className="w-full md:w-1/2 !bg-gray-50 flex items-center justify-center !p-6">
                <div className="relative w-full max-w-[500px] aspect-square">
                  <Image
                    src={product.imagenes?.[0]?.url || notFoundImage}
                    alt={product.nombre}
                    fill
                    className="!object-contain !rounded-xl"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
              </div>

              {/* Info */}
              <div className="w-full md:w-1/2 !p-6 sm:p-10 flex items-center justify-center">
                <div className="w-full max-w-md flex flex-col gap-4">
                  <p className="!text-sm !uppercase !tracking-widest !text-gray-500">
                    Producto destacado
                  </p>
                  {product.categoria && (
                    <span className="!text-sm !uppercase !font-semibold !text-[#f02d34]">
                      {typeof product.categoria === 'object'
                        ? product.categoria.nombre
                        : product.categoria}
                    </span>
                  )}
                  <h1 className="!text-3xl sm:!text-4xl !font-extrabold !text-gray-900">
                    {product.nombre}
                  </h1>
                  <p className="!text-gray-700 !text-base">
                    {truncateText(product.descripcion || '', 120)}
                  </p>
                  <Link href={`/product/${product.slug}`}>
                    <button className="!mt-2 inline-flex items-center justify-center gap-2 bg-[#f02d34] hover:bg-[#d32f2f] !text-white font-semibold !py-3 !px-6 !rounded-full !transition !duration-300">
                      Ver producto <FaArrowRight size={16} />
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};
