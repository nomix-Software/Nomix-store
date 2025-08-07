"use client";

import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import clsx from "clsx";

type Props = {
  title: string;
  items: { label: string; count: number }[];
  onSelect?: (label: string) => void;
  openDefault?: boolean;
  size?: "small" | "medium"; // 'small' para una versión compacta, 'medium' para la normal
  changeClose?: boolean;
  className?: string; // Permite personalización externa
  buttonClassName?: string; // Permite personalización del botón principal
  dropdownFixed?: boolean; // Si true, el dropdown se renderiza fixed/z-1000 (para mobile)
};

export function CollapsibleFilterList({
  title,
  items,
  onSelect,
  openDefault,
  changeClose,
  size = "medium", // Por defecto 'small' para el Navbar
  className,
  buttonClassName,
  dropdownFixed,
}: Props) {
  const [open, setOpen] = useState(openDefault || false);
  const ref = useRef<HTMLDivElement>(null);
  const [dropdownPos, setDropdownPos] = useState<{top: number, left: number, width: number} | null>(null);

  // Cerrar al hacer click fuera
  useEffect(() => {
    if (!open) return;
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  // Calcular posición del dropdown si es fixed
  useEffect(() => {
    if (open && dropdownFixed && ref.current) {
      const rect = ref.current.getBoundingClientRect();
      setDropdownPos({
        top: rect.bottom,
        left: rect.left,
        width: rect.width,
      });
    } else if (!open) {
      setDropdownPos(null);
    }
  }, [open, dropdownFixed]);

  // Definición de clases para los tamaños
  const sizeStyles = {
    small: {
      container: "!min-w-[110px] sm:!min-w-[113px] !w-auto !inline-block !m-0 align-middle",
      button: "!px-4 !py-1 !h-7.5 !text-sm !rounded-full !border !border-gray-300 cursor-pointer !bg-gray-50 hover:!bg-gray-200 !font-medium !transition-colors !flex !items-center !text-[#324d67]",
      icon: "!text-lg !ml-2",
      list: "!px-2 !pb-2 !mt-1 !rounded-xl !shadow-lg !border !border-gray-200 !bg-white !absolute !z-50",
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
    <div ref={ref} className={clsx(" !bg-white !rounded-2xl !shadow-sm !border !border-gray-100", styles.container, className)}>
      <button
        type="button"
        className={clsx(
          "!flex !justify-between !items-center !font-semibold !text-[#324d67] focus:!outline-none focus:!ring-2 focus:!ring-[#f02d34]/20 !transition-colors !duration-200 relative",
          styles.button,
          buttonClassName
        )}
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        style={{ width: '100%' }}
      >
        <span className="flex-1 text-left truncate">{title}</span>
        <span className={clsx("!select-none !text-gray-400 ml-auto pr-1", styles.icon)}>
          {open ? "−" : "+"}
        </span>
      </button>

      <div className={dropdownFixed ? undefined : "relative !z-50"}>
        {open && (
          dropdownFixed && dropdownPos && typeof window !== 'undefined' && document.body
            ? createPortal(
                <ul
                  className={clsx("!pt-1 !space-y-1", styles.list)}
                  style={{
                    position: 'fixed',
                    top: dropdownPos.top,
                    left: dropdownPos.left,
                    width: dropdownPos.width,
                    zIndex: 2000,
                    background: 'rgba(255,255,255,0.98)',
                    borderRadius: '1rem',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
                  }}
                >
                  {items.map(({ label, count }, index) => (
                    <li
                      key={`${label}-${index}`}
                      onClick={() => {
                        onSelect?.(label);
                        if (changeClose) {
                          setOpen(false);
                        }
                      }}
                      className={clsx(
                        "!flex !justify-between !items-center !cursor-pointer !text-gray-700 !rounded-lg !px-2 hover:!bg-[#f02d34]/10 hover:!text-[#f02d34]",
                        styles.listItem
                      )}
                    >
                      <span>{label}</span>
                      <span className="!ml-2 !text-xs !text-gray-500 !font-semibold">{count}</span>
                    </li>
                  ))}
                </ul>,
                document.body
              )
            : (
                <ul
                  className={clsx("!pt-1 !space-y-1", styles.list)}
                >
                  {items.map(({ label, count }, index) => (
                    <li
                      key={`${label}-${index}`}
                      onClick={() => {
                        onSelect?.(label);
                        if (changeClose) {
                          setOpen(false);
                        }
                      }}
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
              )
        )}
      </div>
    </div>
  );
}
