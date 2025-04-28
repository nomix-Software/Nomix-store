import React from "react";
import { AiOutlineExclamationCircle } from "react-icons/ai";
import { Label } from "./Label";

export interface TextFieldProps {
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  errors?: { [key: string]: string };
  placeholder?: string;
  label?: string;
  type?: string;
  helperText?: string;
  className?: string;
}
export const TextField = ({
  name,
  onChange,
  errors,
  placeholder,
  label,
  helperText,
  value,
  type = "text",
  className,
}: TextFieldProps) => {
  return (
    <div className=" gap-1 flex flex-col !mb-4">
      <Label label={label} />
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className={` h-[36px] !px-4  w-full  py-2 border ${
          errors && errors.name ? "border-red-500" : "border-gray-300"
        } rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 !border-0.5 ${className}`}
        placeholder={placeholder}
      />
      {errors && errors.name ? (
        <p className="text-sm text-red-600 flex items-center mt-1">
          <AiOutlineExclamationCircle size={16} className="!mx-2" />
          {errors.name}
        </p>
      ) : (
        <p className="text-xs text-gray-500 mt-1 !px-4">{helperText}</p>
      )}
    </div>
  );
};
