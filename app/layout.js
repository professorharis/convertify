import { Analytics } from '@vercel/analytics/react';
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

export const metadata = {
  title: "Convertify - Free Online File Converter (Images & Documents)",
  description:
    "Convert between 19+ image and document formats instantly – no uploads, 100% secure, and completely free. Supports PNG, JPG, PDF, DOCX, and more.",
  keywords: [
    "file converter",
    "image converter",
    "document converter",
    "PDF to DOCX",
    "PNG to JPG",
    "free online converter",
    "convert files locally",
    "background removal",
    "image resizer",
    "AI photo editor",
    "online passport size photo",
  ],
  authors: [{ name: "Convertify" }],
  creator: "Convertify",
  publisher: "Convertify",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    title: "Convertify - Free Online File Converter",
    description:
      "Convert images and documents between 19+ formats instantly. No uploads, 100% secure, free forever.",
    url: "https://convertify-pro.vercel.app",
    siteName: "Convertify",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Convertify - File Converter Tool",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Convertify - Free Online File Converter",
    description:
      "Convert images and documents between 19+ formats instantly. No uploads, 100% secure, free forever.",
    images: ["/twitter-image.png"],
    creator: "@convertify",
  },
  verification: {
    google: "your-google-verification-code", 
  },
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },
  metadataBase: new URL("https://convertify-pro.vercel.app"),
  alternates: {
    canonical: "/",
  },
  category: "File Conversion Tools",
  // Remove the line below if you don't have a PWA manifest
  manifest: "/site.webmanifest",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <Analytics />
      </body>
    </html>
  );
}