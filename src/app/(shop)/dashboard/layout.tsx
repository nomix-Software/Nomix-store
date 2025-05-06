import type { Metadata } from "next";
import { ReactNode } from "react";

import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Cye Tech",
  description: "Administración de productos y ventas",
};

const Layout = async ({ children }: { children: ReactNode }) => {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/auth");
  if(session.user.role !== 'ADMIN') redirect('/')
  return <>{children}</>;
};

export default Layout;
