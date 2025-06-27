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
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="Artículos tecnológicos, lo mejor en tecnología, CyE Tech" />
        <meta name="author" content="CyE Tech" />
        <meta property="og:title" content="CyE Tech" />
        <meta property="og:description" content="Artículos tecnológicos, lo mejor en tecnología, CyE Tech" />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content="es_AR" />
        <meta name="theme-color" content="#f02d34" />
        <link rel="icon" href="/favicon.ico" />
        <meta name="google-site-verification" content="iN8BjG0udt6TIsq5Jv2WQJrcSVkUowaMxRg9Au5yJ2Y" />
      </head>
      <AuthSessionProvider>
         <ClientWrapper />
        <body>
          <div className="min-h-screen flex flex-col !mt-16">
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
