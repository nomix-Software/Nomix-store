"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { FC } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  //   onPageChange: (page: number) => void;
}

export const Pagination: FC<PaginationProps> = ({
  currentPage,
  totalPages,
  //   onPageChange,
}) => {


    const router = useRouter();
    const searchParams = useSearchParams();
  const getPageNumbers = () => {
    const delta = 2; // cantidad de páginas alrededor de la actual
    const pages: (number | "...")[] = [];

    const range = (start: number, end: number) =>
      Array.from({ length: end - start + 1 }, (_, i) => start + i);

    const left = Math.max(2, currentPage - delta);
    const right = Math.min(totalPages - 1, currentPage + delta);

    pages.push(1);

    if (left > 2) {
      pages.push("...");
    }

    pages.push(...range(left, right));

    if (right < totalPages - 1) {
      pages.push("...");
    }

    if (totalPages > 1) {
      pages.push(totalPages);
    }

    return pages;
  };

  const canGoBack = currentPage > 1;
  const canGoNext = currentPage < totalPages;

  const onPageChange = (page: number) => {

  
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
  
    router.push(`?${params.toString()}`);
  };
  return (
    <div className="flex items-center justify-center gap-1 !mt-4 select-none">
      <button
        onClick={() => canGoBack && onPageChange(currentPage - 1)}
        disabled={!canGoBack}
        className={`!p-2 rounded-full cursor-pointer ${
          canGoBack ? "hover:bg-gray-200" : "opacity-50 cursor-not-allowed"
        }`}
      >
        <FaChevronLeft />
      </button>

      {getPageNumbers().map((page, index) =>
        page === "..." ? (
          <span key={`ellipsis-${index}`} className="px-2 py-1 text-gray-500">
            ...
          </span>
        ) : (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`!px-3 !py-1 rounded-md text-sm font-medium cursor-pointer ${
              page === currentPage
                ? "bg-red-500 text-white"
                : "bg-gray-100 text-[#324d67] hover:bg-red-800  hover:text-white"
            }`}
          >
            {page}
          </button>
        )
      )}

      <button
        onClick={() => canGoNext && onPageChange(currentPage + 1)}
        disabled={!canGoNext}
        className={`!p-2 rounded-full cursor-pointer ${
          canGoNext ? "hover:bg-gray-200" : "opacity-50 cursor-not-allowed"
        }`}
      >
        <FaChevronRight />
      </button>
    </div>
  );
};
