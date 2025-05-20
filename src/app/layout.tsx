import type { Metadata } from "next";
import { ReactNode } from "react";
import "./globals.css";
import Head from "next/head";
import { ClientWrapper, Footer, Navbar } from "@/components";
import { Toaster } from "react-hot-toast";
import { AuthSessionProvider } from "@/components/SessionProvider";

export const metadata: Metadata = {
  title: "Cye Tech",
  description: "Artículos tecnológicos",
};

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <html>
      <AuthSessionProvider>
         <ClientWrapper />
        <body>
          <div className="min-h-screen flex flex-col !mt-20">
            <Head>
              <title>CyE Tech</title>
            </Head>
            <header>
              <Navbar />
            </header>
            <main className="flex-1 ">{children}</main>
            <footer>
              <Footer />
            </footer>
          </div>
          <Toaster position="top-right" reverseOrder={false} />
        </body>
      </AuthSessionProvider>
    </html>
  );
};

export default Layout;
