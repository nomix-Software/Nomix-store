"use client";

import { Suspense, useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { FaSearch, FaTimes } from "react-icons/fa";
import clsx from "clsx";

interface Props {
  defaultValue?: string;
  size?: "small" | "medium";
  path?: string;
}

const SearchBarContent = ({ defaultValue = "", size = "medium", path }: Props) => {
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
    const baseurl = path ? path : pathname;
    console.log({ pathname });
    router.push(`${baseurl}?${params.toString()}`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateQuery("search", input.trim() || undefined);
  };

  const clearSearch = () => {
    setInput("");
    updateQuery("search", undefined);
  };

  const sizeStyles = {
    small: {
      container: "mb-0",
      input: "h-10 !pl-12 !pr-10 !text-sm",
      searchIcon: "left-3",
      searchIconSize: 16,
      clearIcon: "right-3",
      clearIconSize: 18,
    },
    medium: {
      container: "mb-4",
      input: "h-12 !pl-12 !pr-12 !text-base",
      searchIcon: "left-4",
      searchIconSize: 18,
      clearIcon: "right-4",
      clearIconSize: 20,
    },
  };

  const styles = sizeStyles[size];

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className={clsx("relative", styles.container)}>
        <span
          className={clsx(
            "absolute top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none z-10",
            styles.searchIcon
          )}
        >
          <FaSearch size={styles.searchIconSize} />
        </span>
        <input
          type="text"
          placeholder="Buscar productos..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className={clsx(
            "transition-all duration-200 shadow-sm bg-white border border-gray-200 focus:border-[#f02d34] focus:ring-2 focus:ring-[#f02d34]/20 rounded-full text-gray-800 placeholder-gray-400 outline-none w-full",
            styles.input
          )}
          autoComplete="off"
        />
        {(input.length > 0 || searchParams.get("search")) && (
          <button
            type="button"
            onClick={clearSearch}
            className={clsx(
              "cursor-pointer absolute top-1/2 -translate-y-1/2 text-gray-300 hover:text-red-500 focus:text-red-500 transition-colors duration-200 z-10",
              styles.clearIcon
            )}
            title="Limpiar búsqueda"
            tabIndex={-1}
          >
            <FaTimes size={styles.clearIconSize} />
          </button>
        )}
      </div>
    </form>
  );
};

export default function SearchBar(props: Props) {
  return (
    <Suspense fallback={<div />}>
      <SearchBarContent {...props} />
    </Suspense>
  );
}
