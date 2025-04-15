import React from "react";
import { AiOutlineExclamationCircle } from "react-icons/ai";

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
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-1">
        {label}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className={`w-full px-4 py-2 border ${
          errors && errors.name ? "border-red-500" : "border-gray-300"
        } rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${className}`}
        placeholder={placeholder}
      />
      {errors && errors.name ? (
        <p className="text-sm text-red-600 flex items-center mt-1">
          <AiOutlineExclamationCircle size={16} className="mr-1" />{" "}
          {errors.name}
        </p>
      ) : (
        <p className="text-xs text-gray-500 mt-1">{helperText}</p>
      )}
    </div>
  );
};
