"use client";
import { useState } from "react";
import {
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
import { signOut } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import Avatar from "./ui/Avatar";
import { FiHelpCircle } from "react-icons/fi";
import { adminCouponOption } from "./adminCouponOption";

interface SidebarProps {
  role: "ADMIN" | "CLIENTE" | 'GUEST';
  email?: string;
  mobile?: boolean;
  onCategorySelect?: (label: string) => void;
  showCartIcon?: boolean;
  cartItems?: number;
  onCartClick?: () => void;
}

export const Sidebar = ({ role, email}: SidebarProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();


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
    role === "ADMIN"
      ? adminOptions
      : role === "CLIENTE"
      ? clientOptions
      : guestOptions;

  const getTextButton = () => {
    if (role !== 'GUEST') return "Cerrar sesión";
    else return "Iniciar Sesión";
  };

  return (
    <>
      <button
        className="!cursor-pointer text-2xl text-[#324d67] hover:text-gray-400 transition-colors duration-300"
        onClick={() => setIsOpen(true)}
      >
        <Avatar email={email} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              className="fixed top-0 right-0 w-64 max-h-screen bg-white/75 shadow-lg z-50 !p-4 flex flex-col gap-4 overflow-y-auto"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", ease: "circOut", duration: 0.3 }}
            >
              <div className="flex flex-col gap-4">
                <h2 className="text-xl font-semibold !mb-4 text-[#324d67] text-center border-b-1 !p-1">
                  {role !== 'GUEST' ? '¡Hola de nuevo!' : 'Menu'}
                </h2>
                {email && (
                  <div className="!mb-2 flex flex-col items-center">
                    <Avatar email={email} size="large" />
                    <span className="text-xs text-[#324d67] mt-1 break-all text-center">{email}</span>
                    <hr className="!h-[1px] !mt-2 w-full" />
                  </div>
                )}
                {/* Mobile: búsqueda, categorías y carrito */}
                {/* CollapsibleFilterList y carrito eliminados del sidebar mobile */}
                <ul className="flex flex-col gap-3">
                  {options
                    .filter(({ label }) => !["Catálogo", "Ofertas", "Ayuda", "Perfil"].includes(label))
                    .map(({ label, href, icon: Icon }) => (
                      <Link
                        key={href}
                        href={href}
                        onClick={() => setIsOpen(false)}
                        className="flex items-center gap-2 !p-2 hover:bg-gray-300 rounded"
                      >
                        <Icon size={20} color="#324d67" />
                        <span>{label}</span>
                      </Link>
                    ))}
                </ul>
              </div>
              <button
                onClick={async () => {
                  if (role !== 'GUEST') {
                    signOut({ callbackUrl: "/" });
                  } else {
                    setIsOpen(false);
                    router.push(
                      `/auth/login?redirect_uri=${encodeURIComponent(pathname)}`
                    );
                  }
                }}
                className="cursor-pointer text-sm text-gray-500 hover:!text-[#f02d34]"
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