"use client";

import { useState } from "react";
import { Filters } from "./Filters";
import { FaFilter, FaTimes } from "react-icons/fa";
import SearchBar from "../ui/SearchBar";

export const ModalMobileFilters = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Botón de apertura visible solo en mobile */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-5 right-5 z-40 flex items-center gap-2 bg-red-600 text-white !px-4 !py-2 rounded-full shadow-lg md:hidden"
        title="Abrir filtros"
      >
        <FaFilter size={18} />
        <span className="text-sm font-medium">Filtros</span>
      </button>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 backdrop-blur-md bg-white/30 flex items-end md:hidden">
          <div className="w-full bg-white rounded-t-xl !p-4 h-[92vh] overflow-y-auto shadow-lg border-t border-gray-200">
            {/* Encabezado del modal */}
            <div className="flex justify-between items-center !mb-4">
              <h2 className="text-lg font-semibold text-[#324d67]">
                Filtros y búsqueda
              </h2>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-600 hover:text-red-500"
                title="Cerrar"
              >
                <FaTimes size={20} />
              </button>
            </div>
            <div className="flex flex-row justify-between">

              {/* Filtros (adaptados para mobile) */}
              <div>
                <Filters isMobile />
              </div>
                            {/* Barra de búsqueda (adaptada para mobile) */}
              <div className="mb-4">
                <SearchBar />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
