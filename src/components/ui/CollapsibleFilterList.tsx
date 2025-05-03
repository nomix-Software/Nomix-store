"use client";

import { useState } from "react";

type Props = {
  title: string;
  items: { label: string; count: number }[];
  onSelect?: (label: string) => void; // opcional
};

export function CollapsibleFilterList({ title, items, onSelect }: Props) {
  const [open, setOpen] = useState(true);

  return (
    <div>
      <li
        className="font-semibold !m-2 cursor-pointer flex justify-between items-center"
        onClick={() => setOpen((prev) => !prev)}
      >
        <span>{title}</span>
        <span>{open ? "−" : "+"}</span>
      </li>

      {open && (
        <li>
          <ul className="!pl-6">
            {items.map(({ label, count }, index) => (
              <li
                key={`${label}-${index}`}
                onClick={() => onSelect?.(label)}
                className="hover:underline cursor-pointer text-[14px]"
              >
                {label} ({count})
              </li>
            ))}
          </ul>
        </li>
      )}
    </div>
  );
}
