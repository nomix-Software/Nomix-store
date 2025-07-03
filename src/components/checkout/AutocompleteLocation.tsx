'use client';

import React, { useState, useRef } from 'react';
import { AiOutlineExclamationCircle, AiOutlineClose } from 'react-icons/ai';
import { Label } from '../ui/Label';
import usePlacesAutocomplete, { getGeocode, getLatLng } from 'use-places-autocomplete';
import toast from 'react-hot-toast';

export interface AutocompleteLocationProps {
  name: string;
  value?: string;
  onChange: (value: { address: string; lat?: number; lng?: number; ciudad?: string; provincia?: string; codigoPostal?: string; pais?: string } | null) => void;
  label?: string;
  errors?: { [key: string]: string };
  helperText?: string;
  className?: string;
}

export const AutocompleteLocation: React.FC<AutocompleteLocationProps> = ({
  name,
  value = '',
  onChange,
  label,
  errors,
  helperText,
  className = '',
}) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Bounds de Córdoba Capital solo si google.maps está disponible
  const cordobaBounds = React.useMemo(() => {
    if (typeof window !== 'undefined' && window.google && window.google.maps) {
      return new window.google.maps.LatLngBounds(
        new window.google.maps.LatLng(-31.5206, -64.3252),
        new window.google.maps.LatLng(-31.3155, -64.0817)
      );
    }
    return undefined;
  }, []);

  const {
    ready,
    value: inputValue,
    setValue,
    suggestions: { status, data },
    clearSuggestions,
  } = usePlacesAutocomplete({
    debounce: 350,
    requestOptions: {
      componentRestrictions: { country: 'ar' },
      ...(cordobaBounds ? { bounds: cordobaBounds } : {}),
    },
    defaultValue: value,
  });

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
    setShowDropdown(true);
    onChange(null);
  };

  const handleSelect = async (address: string) => {
    setValue(address, false);
    setShowDropdown(false);
    clearSuggestions();
    let lat, lng, ciudad, provincia, codigoPostal, pais;
    let isCordobaCapital = false;
    try {
      const results = await getGeocode({ address });
      const { lat: latR, lng: lngR } = await getLatLng(results[0]);
      lat = latR;
      lng = lngR;
      // Extraer componentes de dirección
      const components = results[0]?.address_components || [];
      for (const comp of components) {
        if (comp.types.includes('locality')) ciudad = comp.long_name;
        if (comp.types.includes('administrative_area_level_1')) provincia = comp.long_name;
        if (comp.types.includes('postal_code')) codigoPostal = comp.long_name;
        if (comp.types.includes('country')) pais = comp.long_name;
      }
      // Validar Córdoba Capital
      isCordobaCapital = Boolean(ciudad && provincia && ciudad.toLowerCase() === 'córdoba' && provincia.toLowerCase().includes('córdoba'));
    } catch {
      lat = undefined;
      lng = undefined;
      ciudad = provincia = codigoPostal = pais = undefined;
    }
    if (!isCordobaCapital) {
      onChange(null);
      setTimeout(() => {
        if (inputRef.current) inputRef.current.focus();
      }, 100);
      toast.error('Solo se permiten direcciones de Córdoba Capital');
      return;
    }
    onChange({ address, lat, lng, ciudad, provincia, codigoPostal, pais });
  };

  const handleClear = () => {
    setValue('');
    setShowDropdown(false);
    clearSuggestions();
    onChange(null);
    inputRef.current?.focus();
  };

  return (
    <div className="!w-full !my-2 !relative">
      <div className="!flex !justify-between !items-center !mb-1">
        <Label label={label} />
      </div>
      <div className="!flex !items-center !gap-2 !relative">
        <div className="!w-full !relative">
          <input
            ref={inputRef}
            name={name}
            value={inputValue}
            onChange={handleInput}
            onFocus={() => setShowDropdown(true)}
            className={`!h-12 !pl-4 !pr-12 !py-2 !border !w-full !rounded-full focus:!outline-none focus:!ring-2 focus:!ring-[#f02d34]/20 !shadow-sm !text-base !text-gray-800 !placeholder-gray-400 !bg-white !truncate ${
              errors?.[name] ? '!border-red-500' : '!border-gray-200'
            } ${className}`}
            placeholder={helperText || 'Buscar dirección...'}
            autoComplete="off"
            disabled={!ready}
            style={{ textOverflow: 'ellipsis' }}
          />
          {inputValue && (
            <button
              type="button"
              onClick={handleClear}
              className="!absolute !right-3 !top-1/2 -translate-y-1/2 !flex !items-center !justify-center !h-7 !w-7 !rounded-full !bg-white !text-gray-400 hover:!text-gray-800 !transition !p-0 border-none"
              tabIndex={-1}
              style={{ lineHeight: 0 }}
            >
              <AiOutlineClose size={18} />
            </button>
          )}
          {showDropdown && status === 'OK' && (
            <ul className="!absolute !z-10 !w-full !mt-1 !bg-white !border !border-gray-200 !rounded-2xl !shadow-lg !max-h-48 !overflow-auto">
              {data.map((suggestion) => (
                <li
                  key={suggestion.place_id}
                  onClick={() => {
                    if (typeof suggestion.description === 'string') {
                      handleSelect(suggestion.description);
                    }
                  }}
                  className="!px-4 !py-2 !cursor-pointer hover:!bg-[#f02d34]/10 !rounded-xl !transition"
                >
                  {suggestion.description}
                </li>
              ))}
            </ul>
          )}
          {errors?.[name] && (
            <p className="!text-sm !text-red-600 !flex !items-center !mt-1">
              <AiOutlineExclamationCircle size={16} className="!mr-2" />
              {errors[name]}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
