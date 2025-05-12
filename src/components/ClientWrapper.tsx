"use client";

import { useFavorites } from "@/hooks";
import { useInactivityLogout } from "@/hooks/useInactivityLogout";
// import { useSession } from "next-auth/react";

export const ClientWrapper = () => {
     useFavorites()
  useInactivityLogout();
  return null; // No renderiza nada, solo aplica el hook
};
