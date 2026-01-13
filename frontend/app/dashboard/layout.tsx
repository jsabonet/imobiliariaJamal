import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard Administrativo - IJPS",
  description: "Painel administrativo da IJPS Imobiliária",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
