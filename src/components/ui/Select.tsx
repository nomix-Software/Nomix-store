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
    <div>
      <div className="flex justify-between items-center mb-1">
        <Label label={label} />
        {buttonAction}
      </div>
      <select
        name={name}
        value={value}
        onChange={onChange}
        className={` h-[36px] !px-4 w-full  py-2 border ${
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
        <p className="text-sm text-red-600 flex items-center !mt-1">
          <AiOutlineExclamationCircle size={16} className="!mx-2" />
          {errors.brand}
        </p>
      )}
    </div>
  );
};
