import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Ranking BT - Baixada Santista",
  description: "Ranking oficial de Beach Tennis da Baixada Santista. Acompanhe sua evolução, confira as categorias e participe dos torneios homologados.",
  keywords: "beach tennis, ranking, baixada santista, santos, guarujá, praia grande, torneio",
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
