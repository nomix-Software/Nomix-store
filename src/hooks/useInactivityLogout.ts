'use client'
import { useEffect, useRef } from "react";
import { signOut } from "next-auth/react";

const INACTIVITY_LIMIT = 15 * 60 * 1000; // 15 minutos en milisegundos

export function useInactivityLogout() {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const resetTimer = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(() => {
      signOut({ callbackUrl: "/auth" }); // Redirige al login
    }, INACTIVITY_LIMIT);
  };

  useEffect(() => {
    const events = ["mousemove", "keydown", "mousedown", "scroll", "touchstart"];

    events.forEach((event) => window.addEventListener(event, resetTimer));
    resetTimer(); // Inicia el timer

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      events.forEach((event) => window.removeEventListener(event, resetTimer));
    };
  }, []);
}
