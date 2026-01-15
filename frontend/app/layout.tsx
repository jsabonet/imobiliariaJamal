import type { Metadata, Viewport } from "next";
import "./globals.css";
import PWARegister from "@/components/PWARegister";
import InstallPWA from "@/components/InstallPWA";

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
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "IJPS",
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    siteName: "IJPS - Imobiliária Jamal",
    title: "IJPS - Imobiliária Jamal & Prestação de Serviços",
    description: "Encontre o imóvel dos seus sonhos em Moçambique",
  },
  twitter: {
    card: "summary",
    title: "IJPS - Imobiliária Jamal",
    description: "Encontre o imóvel dos seus sonhos em Moçambique",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: "#C8552B",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt">
      <head>
        <link rel="apple-touch-icon" href="/logo.png" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="IJPS" />
      </head>
      <body className="antialiased">
        <PWARegister />
        <InstallPWA />
        {children}
      </body>
    </html>
  );
}
