import React from "react";
export interface TextareaProps {
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  label?: string;
  helperText?: string;
  className?: string;
}
export default function Textarea({
  value,
  name,
  onChange,
  className,
  helperText,
  label,
  placeholder,
}: TextareaProps) {
  return (
    <div className="!w-full">
      <label className="block text-sm font-semibold text-gray-700 mb-1">
        {label}
      </label>
      <textarea
        name={name}
        value={value}
        onChange={onChange}
        className={`w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-y ${className}`}
        placeholder={placeholder}
        
      />
      <p className="text-xs text-gray-500 mt-1 !px-4">{helperText}</p>
    </div>
  );
}
