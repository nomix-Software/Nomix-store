import type { Metadata } from "next";
import { ReactNode } from "react";
import "./globals.css";
import Head from "next/head";
import { Footer, Navbar } from "@/components";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "Cye Tech",
  description: "Artículos tecnológicos",
};

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <html>
      <body>
        <div className="layout">
          <Head>
            <title>CyE Tech</title>
          </Head>
          <header>
            <Navbar />
          </header>
          <main className="main-container">{children}</main>
          <footer>
            <Footer />
          </footer>
        </div>
        <Toaster position="top-right" reverseOrder={false} />
      </body>
    </html>
  );
};

export default Layout;
