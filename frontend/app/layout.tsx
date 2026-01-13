import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "IJPS - Imobiliária Jamal & Prestação de Serviços",
  description: "Encontre o imóvel dos seus sonhos em Moçambique. Compra, venda, arrendamento e avaliação de propriedades.",
  keywords: ["imobiliária", "moçambique", "maputo", "propriedades", "casas", "apartamentos", "arrendamento"],
  authors: [{ name: "Zawadi Digital" }],
  manifest: "/manifest.json",
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#C8552B",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
