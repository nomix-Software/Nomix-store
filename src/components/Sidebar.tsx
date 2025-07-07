"use client";
import { useState } from "react";
import {
  FaBars,
  FaBoxOpen,
  FaChartLine,
  FaClipboardCheck,
  FaHeart,
  FaShoppingBag,
  FaTags,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { MdAttachMoney, MdInventory } from "react-icons/md";
import Link from "next/link";
import { CgProfile } from "react-icons/cg";
import { signOut, useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import Avatar from "./ui/Avatar";
import { FiHelpCircle } from "react-icons/fi";
import { adminCouponOption } from "./adminCouponOption";

interface SidebarProps {
  role: "ADMIN" | "CLIENTE";
  isAuthenticated: boolean;
}

export const Sidebar = ({ isAuthenticated }: SidebarProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const { data } = useSession();

  if (!isAuthenticated) return null;

  const adminOptions = [
    {
      label: "Catálogo",
      href: "/catalogo",
      icon: FaShoppingBag, // 🛍️ ícono de catálogo
    },
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
    {
      label: "Pedidos",
      href: "/dashboard/pedidos",
      icon: FaClipboardCheck, // ✅ ícono de pedidos / entrega
    },
    adminCouponOption, // Nuevo ítem para cupones
  ];

  const clientOptions = [
    {
      label: "Perfil",
      href: "/cliente/perfil",
      icon: CgProfile, // 👤 ícono de perfil
    },
    {
      label: "Mis pedidos",
      href: "/mis-pedidos",
      icon: FaBoxOpen, // 📦 ícono de pedidos
    },
    {
      label: "Catálogo",
      href: "/catalogo",
      icon: FaShoppingBag, // 🛍️ ícono de catálogo
    },
    {
      label: "Mis favoritos",
      href: "/mis-favoritos",
      icon: FaHeart, // ❤️ ícono de favoritos
    },
  ];
  const guestOptions = [
    {
      label: "Catálogo",
      href: "/catalogo",
      icon: FaShoppingBag, // 🛍️ ícono de catálogo
    },
    {
      label: "Ofertas",
      href: "/ofertas",
      icon: FaTags, // 🏷️ ícono de ofertas
    },
    {
      label: "Ayuda",
      href: "/ayuda",
      icon: FiHelpCircle, // ❓ ícono de ayuda
    },
    // {
    //   label: "Iniciar sesión",
    //   href: "/login",
    //   icon: FaSignInAlt, // 🔐 ícono de login
    // },
  ];

  const options =
    data?.user.role === "ADMIN"
      ? adminOptions
      : data?.user.role === "CLIENTE"
      ? clientOptions
      : guestOptions;

  const getTextButton = () => {
    if (data?.user) return "Cerrar sesión";
    else return "Iniciar Sesión";
  };

  return (
    <>
      <button
        className=" cursor-pointer  text-3xl text-red-500 hover:text-red-700 transition-colors duration-300"
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
                <h2 className="text-xl font-semibold !mb-4 text-[#324d67] text-center">
                  ¡Hola de nuevo!
                </h2>
                {data?.user.email && (
                  <div className="!mb-2">
                    <Avatar email={data?.user.email} />
                    <br />
                    <hr className="!h-[1px]" />
                  </div>
                )}
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
                onClick={async () => {
                  if (data?.user) {
                    signOut({ callbackUrl: "/" });
                  } else {
                    setIsOpen(false);
                    router.push(
                      `/auth/login?redirect_uri=${encodeURIComponent(pathname)}`
                    );
                  }
                }}
                className="cursor-pointer mt-auto text-sm text-gray-500 hover:text-gray-700"
              >
                {getTextButton()}
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
