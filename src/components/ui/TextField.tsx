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
  required?: boolean;
  endIcon?: React.ReactNode; // NUEVA PROP
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
  required,
  endIcon,
}: TextFieldProps) => {
  const hasError = errors && errors[name];

  return (
    <div className="gap-1 flex flex-col !mb-4">
      <Label label={label} />
      <div className="relative">
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          className={`h-[36px] !px-4 w-full pr-10 py-2 border ${
            hasError ? "border-red-500" : "border-gray-300"
          } rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 !border-0.5 ${className}`}
          placeholder={placeholder}
          required={required}
        />
        {endIcon && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer">
            {endIcon}
          </div>
        )}
      </div>
      {hasError ? (
        <p className="text-sm text-red-600 flex items-center mt-1">
          <AiOutlineExclamationCircle size={16} className="!mx-2" />
          {errors[name]}
        </p>
      ) : (
        <p className="text-xs text-gray-500 mt-1 !px-4">{helperText}</p>
      )}
    </div>
  );
};
