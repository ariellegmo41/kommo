import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "IDEA Atende — CRM Conversacional",
  description: "Plataforma CRM omnichannel para transformar conversas em vendas",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="h-full">
      <body className="h-full bg-[#F5F7FB] text-[#111827] antialiased">{children}</body>
    </html>
  );
}
