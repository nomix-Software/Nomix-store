"use client";

import { useState } from "react";

type Props = {
  title: string;
  items: { label: string; count: number }[];
  onSelect?: (label: string) => void; // opcional
  openDefault?: boolean; // opcional, para controlar el estado inicial
};

export function CollapsibleFilterList({ title, items, onSelect, openDefault }: Props) {
  const [open, setOpen] = useState(openDefault || false);

  return (
    <div className="!mb-1 !bg-white !rounded-2xl !shadow-sm !border !border-gray-100 !w-full min-w-[220px]">
      <button
        type="button"
        className="!w-full !flex !justify-between !items-center !px-5 !py-3 !font-semibold !text-gray-800 !text-base focus:!outline-none focus:!ring-2 focus:!ring-[#f02d34]/20 !rounded-2xl !transition-colors !duration-200 hover:!bg-gray-50"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        style={{ minWidth: 220 }}
      >
        <span>{title}</span>
        <span className="!text-xl !select-none !text-gray-400">{open ? "−" : "+"}</span>
      </button>

      <div style={{ minWidth: 220 }}>
        {open && (
          <ul className="!px-6 !pb-3 !pt-1 !space-y-1">
            {items.map(({ label, count }, index) => (
              <li
                key={`${label}-${index}`}
                onClick={() => onSelect?.(label)}
                className="!flex !justify-between !items-center !cursor-pointer !text-[15px] !text-gray-700 !rounded-lg !px-2 !py-1 hover:!bg-[#f02d34]/10 hover:!text-[#f02d34]"
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
