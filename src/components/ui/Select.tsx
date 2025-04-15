import React from "react";
// import toast from "react-hot-toast";
import { AiOutlineExclamationCircle } from "react-icons/ai";
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
    <div>
      <div className="flex justify-between items-center mb-1">
        <label className="block text-sm font-semibold text-gray-700">
          {label}
        </label>
        {buttonAction}
        {/* <button
          type="button"
          onClick={() => toast("Abrir modal de nueva marca")}
          className="flex items-center text-indigo-600 hover:underline text-sm"
        >
          <FiPlusCircle size={18} className="mr-1" /> Nueva
        </button> */}
      </div>
      <select
        name={name}
        value={value}
        onChange={onChange}
        className={`w-full px-4 py-2 border ${
          errors && errors.brand ? "border-red-500" : "border-gray-300"
        } rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${className}`}
      >
        <option value="">{helperText}</option>
        {options.map(({ id, nombre }, index) => (
          <option key={`${nombre}-${index}`} value={id}>
            {nombre}
          </option>
        ))}
      </select>
      {errors && errors.brand && (
        <p className="text-sm text-red-600 flex items-center mt-1">
          <AiOutlineExclamationCircle size={16} className="mr-1" />{" "}
          {errors.brand}
        </p>
      )}
    </div>
  );
};
