"use client";

import { useInactivityLogout } from "@/hooks/useInactivityLogout";

export const ClientWrapper = () => {
  useInactivityLogout();
  return null; // No renderiza nada, solo aplica el hook
};
