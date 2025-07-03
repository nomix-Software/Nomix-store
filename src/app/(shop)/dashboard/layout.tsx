import type { Metadata } from "next";
import { ReactNode } from "react";

import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import Script from "next/script";

export const metadata: Metadata = {
  title: "Cye Tech",
  description: "Administración de productos y ventas",
};

const Layout = async ({ children }: { children: ReactNode }) => {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/auth/login");
  if(session.user.role !== 'ADMIN') redirect('/')
  return <>
    <Script
      src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`}
      strategy="beforeInteractive"
    />
    {children}
  </>;
};

export default Layout;
