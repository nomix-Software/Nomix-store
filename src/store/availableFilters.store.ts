// src/store/useAvailableFilters.ts
import { create } from "zustand";
import { devtools } from "zustand/middleware";

interface FiltroConCantidad {
  nombre: string;
  cantidad: number;
}

interface FiltersState {
  availableBrands: FiltroConCantidad[];
  availableCategories: FiltroConCantidad[];
  setAvailableBrands: (brands: FiltroConCantidad[]) => void;
  setAvailableCategories: (categories: FiltroConCantidad[]) => void;
  resetFilters: () => void;
}

export const useAvailableFilters = create<FiltersState>()(
  devtools(
    (set) => ({
      availableBrands: [],
      availableCategories: [],
      setAvailableBrands: (brands) =>
        set({ availableBrands: brands }, false, "setAvailableBrands"),
      setAvailableCategories: (categories) =>
        set({ availableCategories: categories }, false, "setAvailableCategories"),
      resetFilters: () =>
        set({ availableBrands: [], availableCategories: [] }, false, "resetFilters"),
    }),
    { name: "AvailableFiltersStore" }
  )
);
