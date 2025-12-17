import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "IJPS - Imobiliária Jamal & Prestação de Serviços",
  description: "Encontre o imóvel dos seus sonhos em Moçambique. Compra, venda, arrendamento e avaliação de propriedades.",
  keywords: ["imobiliária", "moçambique", "maputo", "propriedades", "casas", "apartamentos", "arrendamento"],
  authors: [{ name: "Zawadi Digital" }],
  viewport: "width=device-width, initial-scale=1, maximum-scale=5",
  themeColor: "#C8552B",
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt">
      <body className="antialiased">
        <Navbar />
        <main className="min-h-screen">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
