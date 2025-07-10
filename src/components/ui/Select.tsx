'use client'
import React, { useRef, useState } from "react";
// import toast from "react-hot-toast";
import { AiOutlineExclamationCircle, AiOutlineDown } from "react-icons/ai";
import { Label } from "./Label";
// import { FiPlusCircle } from "react-icons/fi";

export interface SelectProps {
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  errors?: { [key: string]: string };
  label?: string;
  helperText?: string;
  className?: string;
  options: Array<{ id: string; nombre: string }>;
  buttonAction?: React.ReactNode;
}
export const Select = ({
  label,
  value,
  errors,
  name,
  onChange,
  options,
  helperText,
  className,
  buttonAction,
}: SelectProps) => {
  const [open, setOpen] = useState(false);
  const [focused, setFocused] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);

  // Manejo de apertura/cierre para animación y accesibilidad
  const handleFocus = () => {
    setOpen(true);
    setFocused(true);
  };
  const handleBlur = (e: React.FocusEvent<HTMLDivElement>) => {
    // Cierra solo si el focus sale del contenedor
    if (!selectRef.current?.contains(e.relatedTarget as Node)) {
      setOpen(false);
      setFocused(false);
    }
  };
  const handleOptionClick = (id: string) => {
    setOpen(false);
    setFocused(false);
    // Simula el evento de cambio
    const event = { target: { value: id, name } } as React.ChangeEvent<HTMLSelectElement>;
    onChange(event);
  };
  const selectedOption = options.find((opt) => opt.id === value);

  return (
    <div className="w-full !my-2">
      <div className="flex justify-between items-center mb-1">
        <Label label={label} />
      </div>
      <div
        className="flex items-center gap-2 relative"
        tabIndex={-1}
        ref={selectRef}
        onBlur={handleBlur}
      >
        <div className="w-full relative">
          <button
            type="button"
            className={`!mt-1 !block !w-full !border !border-gray-200 !rounded-full !shadow-sm !p-3 !pr-10 !text-base !text-gray-800 !placeholder-gray-400 focus:!border-[#f02d34] focus:!ring-2 focus:!ring-[#f02d34]/20 !outline-none !bg-white text-left transition-all ${open || focused ? '!border-[#f02d34] !ring-2 !ring-[#f02d34]/20' : ''} ${errors?.brand ? '!border-red-500' : '!border-gray-200'} ${className}`}
            onClick={() => setOpen((v) => !v)}
            onFocus={handleFocus}
            aria-haspopup="listbox"
            aria-expanded={open}
          >
            {selectedOption ? selectedOption.nombre : <span className="text-gray-400">{helperText}</span>}
            <span className="pointer-events-none absolute top-1/2 right-4 transform -translate-y-1/2 flex items-center justify-center">
              <AiOutlineDown size={18} className={`text-gray-400 transition-transform duration-200 ${open ? 'rotate-180' : 'rotate-0'}`} />
            </span>
          </button>
          {open && (
            <ul
              className="absolute z-10 left-0 right-0 mt-2 !bg-white !border !border-gray-200 !rounded-2xl !shadow-lg !py-1 !max-h-60 !overflow-auto animate-fade-in"
              role="listbox"
              tabIndex={-1}
            >
              {options.map(({ id, nombre }) => (
                <li
                  key={id}
                  role="option"
                  aria-selected={id === value}
                  className={`!px-4 !py-2 !cursor-pointer !text-base !text-gray-800 hover:!bg-[#f02d34]/10 transition-colors ${id === value ? '!bg-[#f02d34]/20 !font-semibold' : ''}`}
                  onMouseDown={() => handleOptionClick(id)}
                >
                  {nombre}
                </li>
              ))}
            </ul>
          )}
          {errors?.brand && (
            <p className="text-sm text-red-600 flex items-center mt-1">
              <AiOutlineExclamationCircle size={16} className="mr-2" />
              {errors.brand}
            </p>
          )}
        </div>
        {/* Botón a la derecha del select */}
        <div className="shrink-0">
          {buttonAction}
        </div>
      </div>
    </div>
  );
};
