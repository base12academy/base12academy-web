import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import AdMeasurementConsent from "@/components/AdMeasurementConsent";
import MatematicasIICatalogRedirect from "@/components/MatematicasIICatalogRedirect";
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
  metadataBase: new URL("https://base12academy.es"),
  title: {
    default: "Oposiciones y Bachillerato online | Base12 Academy",
    template: "%s | Base12 Academy",
  },
  description:
    "Academia online para preparar oposiciones, Tropa y Marinería y Bachillerato y PAU. Clases de Historia y Filosofía, materiales, test y acompañamiento.",
  applicationName: "Base12 Academy",
  manifest: "/manifest.webmanifest",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "es_ES",
    url: "/",
    siteName: "Base12 Academy",
    title: "Oposiciones, Tropa y Marinería y PAU online · Base12 Academy",
    description:
      "Formación online para preparar oposiciones, Tropa y Marinería y Bachillerato y PAU.",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Base12 Academy · Construye · Comprende · Domina",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Oposiciones, Tropa y Marinería y PAU online · Base12 Academy",
    description:
      "Formación online para preparar oposiciones, Tropa y Marinería y Bachillerato y PAU.",
    images: ["/twitter-image"],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Base12",
  },
  icons: {
    icon: [
      { url: "/icons/base12-192.png?v=2", sizes: "192x192", type: "image/png" },
      { url: "/icons/base12-512.png?v=2", sizes: "512x512", type: "image/png" },
    ],
    shortcut: [
      { url: "/icons/base12-192.png?v=2", type: "image/png" },
    ],
    apple: [
      { url: "/icons/apple-touch-icon.png?v=2", sizes: "180x180", type: "image/png" },
    ],
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
        <MatematicasIICatalogRedirect />
        <AdMeasurementConsent />
      </body>
    </html>
  );
}
