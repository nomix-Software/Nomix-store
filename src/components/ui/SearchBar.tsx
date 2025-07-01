"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { FaSearch, FaTimes } from "react-icons/fa";

interface Props {
  defaultValue?: string;
}

export default function SearchBar({ defaultValue = "" }: Props) {
  const [input, setInput] = useState(defaultValue);
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  useEffect(() => {
    const search = searchParams.get("search") || "";
    setInput(search);
  }, [searchParams]);

  const updateQuery = (key: string, value?: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateQuery("search", input.trim() || undefined);
  };

  const clearSearch = () => {
    setInput("");
    updateQuery("search", undefined);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full"
    >
      <div className="relative mb-4">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none z-10">
          <FaSearch size={18} />
        </span>
        <input
          type="text"
          placeholder="Buscar productos..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="transition-all duration-200 shadow-sm bg-white border border-gray-200 focus:border-[#f02d34] focus:ring-2 focus:ring-[#f02d34]/20 rounded-full h-12 pl-12 pr-12 text-base text-gray-800 placeholder-gray-400 outline-none w-full"
          autoComplete="off"
          style={{ paddingLeft: 44 }} // 44px para dejar espacio al icono
        />
        {(input.length > 0 || searchParams.get('search')) && (
          <button
            type="button"
            onClick={clearSearch}
            className="cursor-pointer absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 hover:text-red-500 focus:text-red-500 transition-colors duration-200 z-10"
            title="Limpiar búsqueda"
            tabIndex={-1}
          >
            <FaTimes size={20} />
          </button>
        )}
      </div>
    </form>
  );
}
