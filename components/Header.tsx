'use client';

import Link from 'next/link';
import { Trophy, Menu, X, LogOut, Calendar } from 'lucide-react';
import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const isHomePage = pathname === '/';

  useEffect(() => {
    const adminStatus = localStorage.getItem('isAdmin') === 'true';
    setIsAdmin(adminStatus);
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem('isAdmin');
    setIsAdmin(false);
    router.push('/');
  };

  return (
    <header className={`bg-white/98 backdrop-blur-md shadow-lg border-b-2 border-primary-100/50 ${isHomePage ? '' : 'sticky top-0'} z-50`}>
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 justify-between items-center">
          {/* Premium Logo */}
          <Link href={isAdmin ? "/admin/dashboard" : "/"} className="flex items-center gap-3 group">
            <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl shadow-xl shadow-primary-500/30 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
              <Trophy className="w-7 h-7 text-white drop-shadow-lg" />
            </div>
            <div className="hidden sm:block">
              <span className="font-black text-xl bg-gradient-to-r from-primary-600 via-primary-500 to-royal-600 bg-clip-text text-transparent">
                Ranking BT
              </span>
              <div className="text-xs text-gray-600 font-bold -mt-1 tracking-wide">
                {isAdmin ? 'ADMINISTRATIVO' : 'BAIXADA SANTISTA'}
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-2">
            {isAdmin ? (
              // Links Admin
              <>
                <Link 
                  href="/admin/jogadores" 
                  className="text-gray-700 hover:text-primary-600 font-bold px-5 py-2.5 rounded-xl hover:bg-primary-50 transition-all relative group"
                >
                  <span className="relative z-10">Jogadores</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-primary-100 to-royal-100 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity -z-10"></div>
                </Link>
                <Link 
                  href="/admin/jogadores/mesclar" 
                  className="text-gray-700 hover:text-yellow-600 font-bold px-5 py-2.5 rounded-xl hover:bg-yellow-50 transition-all relative group"
                >
                  <span className="relative z-10">Mesclar</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-yellow-100 to-yellow-100 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity -z-10"></div>
                </Link>
                <Link 
                  href="/admin/torneios" 
                  className="text-gray-700 hover:text-primary-600 font-bold px-5 py-2.5 rounded-xl hover:bg-primary-50 transition-all relative group"
                >
                  <span className="relative z-10">Torneios</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-primary-100 to-royal-100 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity -z-10"></div>
                </Link>
                <Link 
                  href="/admin/resultados" 
                  className="text-gray-700 hover:text-primary-600 font-bold px-5 py-2.5 rounded-xl hover:bg-primary-50 transition-all relative group"
                >
                  <span className="relative z-10">Resultados</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-primary-100 to-royal-100 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity -z-10"></div>
                </Link>
                <Link 
                  href="/admin/importar" 
                  className="text-gray-700 hover:text-primary-600 font-bold px-5 py-2.5 rounded-xl hover:bg-primary-50 transition-all relative group"
                >
                  <span className="relative z-10">Importar Dados</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-primary-100 to-royal-100 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity -z-10"></div>
                </Link>
                <Link 
                  href="/admin/configuracoes" 
                  className="text-gray-700 hover:text-primary-600 font-bold px-5 py-2.5 rounded-xl hover:bg-primary-50 transition-all relative group"
                >
                  <span className="relative z-10">Configurações</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-primary-100 to-royal-100 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity -z-10"></div>
                </Link>
                <Link 
                  href="/admin/temporadas" 
                  className="text-gray-700 hover:text-primary-600 font-bold px-5 py-2.5 rounded-xl hover:bg-primary-50 transition-all relative group"
                >
                  <span className="relative z-10">Temporadas</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-primary-100 to-royal-100 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity -z-10"></div>
                </Link>
 
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:inline">Sair</span>
                </button>
              </>
            ) : (
              // Links Públicos
              <>
                <Link 
                  href="/como-funciona" 
                  className="text-gray-700 hover:text-primary-600 font-bold px-5 py-2.5 rounded-xl hover:bg-primary-50 transition-all relative group"
                >
                  <span className="relative z-10">Como Funciona</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-primary-100 to-royal-100 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity -z-10"></div>
                </Link>
                <Link 
                  href="/torneios" 
                  className="text-gray-700 hover:text-primary-600 font-bold px-5 py-2.5 rounded-xl hover:bg-primary-50 transition-all relative group"
                >
                  <span className="relative z-10">Torneios</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-primary-100 to-royal-100 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity -z-10"></div>
                </Link>
                <Link 
                  href="/apoiadores" 
                  className="text-gray-700 hover:text-primary-600 font-bold px-5 py-2.5 rounded-xl hover:bg-primary-50 transition-all relative group"
                >
                  <span className="relative z-10">Apoiadores</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-primary-100 to-royal-100 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity -z-10"></div>
                </Link>
                <Link
                  href="/rankings"
                  className="bg-gradient-to-r from-primary-500 to-primary-600 text-gray-900 px-6 py-2.5 rounded-lg font-bold hover:from-primary-400 hover:to-primary-500 transition-all shadow-lg hover:shadow-xl"
                >
                  Ver Rankings
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2.5 text-gray-700 hover:bg-primary-50 rounded-xl transition-colors"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 space-y-2 border-t border-primary-100 mt-2">
            {isAdmin ? (
              // Mobile Admin
              <>
                <Link 
                  href="/admin/jogadores" 
                  className="block text-gray-700 hover:text-primary-600 hover:bg-primary-50 font-bold py-3 px-4 rounded-xl transition-all"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Jogadores
                </Link>
                <Link 
                  href="/admin/torneios" 
                  className="block text-gray-700 hover:text-primary-600 hover:bg-primary-50 font-bold py-3 px-4 rounded-xl transition-all"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Torneios
                </Link>
                <Link 
                  href="/admin/resultados" 
                  className="block text-gray-700 hover:text-primary-600 hover:bg-primary-50 font-bold py-3 px-4 rounded-xl transition-all"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Resultados
                </Link>
                <Link 
                  href="/admin/importar" 
                  className="block text-gray-700 hover:text-primary-600 hover:bg-primary-50 font-bold py-3 px-4 rounded-xl transition-all"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Importar Dados
                </Link>
                <Link 
                  href="/admin/configuracoes" 
                  className="block text-gray-700 hover:text-primary-600 hover:bg-primary-50 font-bold py-3 px-4 rounded-xl transition-all"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Configurações
                </Link>
                <div className="border-t border-gray-200 my-2"></div>
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="block w-full text-left text-gray-500 hover:text-red-600 hover:bg-red-50 font-medium py-3 px-4 rounded-xl transition-all"
                >
                  Sair
                </button>
              </>
            ) : (
              // Mobile Público
              <>
                <Link 
                  href="/rankings" 
                  className="block text-gray-700 hover:text-primary-600 hover:bg-primary-50 font-bold py-3 px-4 rounded-xl transition-all"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Rankings
                </Link>
                <Link 
                  href="/como-funciona" 
                  className="block text-gray-700 hover:text-primary-600 hover:bg-primary-50 font-bold py-3 px-4 rounded-xl transition-all"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Como Funciona
                </Link>
                <Link 
                  href="/torneios" 
                  className="block text-gray-700 hover:text-primary-600 hover:bg-primary-50 font-bold py-3 px-4 rounded-xl transition-all"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Torneios
                </Link>
                <Link 
                  href="/apoiadores" 
                  className="block text-gray-700 hover:text-primary-600 hover:bg-primary-50 font-bold py-3 px-4 rounded-xl transition-all"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Apoiadores
                </Link>
                <Link 
                  href="/cadastro" 
                  className="block bg-gradient-to-r from-primary-500 to-primary-600 text-gray-900 px-6 py-3 rounded-xl hover:from-primary-600 hover:to-primary-700 font-black text-center transition-all shadow-lg"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Cadastrar
                </Link>
              </>
            )}
          </div>
        )}
      </nav>
    </header>
  );
}