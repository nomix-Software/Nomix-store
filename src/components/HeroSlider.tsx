'use client';
import React from 'react';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
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

export const HeroSlider: React.FC<HeroSliderProps> = ({ products }) => {
  return (
    <>
      <style>
        {`
          .swiper-button-next,
          .swiper-button-prev {
            color: red;
            opacity: 0.3;
            transition: opacity 0.2s;
          }
          .swiper-button-next:hover,
          .swiper-button-prev:hover {
            opacity: 1;
          }
          .swiper-pagination-bullet {
            background: rgba(255, 255, 255, 0.5);
          }
          .swiper-pagination-bullet-active {
            background: white;
          }
        `}
      </style>
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
        className="!w-full !h-full"
      >
        {products.map((product, index) => (
          <SwiperSlide key={product.slug || index}>
              <div className="!relative !w-full !h-full !bg-transparent">
                {/* Imagen de fondo, desenfocada y ampliada */}
                <Image
                  src={product.imagenes?.[0]?.url || notFoundImage}
                  alt=""
                  fill
                  sizes="100vw"
                  aria-hidden="true"
                  className="!object-cover !blur-2xl !scale-110 !opacity-20"
                />
                              {/* Contenedor para la imagen principal centrada */}
                <div className="!absolute !inset-0 !flex !items-center !justify-center !p-4 !pt-0">
                  <Image
                    src={product.imagenes?.[0]?.url || notFoundImage}
                    alt={`Banner de ${product.nombre}`}
                    width={450}
                    height={450}
                    className="!object-contain !w-auto !h-auto !max-w-full !max-h-full"
                    priority={index === 0}
                  />
                </div>
              </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </>
  );
};
