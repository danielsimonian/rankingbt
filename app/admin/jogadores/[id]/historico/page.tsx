'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, History, TrendingUp, TrendingDown, User, Calendar, FileText } from 'lucide-react';
import ProtectedRoute from '@/components/admin/ProtectedRoute';
import { getJogadorPorId } from '@/lib/api';
import { getHistoricoCategorias } from '@/lib/categorias';
import { Jogador, HistoricoCategoriaJogador } from '@/types/database';

export default function HistoricoJogadorPage({ params }: { params: { id: string } }) {
  const [loading, setLoading] = useState(true);
  const [jogador, setJogador] = useState<Jogador | null>(null);
  const [historico, setHistorico] = useState<HistoricoCategoriaJogador[]>([]);
  const router = useRouter();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const jogadorData = await getJogadorPorId(params.id);
    
    if (!jogadorData) {
      alert('Jogador não encontrado!');
      router.push('/admin/jogadores');
      return;
    }

    const historicoData = await getHistoricoCategorias(params.id);

    setJogador(jogadorData);
    setHistorico(historicoData);
    setLoading(false);
  };

  const getCategoriaColor = (cat: string) => {
    const colors: Record<string, string> = {
      'A': 'bg-red-100 text-red-700 border-red-200',
      'B': 'bg-orange-100 text-orange-700 border-orange-200',
      'C': 'bg-yellow-100 text-yellow-700 border-yellow-200',
      'D': 'bg-green-100 text-green-700 border-green-200',
      'FUN': 'bg-blue-100 text-blue-700 border-blue-200',
    };
    return colors[cat] || 'bg-gray-100 text-gray-700 border-gray-200';
  };

  const getMotivoIcon = (motivo: string) => {
    if (motivo === 'subiu') return <TrendingUp className="w-5 h-5 text-green-600" />;
    if (motivo === 'desceu') return <TrendingDown className="w-5 h-5 text-orange-600" />;
    if (motivo === 'ativo') return <User className="w-5 h-5 text-blue-600" />;
    return <FileText className="w-5 h-5 text-gray-600" />;
  };

  const getMotivoLabel = (motivo: string) => {
    const labels: Record<string, string> = {
      'subiu': 'Subiu de Categoria',
      'desceu': 'Desceu de Categoria',
      'ativo': 'Categoria Atual',
      'admin': 'Alteração Administrativa',
    };
    return labels[motivo] || motivo;
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Carregando histórico...</p>
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
                  href="/admin/jogadores"
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ArrowLeft className="w-5 h-5 text-gray-600" />
                </Link>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Histórico de Categorias</h1>
                  <p className="text-xs text-gray-500">{jogador?.nome}</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Info do Jogador */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center flex-shrink-0">
                <User className="w-8 h-8 text-white" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">{jogador?.nome}</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <div className="text-xs text-gray-500 uppercase mb-1">Categoria Atual</div>
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-bold border-2 ${getCategoriaColor(jogador?.categoria || '')}`}>
                      {jogador?.categoria}
                    </span>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 uppercase mb-1">Pontos</div>
                    <div className="text-xl font-bold text-primary-600">{jogador?.pontos}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 uppercase mb-1">Torneios</div>
                    <div className="text-xl font-bold text-gray-900">{jogador?.torneios_disputados}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 uppercase mb-1">Gênero</div>
                    <div className="text-sm font-semibold text-gray-700">
                      {jogador?.genero === 'Masculino' ? '👨' : '👩'} {jogador?.genero}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Histórico */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <History className="w-5 h-5 text-gray-600" />
                <h3 className="font-bold text-gray-900">Histórico de Mudanças</h3>
                <span className="text-sm text-gray-500">({historico.length} registro{historico.length !== 1 ? 's' : ''})</span>
              </div>
            </div>

            {historico.length === 0 ? (
              <div className="p-12 text-center">
                <History className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Nenhum histórico
                </h3>
                <p className="text-gray-600">
                  Este jogador ainda não teve mudanças de categoria
                </p>
              </div>
            ) : (
              <div className="p-6">
                {/* Timeline */}
                <div className="relative">
                  {/* Linha vertical */}
                  <div className="absolute left-[27px] top-0 bottom-0 w-0.5 bg-gray-200"></div>

                  <div className="space-y-6">
                    {historico.map((item, index) => (
                      <div key={item.id} className="relative flex gap-4">
                        {/* Ícone */}
                        <div className="flex-shrink-0 w-14 h-14 bg-white border-4 border-gray-200 rounded-full flex items-center justify-center z-10">
                          {getMotivoIcon(item.motivo_saida)}
                        </div>

                        {/* Conteúdo */}
                        <div className="flex-1 bg-gray-50 rounded-lg border border-gray-200 p-4">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <div className="font-bold text-gray-900 mb-1">
                                {getMotivoLabel(item.motivo_saida)}
                              </div>
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <Calendar className="w-4 h-4" />
                                <span>
                                  {new Date(item.data_entrada).toLocaleDateString('pt-BR', {
                                    day: '2-digit',
                                    month: 'long',
                                    year: 'numeric'
                                  })}
                                </span>
                                {item.data_saida && (
                                  <>
                                    <span className="text-gray-400">até</span>
                                    <span>
                                      {new Date(item.data_saida).toLocaleDateString('pt-BR', {
                                        day: '2-digit',
                                        month: 'long',
                                        year: 'numeric'
                                      })}
                                    </span>
                                  </>
                                )}
                              </div>
                            </div>

                            {/* Badge de Categoria */}
                            <span className={`px-3 py-1 rounded-full text-sm font-bold border-2 ${getCategoriaColor(item.categoria)}`}>
                              Categoria {item.categoria}
                            </span>
                          </div>

                          {/* Pontos */}
                          <div className="bg-white rounded-lg border border-gray-200 p-3">
                            <div className="text-xs text-gray-500 uppercase mb-1">
                              Pontos na Categoria
                            </div>
                            <div className="text-2xl font-bold text-primary-600">
                              {item.pontos_na_categoria}
                            </div>
                          </div>

                          {/* Status */}
                          {!item.data_saida && (
                            <div className="mt-3 inline-flex items-center gap-2 px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">
                              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                              Categoria Atual
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}