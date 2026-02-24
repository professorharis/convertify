import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Convertify - Free Online File Converter (Images & Documents)',
  description: 'Convert between 19+ image and document formats instantly. No uploads, 100% secure, free forever. Supports PNG, JPG, PDF, DOCX, and more.',
  keywords: 'file converter, image converter, document converter, PDF to DOCX, PNG to JPG, free online converter, convert files locally',
  authors: [{ name: 'Convertify Team' }],
  openGraph: {
    title: 'Convertify - Free Online File Converter',
    description: 'Convert images and documents between 19+ formats instantly. No uploads, 100% secure, free forever.',
    url: 'https://convertify-pro.vercel.app', 
    siteName: 'Convertify',
    images: [
      {
        url: 'https://convertify.app/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Convertify - File Converter',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Convertify - Free Online File Converter',
    description: 'Convert images and documents between 19+ formats instantly. No uploads, 100% secure, free forever.',
    images: ['https://convertify.app/og-image.png'], // 
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
  alternates: {
    canonical: 'https://convertify-pro.vercel.app', 
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}