"use client";
import { useState } from "react";
import { AiFillStar, AiOutlineStar } from "react-icons/ai";
import Textarea from "@/components/ui/Textarea";

export function ReviewForm({ productId, onCancel }: { productId: number; onCancel: () => void }) {
  const [rating, setRating] = useState(5);
  const [hovered, setHovered] = useState<number | null>(null);
  const [comentario, setComentario] = useState("");
  const [loading, setLoading] = useState(false);

  const ratingLabels = [
    "Muy malo",
    "Malo",
    "Regular",
    "Bueno",
    "Excelente"
  ];

  // TODO: Lógica para guardar la review
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // ...guardar review
    setLoading(false);
    onCancel();
  };

  return (
    <form onSubmit={handleSubmit} className="!bg-white !border !px-1 !border-gray-200 !rounded-2xl !p-0 sm:!p-6 !mt-5 !shadow-sm !flex !flex-col !gap-2 !items-center">
      <label className="!block !mb-2 !font-semibold !text-base !text-[#324d67]">Tu valoración:</label>
      <div className="!flex !gap-1 !mb-2 !justify-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            type="button"
            key={star}
            className="focus:!outline-none !cursor-pointer"
            onClick={() => setRating(star)}
            onMouseEnter={() => setHovered(star)}
            onMouseLeave={() => setHovered(null)}
            aria-label={ratingLabels[star - 1]}
          >
            {star <= (hovered ?? rating) ? (
              <AiFillStar className="!text-yellow-400 !text-2xl" />
            ) : (
              <AiOutlineStar className="!text-gray-300 !text-2xl" />
            )}
          </button>
        ))}
      </div>
      <div className="!mb-4 !h-5 !text-center">
        <span className="!text-sm !text-gray-600 !font-medium">
          {hovered ? ratingLabels[hovered - 1] : ratingLabels[rating - 1]}
        </span>
      </div>
      <Textarea
        name="comentario"
        className="!mb-4 !w-full !min-h-[96px]"
        placeholder="Contanos tu experiencia..."
        value={comentario}
        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setComentario(e.target.value)}
      />
      <div className="!flex !gap-3 !justify-center">
        <button
          type="submit"
          className="!bg-[#f02d34] cursor-pointer !text-white !px-6 !py-2 !rounded-full !font-semibold hover:!bg-[#d12a2f] !transition !shadow-sm"
          disabled={loading}
        >
          Enviar reseña
        </button>
        <button
          type="button"
          className="!bg-gray-200 !text-gray-700 cursor-pointer !px-6 !py-2 !rounded-full !font-semibold hover:!bg-gray-300 !transition"
          onClick={onCancel}
          disabled={loading}
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}
