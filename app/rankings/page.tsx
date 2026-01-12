'use client';

import { useState, useEffect } from 'react';
import { Trophy, TrendingUp, Award, Download, Calendar, Archive, Info, ChevronDown } from 'lucide-react';
import { getJogadores, calcularPosicoes } from '@/lib/api';
import { getRankingTemporada } from '@/lib/api/temporadas';
import { useTemporada } from '@/contexts/TemporadaContext';
import { exportarRankingPDF } from '@/lib/pdf';
import { Jogador, Categoria, Genero } from '@/types/database';

export default function RankingsPage() {
  const { temporadaAtual } = useTemporada();
  const [jogadores, setJogadores] = useState<Jogador[]>([]);
  const [categoriaFilter, setCategoriaFilter] = useState<Categoria | 'TODAS'>('TODAS');
  const [generoFilter, setGeneroFilter] = useState<Genero | 'TODOS'>('TODOS');
  const [loading, setLoading] = useState(true);
  const [mostrarInfo, setMostrarInfo] = useState(false);

  // 🎲 Definir categoria e gênero aleatórios na primeira carga
  useEffect(() => {
    const categorias: Categoria[] = ['A', 'B', 'C', 'D', 'FUN'];
    const generos: Genero[] = ['Masculino', 'Feminino'];
    
    const categoriaAleatoria = categorias[Math.floor(Math.random() * categorias.length)];
    const generoAleatorio = generos[Math.floor(Math.random() * generos.length)];
    
    setCategoriaFilter(categoriaAleatoria);
    setGeneroFilter(generoAleatorio);
  }, []);

  useEffect(() => {
    loadJogadores();
  }, [temporadaAtual]);

  const loadJogadores = async () => {
    if (!temporadaAtual) return;
    
    setLoading(true);

    try {
      if (temporadaAtual.ativa) {
        const data = await getJogadores();
        setJogadores(data);
      } else {
        const rankingSnapshot = await getRankingTemporada(temporadaAtual.id);
        
        const jogadoresFormatados = rankingSnapshot.map((r: any) => ({
          id: r.jogador_id,
          nome: r.jogador?.nome || 'Jogador',
          categoria: r.categoria as Categoria,
          genero: r.genero as Genero,
          pontos: r.pontos,
          torneios_disputados: r.torneios_disputados,
          email: r.jogador?.email,
          telefone: r.jogador?.telefone,
          cidade: r.jogador?.cidade,
          posicao: r.posicao,
          created_at: r.created_at || new Date().toISOString(),
          updated_at: r.created_at || new Date().toISOString(),
        }));
        
        setJogadores(jogadoresFormatados);
      }
    } catch (error) {
      console.error('Erro ao carregar jogadores:', error);
      setJogadores([]);
    }

    setLoading(false);
  };

  const jogadoresFiltrados = jogadores.filter(jogador => {
    const matchCategoria = categoriaFilter === 'TODAS' || jogador.categoria === categoriaFilter;
    const matchGenero = generoFilter === 'TODOS' || jogador.genero === generoFilter;
    const temPontos = jogador.pontos > 0;
    return matchCategoria && matchGenero && temPontos;
  });

  const jogadoresComPosicao = calcularPosicoes(jogadoresFiltrados);

  const handleExportarPDF = () => {
    const titulo = `Ranking Beach Tennis - ${categoriaFilter === 'TODAS' ? 'Geral' : `Categoria ${categoriaFilter}`}`;
    
    exportarRankingPDF(
      jogadoresComPosicao,
      titulo,
      categoriaFilter === 'TODAS' ? undefined : categoriaFilter,
      generoFilter === 'TODOS' ? undefined : generoFilter
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando rankings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-6 sm:py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Header Compacto */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="flex items-center gap-2">
                <Trophy className="w-6 h-6 text-primary-600" />
                <h1 className="text-2xl sm:text-3xl font-black text-gray-900">
                  Rankings Oficiais
                </h1>
              </div>
              {temporadaAtual && (
                <div className="flex items-center gap-2 mt-1">
                  <Calendar className="w-3 h-3 text-gray-400" />
                  <span className="text-xs text-gray-600">
                    {temporadaAtual.nome}
                    {temporadaAtual.ativa && (
                      <span className="ml-1.5 inline-flex items-center gap-1 text-xs bg-green-500 text-white px-1.5 py-0.5 rounded-full">
                        🟢 Ativa
                      </span>
                    )}
                  </span>
                </div>
              )}
            </div>
            
            {/* Botão Info */}
            <button
              onClick={() => setMostrarInfo(!mostrarInfo)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Info className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          {/* Alert Temporada Encerrada */}
          {temporadaAtual && !temporadaAtual.ativa && (
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 mb-4">
              <div className="flex items-center gap-2">
                <Archive className="w-4 h-4 text-orange-600 flex-shrink-0" />
                <p className="text-sm font-semibold text-orange-900">
                  📁 Temporada Encerrada: {temporadaAtual.nome}
                </p>
              </div>
            </div>
          )}

          {/* Info Dropdown */}
          {mostrarInfo && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4 animate-in slide-in-from-top">
              <h3 className="font-bold text-blue-900 mb-2 text-sm">
                {temporadaAtual?.ativa 
                  ? '🏆 Sistema Top 10' 
                  : '📁 Ranking Histórico'
                }
              </h3>
              {temporadaAtual?.ativa ? (
                <ul className="text-xs text-blue-800 space-y-1">
                  <li>• Apenas os 10 melhores resultados contam</li>
                  <li>• Últimos 12 meses</li>
                  <li>• Padrão internacional ITF</li>
                </ul>
              ) : (
                <p className="text-xs text-blue-800">
                  Ranking final preservado de {temporadaAtual?.nome}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Filtros Compactos */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Categoria */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-2">Categoria</label>
              <div className="flex gap-2">
                {(['A', 'B', 'C', 'D', 'FUN'] as Categoria[]).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setCategoriaFilter(cat)}
                    className={`flex-1 px-3 py-3 rounded-lg font-bold text-sm transition-all ${
                      categoriaFilter === cat
                        ? cat === 'A' ? 'bg-red-600 text-white' :
                          cat === 'B' ? 'bg-orange-600 text-white' :
                          cat === 'C' ? 'bg-yellow-600 text-white' :
                          cat === 'D' ? 'bg-green-600 text-white' :
                          'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Gênero */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-2">Gênero</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setGeneroFilter('Masculino')}
                  className={`px-3 py-3 rounded-lg font-bold text-sm transition-all ${
                    generoFilter === 'Masculino'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  👨 Masc
                </button>
                <button
                  onClick={() => setGeneroFilter('Feminino')}
                  className={`px-3 py-2 rounded-lg font-bold text-sm transition-all ${
                    generoFilter === 'Feminino'
                      ? 'bg-pink-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  👩 Fem
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Header com Botões */}
        <div className="mb-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <h2 className="text-lg font-bold text-gray-900">
              {categoriaFilter === 'TODAS' ? 'Geral' : `Categoria ${categoriaFilter}`}
              {generoFilter !== 'TODOS' && ` - ${generoFilter}`}
            </h2>
            
            <div className="flex items-center gap-2 w-full sm:w-auto">
              {categoriaFilter !== 'TODAS' && generoFilter !== 'TODOS' && (
                <button
                  onClick={() => {
                    const categoriaUrl = categoriaFilter.toLowerCase();
                    const generoUrl = generoFilter.toLowerCase();
                    window.location.href = `/ranking/${categoriaUrl}/${generoUrl}`;
                  }}
                  className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold text-sm shadow-lg"
                >
                  <Trophy className="w-4 h-4" />
                  Detalhado
                </button>
              )}
              
              <button
                onClick={handleExportarPDF}
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-semibold text-sm shadow-lg"
              >
                <Download className="w-4 h-4" />
                PDF
              </button>
            </div>
          </div>
        </div>

        {/* Lista/Tabela */}
        {jogadoresComPosicao.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <Trophy className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              Nenhum jogador encontrado
            </h3>
            <p className="text-sm text-gray-600">
              Tente ajustar os filtros
            </p>
          </div>
        ) : (
          <>
            {/* MOBILE: Cards */}
            <div className="lg:hidden space-y-3">
              {jogadoresComPosicao.map((jogador, index) => {
                const isPodium = index < 3;
                const podiumColors = [
                  'from-yellow-50 to-amber-50 border-yellow-300',
                  'from-gray-50 to-slate-50 border-gray-300',
                  'from-orange-50 to-amber-50 border-orange-300',
                ];

                return (
                  <div
                    key={jogador.id}
                    onClick={() => window.location.href = `/jogador/${jogador.id}`}
                    className={`bg-white rounded-xl border-2 p-4 shadow-sm hover:shadow-md transition-all cursor-pointer ${
                      isPodium ? `bg-gradient-to-br ${podiumColors[index]}` : 'border-gray-200'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {/* Posição */}
                      <div
                        className={`flex items-center justify-center w-12 h-12 rounded-xl font-black text-lg shadow-md flex-shrink-0 ${
                          index === 0
                            ? 'bg-gradient-to-br from-primary-400 to-primary-600 text-white'
                            : index === 1
                            ? 'bg-gradient-to-br from-gray-300 to-gray-500 text-white'
                            : index === 2
                            ? 'bg-gradient-to-br from-orange-400 to-orange-600 text-white'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {index === 0 ? <Trophy className="w-6 h-6" /> : jogador.posicao}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-bold text-gray-900 truncate">
                            {jogador.nome}
                          </h3>
                          <span
                            className={`px-2 py-0.5 rounded-full text-xs font-black flex-shrink-0 ${
                              jogador.categoria === 'A' ? 'bg-red-100 text-red-700' :
                              jogador.categoria === 'B' ? 'bg-orange-100 text-orange-700' :
                              jogador.categoria === 'C' ? 'bg-yellow-100 text-yellow-700' :
                              jogador.categoria === 'D' ? 'bg-green-100 text-green-700' :
                              'bg-blue-100 text-blue-700'
                            }`}
                          >
                            {jogador.categoria}
                          </span>
                        </div>

                        <div className="flex items-center gap-3 text-xs text-gray-600 mb-2">
                          <span>{jogador.genero === 'Masculino' ? '👨' : '👩'} {jogador.genero}</span>
                          <span>•</span>
                          <span>📍 {jogador.cidade || '-'}</span>
                        </div>

                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1">
                            <Award className="w-4 h-4 text-primary-600" />
                            <span className="font-black text-primary-600">{jogador.pontos}</span>
                            <span className="text-xs text-gray-500">pts</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <TrendingUp className="w-4 h-4 text-gray-400" />
                            <span className="font-semibold text-gray-700">{jogador.torneios_disputados}</span>
                            <span className="text-xs text-gray-500">torneios</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* DESKTOP: Tabela */}
            <div className="hidden lg:block bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-black text-gray-600 uppercase">Pos</th>
                      <th className="px-6 py-3 text-left text-xs font-black text-gray-600 uppercase">Jogador</th>
                      <th className="px-6 py-3 text-left text-xs font-black text-gray-600 uppercase">Cat</th>
                      <th className="px-6 py-3 text-left text-xs font-black text-gray-600 uppercase">Pontos</th>
                      <th className="px-6 py-3 text-left text-xs font-black text-gray-600 uppercase">Torneios</th>
                      <th className="px-6 py-3 text-left text-xs font-black text-gray-600 uppercase">Cidade</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-100">
                    {jogadoresComPosicao.map((jogador, index) => {
                      const isPodium = index < 3;
                      const podiumBg = [
                        'bg-gradient-to-r from-yellow-50 via-amber-50 to-yellow-50',
                        'bg-gradient-to-r from-gray-50 via-slate-50 to-gray-50',
                        'bg-gradient-to-r from-orange-50 via-amber-50 to-orange-50',
                      ];

                      return (
                        <tr
                          key={jogador.id}
                          onClick={() => window.location.href = `/jogador/${jogador.id}`}
                          className={`hover:bg-primary-50/30 transition-colors cursor-pointer ${
                            isPodium ? podiumBg[index] : ''
                          }`}
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div
                              className={`flex items-center justify-center w-10 h-10 rounded-xl font-black text-lg shadow-md ${
                                index === 0 ? 'bg-gradient-to-br from-primary-400 to-primary-600 text-white' :
                                index === 1 ? 'bg-gradient-to-br from-gray-300 to-gray-500 text-white' :
                                index === 2 ? 'bg-gradient-to-br from-orange-400 to-orange-600 text-white' :
                                'bg-gray-100 text-gray-700'
                              }`}
                            >
                              {index === 0 ? <Trophy className="w-5 h-5" /> : jogador.posicao}
                            </div>
                          </td>

                          <td className="px-6 py-4">
                            <div>
                              <div className="font-bold text-gray-900">{jogador.nome}</div>
                              <div className="text-sm text-gray-600">
                                {jogador.genero === 'Masculino' ? '👨' : '👩'} {jogador.genero}
                              </div>
                            </div>
                          </td>

                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-black ${
                                jogador.categoria === 'A' ? 'bg-red-100 text-red-700' :
                                jogador.categoria === 'B' ? 'bg-orange-100 text-orange-700' :
                                jogador.categoria === 'C' ? 'bg-yellow-100 text-yellow-700' :
                                jogador.categoria === 'D' ? 'bg-green-100 text-green-700' :
                                'bg-blue-100 text-blue-700'
                              }`}
                            >
                              {jogador.categoria}
                            </span>
                          </td>

                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              <Award className="w-4 h-4 text-primary-600" />
                              <span className="font-black text-primary-600 text-lg">{jogador.pontos}</span>
                            </div>
                          </td>

                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              <TrendingUp className="w-4 h-4 text-gray-400" />
                              <span className="text-gray-700 font-semibold">{jogador.torneios_disputados}</span>
                            </div>
                          </td>

                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-gray-600">{jogador.cidade || '-'}</span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}