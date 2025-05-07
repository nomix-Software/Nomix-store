import React from "react";
// import toast from "react-hot-toast";
import { AiOutlineExclamationCircle } from "react-icons/ai";
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
  return (
    <div className="w-full !my-2">
    <div className="flex justify-between items-center mb-1">
      <Label label={label} />
    </div>

    <div className="flex items-center gap-2">
      <div className="w-full">
        <select
          name={name}
          value={value}
          onChange={onChange}
          className={`h-9 px-4 py-2 border w-full rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
            errors?.brand ? "border-red-500" : "border-gray-300"
          } ${className}`}
        >
          <option value="">{helperText}</option>
          {options.map(({ id, nombre }, index) => (
            <option key={`${nombre}-${index}`} value={id}>
              {nombre}
            </option>
          ))}
        </select>
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
