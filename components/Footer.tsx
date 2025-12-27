import { Trophy, Mail, MapPin, Calendar } from 'lucide-react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border-t border-gray-700 mt-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-primary-500 to-blue-600 rounded-xl shadow-lg">
                <Trophy className="w-7 h-7 text-white" />
              </div>
              <div>
                <span className="font-black text-xl bg-gradient-to-r from-primary-400 to-blue-400 bg-clip-text text-transparent">
                  Ranking BT
                </span>
                <div className="text-xs text-gray-400 font-medium">Baixada Santista</div>
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              Sistema oficial de ranking de Beach Tennis da Baixada Santista. 
              Acompanhe sua evolução, participe de torneios homologados e conquiste sua posição.
            </p>
            <div className="flex items-center gap-3 text-sm text-gray-400">
              <MapPin className="w-4 h-4 text-primary-400" />
              <span>Santos, SP</span>
            </div>
          </div>

          {/* Links Rápidos */}
          <div>
            <h3 className="font-bold text-white mb-6 text-lg">Links Rápidos</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/rankings" className="text-gray-400 hover:text-primary-400 text-sm transition-colors flex items-center gap-2 group">
                  <span className="w-1 h-1 bg-primary-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Rankings
                </Link>
              </li>
              <li>
                <Link href="/como-funciona" className="text-gray-400 hover:text-primary-400 text-sm transition-colors flex items-center gap-2 group">
                  <span className="w-1 h-1 bg-primary-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Como Funciona
                </Link>
              </li>
              <li>
                <Link href="/torneios" className="text-gray-400 hover:text-primary-400 text-sm transition-colors flex items-center gap-2 group">
                  <span className="w-1 h-1 bg-primary-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Torneios
                </Link>
              </li>
            </ul>
          </div>

          {/* Contato */}
          <div>
            <h3 className="font-bold text-white mb-6 text-lg">Contato</h3>
            <div className="space-y-4">
              <div>
                <p className="text-gray-400 text-sm mb-3 leading-relaxed">
                  Para organizadores interessados em homologar torneios
                </p>
                <a 
                  href="mailto:contato@rankingbt.com.br" 
                  className="inline-flex items-center gap-2 text-primary-400 hover:text-primary-300 text-sm font-semibold transition-colors group"
                >
                  <Mail className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  contato@rankingbt.com.br
                </a>
              </div>
              <div className="pt-4 border-t border-gray-700">
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <Calendar className="w-4 h-4 text-primary-400" />
                  <span>Temporada 2025</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-700">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-500 text-sm">
              © {new Date().getFullYear()} Ranking BT - Baixada Santista. Todos os direitos reservados.
            </p>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-500">Sistema ativo</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
