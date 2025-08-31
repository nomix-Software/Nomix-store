'use client'
import Link from 'next/link'
import React from 'react'
import { FaGift, FaTicketAlt, FaRegCalendarCheck, FaGlobe, FaFileAlt, FaStar, FaGamepad } from 'react-icons/fa'
import { useSession } from 'next-auth/react'

export const RaspaGanaSection = () => {
  const { data: session } = useSession();

  return (
    <div className="flex !mt-3 flex-col items-center justify-center !py-12 !px-4 !text-center !bg-white !rounded-3xl !shadow-2xl !mb-12 w-full">
      <div className="!mb-6">
        <FaStar className="mx-auto !w-24 !h-24 animate-bounce !text-[#f02d34]" />
      </div>
      <h3 className="!text-4xl md:!text-4xl !font-extrabold !text-[#f02d34] !mb-4 drop-shadow-lg">
        ¡Jugá y Ganá con <span className="!text-[#324d67]">Raspa-Gana</span>!
      </h3>
      <p className="!text-lg md:!text-xl !text-gray-700 !mb-6 !max-w-2xl mx-auto">
        Registrate, iniciá sesión y participá en nuestro exclusivo juego{' '}
        <span className="!font-bold !text-[#f02d34]">Raspa-Gana</span>.<br />
        ¡Raspá la tarjeta virtual y descubrí si ganaste{' '}
        <span className="!font-bold !text-green-600">cupones de descuento</span>{' '}
        para tus compras!
      </p>
      {!session ? (
        <div className="flex flex-col md:flex-row gap-4 justify-center !mb-8">
          <Link href="/auth/register">
            <button className="!bg-[#f02d34] cursor-pointer !text-white !font-bold !rounded-2xl !py-3 !px-8 !shadow-lg hover:!scale-105 transition-transform !text-lg flex items-center gap-2">
              <span>Registrate</span>
              <FaGlobe className="!w-6 !h-6" />
            </button>
          </Link>
          <Link href="/auth/login">
            <button className="!bg-[#324d67] cursor-pointer !text-white !font-bold !rounded-2xl !py-3 !px-8 !shadow-lg hover:!scale-105 transition-transform !text-lg flex items-center gap-2">
              <span>Iniciar sesión</span>
              <FaFileAlt className="!w-6 !h-6" />
            </button>
          </Link>
        </div>
      ) : (
        <div className="flex justify-center !mb-8">
          <Link href="/raspa-gana">
            <button className="!bg-gradient-to-r cursor-pointer from-[#f02d34] to-[#324d67] !text-white !font-bold !rounded-2xl !py-3 !px-10 !shadow-lg hover:!scale-105 transition-transform !text-lg flex items-center gap-3 animate-pulse">
              <span>¡Jugar ahora!</span>
              <FaGamepad className="!w-7 !h-7" />
            </button>
          </Link>
        </div>
      )}
  <div className="flex flex-col items-center gap-2 !mb-4">
      <p className="text-xs text-gray-500 mt-2 max-w-md text-center">
        Si ganás, el cupón será enviado automáticamente a tu correo electrónico registrado.
      </p>
        <span className="inline-flex items-center gap-2 !text-green-600 !font-semibold !text-lg">
          <FaGift className="!w-6 !h-6" />
          ¡Premios instantáneos!
        </span>
        <span className="inline-flex items-center gap-2 !text-[#f02d34] !font-semibold !text-lg">
          <FaTicketAlt className="!w-6 !h-6" />
          Cupones exclusivos para vos
        </span>
        <span className="inline-flex items-center gap-2 !text-blue-600 !font-semibold !text-lg">
          <FaRegCalendarCheck className="!w-6 !h-6" />
          ¡Jugá todos los días!
        </span>
      </div>
    </div>
  );
}
