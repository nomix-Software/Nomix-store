'use client';

import React, { useEffect, useState } from 'react';
import { AiOutlineExclamationCircle, AiOutlineClose } from 'react-icons/ai';
import { Label } from '../ui/Label';
import { useProducts } from '@/hooks';
import { ProductItem } from '@/interfaces';

export interface AutocompleteProps {
  name: string;
  value: string;
  onChange: (value: ProductItem | null) => void;
  label?: string;
  errors?: { [key: string]: string };
  helperText?: string;
  className?: string;
  buttonAction?: React.ReactNode;
}

export const Autocomplete: React.FC<AutocompleteProps> = ({
  name,
  value,
  onChange,
  label,
  errors,
  helperText,
  className = '',
  buttonAction,
}) => {
  const [query, setQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [debounceQuery, setDebounceQuery] = useState('');
  const { productos, isLoading } = useProducts(
    `/api/products?search=${encodeURIComponent(debounceQuery.trim())}`
  );

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (query.length > 3) {
        setDebounceQuery(query);
      }
    }, 300);
    return () => clearTimeout(delayDebounce);
  }, [query]);

  const handleSelect = (opt: ProductItem) => {
    onChange(opt);
    setQuery(opt.name);
    setShowDropdown(false);
  };

  const handleClear = () => {
    setQuery('');
    setShowDropdown(false);
    onChange(null);
  };

  return (
    <div className="w-full my-2 relative">
      <div className="flex justify-between items-center mb-1">
        <Label label={label} />
      </div>

      <div className="flex items-center gap-2 relative">
        <div className="w-full relative">
          <input
            name={name}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setShowDropdown(true);
            }}
            onFocus={() => setShowDropdown(true)}
            className={`h-9 px-4 pr-10 py-2 border w-full rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
              errors?.[name] ? 'border-red-500' : 'border-gray-300'
            } ${className}`}
            placeholder={helperText}
            autoComplete="off"
          />

          {query && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-800"
            >
              <AiOutlineClose size={18} />
            </button>
          )}

          {showDropdown && (
            <ul className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-48 overflow-auto">
              {isLoading && (
                <li className="px-4 py-2 text-gray-500 italic">Cargando...</li>
              )}
              {!isLoading && productos.products.length === 0 && query && (
                <li className="px-4 py-2 text-gray-500 italic">Sin resultados</li>
              )}
              {!isLoading &&
                productos.products.map((opt) => (
                  <li
                    key={opt._id}
                    onClick={() => handleSelect(opt)}
                    className="px-4 py-2 cursor-pointer hover:bg-indigo-100"
                  >
                    {opt.name}
                  </li>
                ))}
            </ul>
          )}

          {errors?.[name] && (
            <p className="text-sm text-red-600 flex items-center mt-1">
              <AiOutlineExclamationCircle size={16} className="mr-2" />
              {errors[name]}
            </p>
          )}
        </div>

        <div className="shrink-0">{buttonAction}</div>
      </div>
    </div>
  );
};
