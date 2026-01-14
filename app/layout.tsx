import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import { TemporadaProvider } from "@/contexts/TemporadaContext";
import Footer from "@/components/Footer";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'Ranking BT - Beach Tennis Baixada Santista',
  description: 'Acompanhe o ranking oficial, torneios homologados e os melhores atletas de Beach Tennis da Baixada Santista. Sistema RBT100 com pontuação profissional.',
  
  // Favicon
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  
  // Open Graph (Facebook, WhatsApp, LinkedIn)
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: 'https://rankingbt.com.br',
    siteName: 'Ranking BT - Baixada Santista',
    title: 'Ranking BT - Beach Tennis Baixada Santista',
    description: 'Acompanhe o ranking oficial, torneios homologados e os melhores atletas de Beach Tennis da Baixada Santista.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Ranking BT - Beach Tennis Baixada Santista',
      },
    ],
  },
  
  // Twitter Card
  twitter: {
    card: 'summary_large_image',
    title: 'Ranking BT - Beach Tennis Baixada Santista',
    description: 'Ranking oficial de Beach Tennis da Baixada Santista',
    images: ['/og-image.png'],
  },
  
  // Meta tags adicionais
  keywords: [
    'beach tennis',
    'ranking',
    'baixada santista',
    'santos',
    'são vicente',
    'praia grande',
    'guarujá',
    'torneios',
    'RBT',
    'ranking oficial',
  ],
  authors: [{ name: 'Ranking BT' }],
  creator: 'Ranking BT',
  publisher: 'Ranking BT',
  
  // Manifest (PWA)
  manifest: '/manifest.json',
  
  // Viewport
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
  },
  
  // Robots
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <TemporadaProvider>
          <Header />
          <main className="min-h-screen">
            {children}
          </main>
          <Footer />
        </TemporadaProvider>
        <SpeedInsights />
        <Analytics/>
      </body>
    </html>
  );
}