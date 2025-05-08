"use client";
import React from "react";
import { CollapsibleFilterList } from "../ui/CollapsibleFilterList";
import { useAvailableFilters } from "@/store";
import { useRouter, useSearchParams } from "next/navigation";

export const Filters = () => {
  const { availableBrands, availableCategories } = useAvailableFilters(
    (state) => state
  );
  const router = useRouter();
  const searchParams = useSearchParams();
  return (
    <div className=" hidden md:flex w-[150px]">
      <ul className=" pl-6">
        <CollapsibleFilterList
          items={availableCategories.map((filter) => {
            return { label: filter.nombre, count: filter.cantidad };
          })}
          title="Categorías"
          onSelect={(label) => {
            const search = new URLSearchParams(searchParams);
            search.set("categorie", label);
            router.push(`/catalogo?${search.toString()}`);
          }}
        />

        <CollapsibleFilterList
          items={availableBrands.map((filter) => {
            return { label: filter.nombre, count: filter.cantidad };
          })}
          title="Marcas"
          onSelect={(label) => {
            const search = new URLSearchParams(searchParams);
            search.set("brand", label);
            router.push(`/catalogo?${search.toString()}`);
          }}
        />
      </ul>
    </div>
  );
};
