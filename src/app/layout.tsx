import type { Metadata } from "next";
import { ReactNode, Suspense } from "react";
import "./globals.css";
import { ClientWrapper, Footer } from "@/components";
import { Toaster } from "react-hot-toast";
import { AuthSessionProvider } from "@/components/SessionProvider";
import Script from "next/script";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "Cye Tech",
  description: "Artículos tecnológicos",
  icons:{
    icon: '/favicon.ico'
  }
};

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <html lang="es">
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
        <link rel="icon" href="/favicon.ico" type="image/x-icon" />
        <meta name="google-site-verification" content="iN8BjG0udt6TIsq5Jv2WQJrcSVkUowaMxRg9Au5yJ2Y" />
        <meta name="keywords" content="ecommerce, tecnologia, auriculares, parlantes, cargadores, tablets, comprar online, ofertas"/>
      </head>
      <body>
        <Script
          src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`}
          strategy="beforeInteractive"
        />
        <AuthSessionProvider>
          <Suspense fallback={<div>Cargando...</div>}>
            <ClientWrapper />
          </Suspense>
          <div className="min-h-screen flex flex-col !mt-16">
            <header>
              <Navbar />
            </header>
            <main className="flex-1 !mt-20">{children}</main>
            <footer>
              <Footer />
            </footer>
          </div>
          <Toaster position="top-right" reverseOrder={false} />
        </AuthSessionProvider>
      </body>
    </html>
  );
};

export default Layout;
