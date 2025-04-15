"use client";
import { useState } from "react";
import { FaBars } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

interface SidebarProps {
  role: "admin" | "cliente";
  isAuthenticated: boolean;
}

export const Sidebar = ({ role, isAuthenticated }: SidebarProps) => {
  const [isOpen, setIsOpen] = useState(false);

  if (!isAuthenticated) return null;

  const adminOptions = [
    { label: "Dashboard", href: "/admin/dashboard" },
    { label: "Gestionar productos", href: "/admin/products" },
    { label: "Finanzas", href: "/admin/finanzas" },
  ];

  const clientOptions = [
    { label: "Mis pedidos", href: "/cliente/pedidos" },
    { label: "Perfil", href: "/cliente/perfil" },
  ];

  const options = role === "admin" ? adminOptions : clientOptions;

  return (
    <>
      <button
        className=" cursor-pointer fixed top-4 right-4 z-50 text-3xl text-purple-600"
        onClick={() => setIsOpen(true)}
      >
        <FaBars />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Fondo empañado */}
            <motion.div
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
            />

            {/* Sidebar */}
            <motion.div
              className="fixed top-0 right-0 w-64 h-full bg-white shadow-lg z-50 p-6 flex flex-col gap-4"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <h2 className="text-xl font-semibold text-purple-600 mb-4">
                Menú
              </h2>
              <ul className="flex flex-col gap-3">
                {options.map((item) => (
                  <li key={item.href}>
                    <a
                      href={item.href}
                      className="text-gray-800 hover:text-purple-600 transition-colors"
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => setIsOpen(false)}
                className="mt-auto text-sm text-gray-500 hover:text-gray-700"
              >
                Cerrar menú
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
