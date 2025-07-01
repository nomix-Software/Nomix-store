"use client";

import React from "react";
import { CollapsibleFilterList } from "../ui/CollapsibleFilterList";
import { useAvailableFilters } from "@/store";
import { useRouter, useSearchParams } from "next/navigation";
import { FaTimesCircle } from "react-icons/fa";
import { countFiltersAdded } from "@/lib/utils/countFiltersAdded";

export const Filters = ({ isMobile }: { isMobile?: boolean }) => {
  const { availableBrands, availableCategories } = useAvailableFilters((state) => state);
  const router = useRouter();
  const searchParams = useSearchParams();

  const clearFilters = () => {
    const search = new URLSearchParams(searchParams.toString());
    search.delete("categorie");
    search.delete("brand");
    router.push(`/catalogo?${search.toString()}`);
  };

  return (
    <div className={`${isMobile ? "block" : "hidden md:flex"} w-full md:w-[260px]`}>
      <ul className="pl-6 flex flex-col gap-4">
        <CollapsibleFilterList
          items={availableCategories.map((filter) => ({
            label: filter.nombre,
            count: filter.cantidad,
          }))}
          title="Categorías"
          openDefault={true} // Abierto por defecto
          onSelect={(label) => {
            const search = new URLSearchParams(searchParams.toString());
            search.set("categorie", label);
            router.push(`/catalogo?${search.toString()}`);
          }}
        />

        <CollapsibleFilterList
          items={availableBrands.map((filter) => ({
            label: filter.nombre,
            count: filter.cantidad,
          }))}
          title="Marcas"
          onSelect={(label) => {
            const search = new URLSearchParams(searchParams.toString());
            search.set("brand", label);
            router.push(`/catalogo?${search.toString()}`);
          }}
        />

        {/* Botón de limpiar filtros */}
        {countFiltersAdded(searchParams.toString()) > 0 && (
          <button
            onClick={clearFilters}
            className="flex items-center gap-2 text-sm text-red-600 hover:text-red-700 mt-2 px-2 py-1 rounded transition-colors duration-200 hover:underline cursor-pointer"
          >
            <FaTimesCircle size={16} />
            Limpiar filtros ( {countFiltersAdded(searchParams.toString())} )
          </button>
        )}
      </ul>
    </div>
  );
};
