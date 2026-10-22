import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Specter & Asociados | Firma Legal Colombia",
  description: "Plataforma SaaS de gestión jurídica para despachos de abogados",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className="h-full antialiased font-sans">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
