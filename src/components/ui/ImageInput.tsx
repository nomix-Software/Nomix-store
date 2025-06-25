import React from "react";

interface ImageInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  errors?: { [key: string]: string };
  name?: string;
}

export const ImageInput = ({ label, className, errors, name = "image", ...props }: ImageInputProps) => {
  return (
    <div className="mt-4">
      <span className="block text-sm font-medium !mb-2">{label}</span>
      <input
        type="file"
        accept="image/*"
        className={`block w-full text-sm text-gray-500
    file:mr-4 file:py-2 file:px-4
    file:rounded-full file:border-0
    file:text-sm file:font-semibold
    file:bg-red-600 file:text-white cursor-pointer
    hover:file:bg-red-700 ${className}`}
        name={name}
        {...props}
      />
      {errors && errors[name] && (
        <span className="text-xs text-red-600 mt-1 block">{errors[name]}</span>
      )}
    </div>
  );
};
