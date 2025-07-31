'use client'
import { useState } from "react";
import { useSession } from "next-auth/react";
import { AiFillStar, AiOutlineStar } from "react-icons/ai";
import { ReviewForm } from "./ReviewForm";

// TODO: Reemplazar con fetch real de reviews y validación de compra
const mockReviews = [
  { id: 1, usuario: { name: "Juan" }, rating: 5, comentario: "Excelente producto!", createdAt: new Date() },
  { id: 2, usuario: { name: "Ana" }, rating: 4, comentario: "Muy bueno, llegó rápido.", createdAt: new Date() },
];

export  function ProductReviews({ productId, userHasBought, mode = "full" }: { productId: number; userHasBought: boolean; mode?: "full" | "summary" | "list" }) {
  const { data: session } = useSession();
  const [showForm, setShowForm] = useState(false);
  const [showList, setShowList] = useState(false);

  // TODO: Reemplazar con reviews reales
  const reviews = mockReviews;
  const cantidad = reviews.length;
  const promedio = cantidad > 0 ? reviews.reduce((acc, r) => acc + r.rating, 0) / cantidad : 0;

  if (mode === "summary") {
    // Solo estrellas y cantidad, sin listado ni formulario
    return (
      <div className="!flex !items-center !gap-2">
        <span className="!flex !items-center">
          {Array.from({ length: 5 }).map((_, i) => {
            const full = i + 1 <= Math.floor(promedio);
            const half = !full && i < promedio && promedio % 1 >= 0.25;
            if (full) return <AiFillStar key={i} className="!text-yellow-400 !text-xl" />;
            if (half) {
              return (
                <span key={i} className="!relative !inline-block !w-5 !h-5">
                  <AiFillStar className="!text-yellow-400 !text-xl !absolute !left-0 !top-0 !w-full !h-full !z-0" style={{ clipPath: 'inset(0 50% 0 0)' }} />
                  <AiOutlineStar className="!text-gray-300 !text-xl !absolute !left-0 !top-0 !w-full !h-full !z-10" />
                </span>
              );
            }
            return <AiOutlineStar key={i} className="!text-gray-300 !text-xl" />;
          })}
        </span>
        <span className="!text-base !font-semibold !text-gray-700">{promedio > 0 ? promedio.toFixed(1) : "-"}</span>
        <span className="!text-sm !text-gray-500">({cantidad})</span>
      </div>
    );
  }
  if (mode === "list") {
    // Solo listado y formulario, sin estrellas/cantidad arriba
    return (
      <div className="!max-w-xl !mx-auto !text-center">
        <button
          className="!text-[#f02d34] hover:!underline cursor-pointer !text-sm !font-semibold !mb-4 !bg-transparent !border-none !outline-none"
          onClick={() => setShowList((v) => !v)}
          disabled={cantidad === 0}
        >
          {showList ? "Ocultar reseñas" : `Ver ${cantidad} reseña${cantidad === 1 ? "" : "s"}`}
        </button>
        {showList && cantidad > 0 && (
          <ul className="!space-y-5 !mb-8">
            {reviews.map((r) => (
              <li key={r.id} className="!bg-white !rounded-2xl !p-5 !border !border-gray-100 !shadow-sm !text-left">
                <div className="!flex !items-center !gap-3 !mb-2">
                  <span className="!font-semibold !text-[#324d67] !text-base">{r.usuario.name}</span>
                  <span className="!flex !items-center">
                    {Array.from({ length: 5 }).map((_, i) =>
                      i < r.rating ? (
                        <AiFillStar key={i} className="!text-yellow-400 !text-lg" />
                      ) : (
                        <AiOutlineStar key={i} className="!text-gray-300 !text-lg" />
                      )
                    )}
                  </span>
                  <span className="!text-xs !text-gray-400 !ml-2">{r.createdAt.toLocaleDateString()}</span>
                </div>
                <p className="!text-gray-800 !text-base">{r.comentario}</p>
              </li>
            ))}
          </ul>
        )}
        {session?.user && userHasBought && (
          <div className="!mt-4">
            {!showForm ? (
              <button
                className="!bg-[#f02d34] !text-white !px-6 !py-2 !rounded-full !font-semibold hover:!bg-[#d12a2f] !transition !shadow-sm"
                onClick={() => setShowForm(true)}
              >
                Dejar reseña
              </button>
            ) : (
              <ReviewForm productId={productId} onCancel={() => setShowForm(false)} />
            )}
          </div>
        )}
      </div>
    );
  }
  // Modo full (legacy): todo junto
  return (
    <div className="!mt-10 !max-w-xl !mx-auto !text-center">
      <div className="!flex !items-center !justify-center !gap-2 !mb-2">
        <span className="!flex !items-center">
          {Array.from({ length: 5 }).map((_, i) => {
            const full = i + 1 <= Math.floor(promedio);
            const half = !full && i < promedio && promedio % 1 >= 0.25;
            if (full) return <AiFillStar key={i} className="!text-yellow-400 !text-xl" />;
            if (half) {
              return (
                <span key={i} className="!relative !inline-block !w-5 !h-5">
                  <AiFillStar className="!text-yellow-400 !text-xl !absolute !left-0 !top-0 !w-full !h-full !z-0" style={{ clipPath: 'inset(0 50% 0 0)' }} />
                  <AiOutlineStar className="!text-gray-300 !text-xl !absolute !left-0 !top-0 !w-full !h-full !z-10" />
                </span>
              );
            }
            return <AiOutlineStar key={i} className="!text-gray-300 !text-xl" />;
          })}
        </span>
        <span className="!text-base !font-semibold !text-gray-700">{promedio > 0 ? promedio.toFixed(1) : "-"}</span>
        <span className="!text-sm !text-gray-500">({cantidad})</span>
      </div>
      <button
        className="!text-[#f02d34] hover:!underline cursor-pointer !text-sm !font-semibold !mb-4 !bg-transparent !border-none !outline-none"
        onClick={() => setShowList((v) => !v)}
        disabled={cantidad === 0}
      >
        {showList ? "Ocultar reseñas" : `Ver ${cantidad} reseña${cantidad === 1 ? "" : "s"}`}
      </button>
      {showList && cantidad > 0 && (
        <ul className="!space-y-5 !mb-8">
          {reviews.map((r) => (
            <li key={r.id} className="!bg-white !rounded-2xl !p-5 !border !border-gray-100 !shadow-sm !text-left">
              <div className="!flex !items-center !gap-3 !mb-2">
                <span className="!font-semibold !text-[#324d67] !text-base">{r.usuario.name}</span>
                <span className="!flex !items-center">
                  {Array.from({ length: 5 }).map((_, i) =>
                    i < r.rating ? (
                      <AiFillStar key={i} className="!text-yellow-400 !text-lg" />
                    ) : (
                      <AiOutlineStar key={i} className="!text-gray-300 !text-lg" />
                    )
                  )}
                </span>
                <span className="!text-xs !text-gray-400 !ml-2">{r.createdAt.toLocaleDateString()}</span>
              </div>
              <p className="!text-gray-800 !text-base">{r.comentario}</p>
            </li>
          ))}
        </ul>
      )}
      {session?.user && userHasBought && (
        <div className="!mt-4">
          {!showForm ? (
            <button
              className="!bg-[#f02d34] !text-white !px-6 !py-2 !rounded-full !font-semibold hover:!bg-[#d12a2f] !transition !shadow-sm"
              onClick={() => setShowForm(true)}
            >
              Dejar reseña
            </button>
          ) : (
            <ReviewForm productId={productId} onCancel={() => setShowForm(false)} />
          )}
        </div>
      )}
    </div>
  );
}


