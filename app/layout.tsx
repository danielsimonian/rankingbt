import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'Ranking BT - Baixada Santista',
  description: 'Sistema oficial de rankings de Beach Tennis da Baixada Santista. Acompanhe sua categoria, pontos e evolução.',
  keywords: 'beach tennis, ranking, baixada santista, santos, categoria, torneios',
  openGraph: {
    title: 'Ranking BT - Baixada Santista',
    description: 'Sistema oficial de rankings de Beach Tennis',
    url: 'https://rankingbt.com.br',
    siteName: 'Ranking BT',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <Header />
        <main className="min-h-screen">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
