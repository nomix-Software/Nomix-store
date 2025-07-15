'use client';

import { useEffect, useRef } from 'react';
import { signOut } from 'next-auth/react';
import { usePathname } from 'next/navigation';

const INACTIVITY_LIMIT = 120 * 60 * 1000; // 15 minutos

// Rutas privadas en las que se debe cerrar sesión por inactividad
const protectedRoutes = ['/checkout', '/dashboard', '/dashboard/products', '/dashboard/ventas'];

export function useInactivityLogout() {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const pathname = usePathname();

  const resetTimer = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(() => {
      const isProtected = protectedRoutes.some((route) => pathname?.includes(route));
      if (isProtected) {
        signOut({ callbackUrl: '/auth/login' });
      }
    }, INACTIVITY_LIMIT);
  };

  useEffect(() => {
    const events = ['mousemove', 'keydown', 'mousedown', 'scroll', 'touchstart'];

    events.forEach((event) => window.addEventListener(event, resetTimer));
    resetTimer();

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      events.forEach((event) => window.removeEventListener(event, resetTimer));
    };
  }, [pathname]); // Se reinicia el efecto si cambia la ruta
}
