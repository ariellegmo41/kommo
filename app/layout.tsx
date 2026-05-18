import type { Metadata, Viewport } from "next";
import "./globals.css";
import Script from "next/script";

export const metadata: Metadata = {
  title: "IDEA Atende — CRM Conversacional",
  description: "Plataforma CRM omnichannel para transformar conversas em vendas",
  manifest: "/manifest.json",
  appleWebApp: { capable: true, statusBarStyle: "default", title: "IDEA Atende" },
  other: { "mobile-web-app-capable": "yes" },
};

export const viewport: Viewport = {
  themeColor: "#6C3BFF",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" className="h-full">
      <head>
        <link rel="apple-touch-icon" href="/icon-192.png" />
      </head>
      <body className="h-full bg-[#F5F7FB] text-[#111827] antialiased">
        {children}
        <Script id="sw-register" strategy="afterInteractive">{`
          if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/sw.js').catch(console.error);
          }
        `}</Script>
      </body>
    </html>
  );
}
