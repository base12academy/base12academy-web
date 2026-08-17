import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Base12 Academy",
  description: "Formación online de Base12 Academy.",
  manifest: "/manifest.webmanifest",
  applicationName: "Base12 Academy",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Base12",
  },
  icons: {
    icon: "/icons/base12-192.png",
    apple: "/icons/base12-192.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
