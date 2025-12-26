'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Plus, Trophy, Calendar, MapPin, Users } from 'lucide-react';
import ProtectedRoute from '@/components/admin/ProtectedRoute';
import { verificarAdmin } from '@/lib/auth';
import { getTorneios } from '@/lib/api';
import { Torneio } from '@/types/database';

export default function ResultadosPage() {
  const [loading, setLoading] = useState(true);
  const [torneios, setTorneios] = useState<Torneio[]>([]);
  const router = useRouter();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const { isAdmin } = await verificarAdmin();
    if (!isAdmin) {
      router.push('/admin/login');
      return;
    }

    const data = await getTorneios();
    setTorneios(data);
    setLoading(false);
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Carregando...</p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center gap-3">
                <Link
                  href="/admin/dashboard"
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ArrowLeft className="w-5 h-5 text-gray-600" />
                </Link>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Registrar Resultados</h1>
                  <p className="text-xs text-gray-500">Escolha um torneio para registrar os resultados</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8">
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
                  <Trophy className="w-6 h-6 text-white" />
                </div>
              </div>
              <div>
                <h3 className="font-bold text-blue-900 mb-2">Como funciona?</h3>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>1. Escolha um torneio da lista abaixo</li>
                  <li>2. Adicione os jogadores e suas colocações</li>
                  <li>3. Os pontos serão calculados automaticamente</li>
                  <li>4. O ranking será atualizado em tempo real</li>
                </ul>
              </div>
            </div>
          </div>

          {torneios.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
              <Trophy className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Nenhum torneio cadastrado
              </h3>
              <p className="text-gray-600 mb-6">
                Você precisa criar um torneio antes de registrar resultados
              </p>
              <Link
                href="/admin/torneios/novo"
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-semibold"
              >
                <Plus className="w-4 h-4" />
                Criar Torneio
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {torneios.map((torneio) => (
                <Link
                  key={torneio.id}
                  href={`/admin/resultados/${torneio.id}`}
                  className="group bg-white rounded-xl shadow-sm border-2 border-gray-200 overflow-hidden hover:shadow-xl hover:border-primary-300 transition-all"
                >
                  {/* Header */}
                  <div className="bg-gradient-to-r from-primary-500 to-primary-600 px-4 py-3">
                    <Trophy className="w-6 h-6 text-white" />
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <h3 className="font-bold text-gray-900 text-lg mb-3 group-hover:text-primary-600 transition-colors line-clamp-2">
                      {torneio.nome}
                    </h3>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="w-4 h-4 text-primary-600" />
                        <span>
                          {new Date(torneio.data).toLocaleDateString('pt-BR', {
                            day: '2-digit',
                            month: 'long',
                            year: 'numeric'
                          })}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MapPin className="w-4 h-4 text-primary-600" />
                        <span>{torneio.local}</span>
                      </div>
                    </div>

                    {/* Status Badge */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                      <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                        torneio.status === 'realizado' 
                          ? 'bg-green-100 text-green-700'
                          : torneio.status === 'em_andamento'
                          ? 'bg-orange-100 text-orange-700'
                          : 'bg-blue-100 text-blue-700'
                      }`}>
                        {torneio.status === 'realizado' ? '✅ Realizado' :
                         torneio.status === 'em_andamento' ? '▶️ Em Andamento' :
                         '📅 Confirmado'}
                      </span>
                      
                      {torneio.pontuacao_custom && (
                        <span className="text-xs font-bold px-2 py-1 rounded-full bg-purple-100 text-purple-700">
                          ⭐ Especial
                        </span>
                      )}
                    </div>

                    {/* CTA */}
                    <div className="mt-4 text-primary-600 font-bold text-sm group-hover:text-primary-700 flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      Registrar Resultados
                      <span className="ml-auto group-hover:translate-x-1 transition-transform">→</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </main>
      </div>
    </ProtectedRoute>
  );
}