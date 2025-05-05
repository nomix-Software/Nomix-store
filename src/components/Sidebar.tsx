"use client";
import { useState } from "react";
import { FaBars, FaBoxOpen, FaChartLine } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { MdAttachMoney, MdInventory } from "react-icons/md";
import Link from "next/link";
import { CgProfile } from "react-icons/cg";
import { useSession } from "next-auth/react";

interface SidebarProps {
  role: "ADMIN" | "CLIENTE";
  isAuthenticated: boolean;
}

export const Sidebar = ({ role, isAuthenticated }: SidebarProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { data } = useSession();
  console.log("Session data:", data); // Verifica si la sesión está disponible

  if (!isAuthenticated) return null;

  const adminOptions = [
    {
      label: "Gestionar productos",
      href: "/dashboard/products",
      icon: MdInventory, // 🗃️ ícono de inventario
    },
    {
      label: "Finanzas",
      href: "/dashboard/finanzas",
      icon: MdAttachMoney, // 💰 ícono de finanzas
    },
    { label: "Gestionar ventas", href: "/dashboard/ventas", icon: FaChartLine },
  ];

  const clientOptions = [
    {
      label: "Mis pedidos",
      href: "/cliente/pedidos",
      icon: FaBoxOpen, // 📦 ícono de pedidos
    },
    {
      label: "Perfil",
      href: "/cliente/perfil",
      icon: CgProfile, // 👤 ícono de perfil
    },
  ];

  const options =
    data?.user.email === "admin@admin.com" ? adminOptions : clientOptions;

  return (
    <>
      <button
        className=" cursor-pointer fixed top-4 right-4 z-50 text-3xl text-red-500 hover:text-red-700 transition-colors duration-300"
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
              className="fixed top-0 right-0 w-64 h-full bg-white shadow-lg z-50 !p-4 flex flex-col gap-4 justify-between"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <div className="flex flex-col gap-4">
                <h2 className="text-xl font-semibold mb-4 text-[#324d67] text-center">
                  Menú
                </h2>
                <ul className="flex flex-col gap-3">
                  {options.map(({ label, href, icon: Icon }) => (
                    <Link
                      key={href}
                      href={href}
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded"
                    >
                      <Icon size={20} color="#324d67" />
                      <span>{label}</span>
                    </Link>
                  ))}
                </ul>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                className="cursor-pointer mt-auto text-sm text-gray-500 hover:text-gray-700"
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
