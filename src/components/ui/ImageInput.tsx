import React from "react";

interface ImageInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export const ImageInput = ({ label, className, ...props }: ImageInputProps) => {
  return (
    <div className="mt-4">
      <span className="block text-sm font-medium mb-2">{label}</span>
      <input
        type="file"
        accept="image/*"
        className={`block w-full text-sm text-gray-500
    file:mr-4 file:py-2 file:px-4
    file:rounded-full file:border-0
    file:text-sm file:font-semibold
    file:bg-violet-50 file:text-violet-700
    hover:file:bg-violet-100 ${className}`}
        {...props}
      />
    </div>
  );
};
