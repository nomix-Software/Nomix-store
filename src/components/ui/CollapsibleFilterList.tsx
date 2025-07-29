"use client";

import { useState } from "react";
import clsx from "clsx";

type Props = {
  title: string;
  items: { label: string; count: number }[];
  onSelect?: (label: string) => void;
  openDefault?: boolean;
  size?: "small" | "medium"; // 'small' para una versión compacta, 'medium' para la normal
  changeClose?:boolean
};

export function CollapsibleFilterList({
  title,
  items,
  onSelect,
  openDefault,
  changeClose,
  size = "medium", // Por defecto 'small' para el Navbar
}: Props) {
  const [open, setOpen] = useState(openDefault || false);

  // Definición de clases para los tamaños
  const sizeStyles = {
    small: {
      container: "min-w-0",
      button: "!px-3 !py-2 !text-sm",
      icon: "!text-base",
      list: "!px-4 !pb-2",
      listItem: "!text-sm !py-1",
    },
    medium: {
      container: "min-w-[220px]",
      button: "!px-5 !py-3 !text-base",
      icon: "!text-xl",
      list: "!px-6 !pb-3",
      listItem: "!text-[15px] !py-1",
    },
  };

  const styles = sizeStyles[size];

  return (
    <div className={clsx("!mb-1 !bg-white !rounded-2xl !shadow-sm !border !border-gray-100 !w-full", styles.container)}>
      <button
        type="button"
        className={clsx(
          "!w-full !flex !justify-between !items-center !font-semibold !text-gray-800 focus:!outline-none focus:!ring-2 focus:!ring-[#f02d34]/20 !rounded-2xl !transition-colors !duration-200 hover:!bg-gray-50",
          styles.button
        )}
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
      >
        <span>{title}</span>
        <span className={clsx("!select-none !text-gray-400", styles.icon)}>
          {open ? "−" : "+"}
        </span>
      </button>

      <div style={{ minWidth: 220 }}>
      {open && (
        <ul className={clsx("!pt-1 !space-y-1", styles.list)}>
          {items.map(({ label, count }, index) => (
            <li
              key={`${label}-${index}`}
              onClick={() => {onSelect?.(label); changeClose ? setOpen(false): null}}
              className={clsx(
                "!flex !justify-between !items-center !cursor-pointer !text-gray-700 !rounded-lg !px-2 hover:!bg-[#f02d34]/10 hover:!text-[#f02d34]",
                styles.listItem
              )}
            >
              <span>{label}</span>
              <span className="!ml-2 !text-xs !text-gray-500 !font-semibold">{count}</span>
            </li>
          ))}
        </ul>
      )}
      </div>
    </div>
  );
}
