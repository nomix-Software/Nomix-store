"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { FaSearch, FaTimes } from "react-icons/fa";

interface Props {
  defaultValue?: string;
}

export default function SearchBar({ defaultValue = "" }: Props) {
  const [input, setInput] = useState(defaultValue);
  const router = useRouter();
  const searchParams = useSearchParams();

  const updateQuery = (key: string, value?: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`/catalogo?${params.toString()}`);
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
      className="hidden md:flex justify-end m-2 h-fit"
    >
      <div className="flex flex-row items-center gap-2 border-b border-gray-400 focus-within:border-[#f02d34] py-2 px-1">
        <button
          type="submit"
          className="text-gray-500 cursor-pointer hover:text-gray-700 transition-transform duration-200 transform hover:scale-110 px-1"
        >
          <FaSearch size={18} />
        </button>
        <input
          type="text"
          placeholder="Nombre de producto"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="outline-none px-2 py-1.5 bg-transparent w-full border-none focus:ring-0"
        />
        {input.length > 0 && (
          <button
            type="button"
            onClick={clearSearch}
            className="text-gray-400 hover:text-red-500 px-1 cursor-pointer"
            title="Limpiar búsqueda"
          >
            <FaTimes size={18} />
          </button>
        )}
      </div>
    </form>
  );
}
