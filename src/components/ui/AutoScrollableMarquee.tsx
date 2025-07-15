'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, FreeMode, Mousewheel } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/autoplay';
import 'swiper/css/free-mode';

import { Product } from '../Product';
import { ProductItem } from '@/interfaces';

interface ProductSliderProps {
  products: ProductItem[];
}

export function AutoScrollableMarquee({ products }: ProductSliderProps) {

  return (
    <div className="relative group !mx-5 !px-5">
      {/* Sombras laterales */}
      <div className="pointer-events-none absolute left-0 top-0 h-full w-10 z-10 bg-gradient-to-r from-white to-transparent" />
      <div className="pointer-events-none absolute right-0 top-0 h-full w-10 z-10 bg-gradient-to-l from-white to-transparent" />

      <Swiper
        modules={[Autoplay, FreeMode, Mousewheel]}
        slidesPerView="auto"
        spaceBetween={16}
        freeMode={true}
        grabCursor={true}
        loop={false}
        mousewheel={{ forceToAxis: true }}
        autoplay={{
          delay: 0,
          disableOnInteraction: false,
          pauseOnMouseEnter: true, // 👉 esto pausa al hacer hover
        }}
        speed={3000} // velocidad constante
        style={{ padding: '1rem 0' }}
      >
        {products.map((product, index) => (
          <SwiperSlide
            key={`${product._id}-${index}`}
            style={{
              width: '250px',
              height: 'auto',
              flexShrink: 0,
            }}
          >
            <Product product={{ ...product, id: Number(product._id)  }} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
