'use client';

import { useState, useEffect } from 'react';
import { Trophy, TrendingUp, Award, Download } from 'lucide-react';
import { getJogadores, calcularPosicoes } from '@/lib/api';
import { exportarRankingPDF } from '@/lib/pdf';
import { Jogador, Categoria, Genero } from '@/types/database';

export default function RankingsPage() {
  const [jogadores, setJogadores] = useState<Jogador[]>([]);
  const [categoriaFilter, setCategoriaFilter] = useState<Categoria | 'TODAS'>('TODAS');
  const [generoFilter, setGeneroFilter] = useState<Genero | 'TODOS'>('TODOS');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadJogadores();
  }, []);

  const loadJogadores = async () => {
    const data = await getJogadores();
    setJogadores(data);
    setLoading(false);
  };

  // Filtrar jogadores
  const jogadoresFiltrados = jogadores.filter(jogador => {
    const matchCategoria = categoriaFilter === 'TODAS' || jogador.categoria === categoriaFilter;
    const matchGenero = generoFilter === 'TODOS' || jogador.genero === generoFilter;
    return matchCategoria && matchGenero;
  });

  // Calcular posições
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
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-primary-500 to-primary-600 text-white px-5 py-2.5 rounded-full mb-6 font-black text-sm shadow-xl shadow-primary-500/30">
            <Trophy className="w-4 h-4" />
            Sistema Top 10
          </div>
          <p className="text-sm font-bold text-primary-600 mb-2">RANKING BT</p>
          <h1 className="text-4xl sm:text-5xl font-black mb-4">
            <span className="bg-gradient-to-r from-gray-900 via-royal-900 to-gray-900 bg-clip-text text-transparent">
              Rankings Oficiais
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto font-medium">
            Classificação baseada nos 10 melhores resultados dos últimos 12 meses
          </p>
        </div>

        {/* Filtros */}
        <div className="bg-white rounded-2xl shadow-xl border-2 border-gray-100 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Filtro de Categoria */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-3">
                Filtrar por Categoria
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => setCategoriaFilter('TODAS')}
                  className={`px-4 py-3 rounded-lg font-bold transition-all ${
                    categoriaFilter === 'TODAS'
                      ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Todas
                </button>
                {(['A', 'B', 'C', 'D', 'FUN'] as Categoria[]).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setCategoriaFilter(cat)}
                    className={`px-4 py-3 rounded-lg font-bold transition-all ${
                      categoriaFilter === cat
                        ? cat === 'A' ? 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg' :
                          cat === 'B' ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg' :
                          cat === 'C' ? 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-white shadow-lg' :
                          cat === 'D' ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg' :
                          'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Filtro de Gênero */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-3">
                Filtrar por Gênero
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => setGeneroFilter('TODOS')}
                  className={`px-4 py-3 rounded-lg font-bold transition-all ${
                    generoFilter === 'TODOS'
                      ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Todos
                </button>
                <button
                  onClick={() => setGeneroFilter('Masculino')}
                  className={`px-4 py-3 rounded-lg font-bold transition-all ${
                    generoFilter === 'Masculino'
                      ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  👨 Masc
                </button>
                <button
                  onClick={() => setGeneroFilter('Feminino')}
                  className={`px-4 py-3 rounded-lg font-bold transition-all ${
                    generoFilter === 'Feminino'
                      ? 'bg-gradient-to-r from-pink-500 to-pink-600 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  👩 Fem
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Header da Tabela com Botão Exportar */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            Ranking {categoriaFilter === 'TODAS' ? 'Geral' : `Categoria ${categoriaFilter}`}
            {generoFilter !== 'TODOS' && ` - ${generoFilter}`}
          </h2>
          <button
            onClick={handleExportarPDF}
            className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-semibold shadow-lg hover:shadow-xl"
          >
            <Download className="w-4 h-4" />
            Exportar PDF
          </button>
        </div>

        {/* Tabela de Rankings */}
        {jogadoresComPosicao.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-xl border-2 border-gray-100 p-12 text-center">
            <Trophy className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Nenhum jogador encontrado
            </h3>
            <p className="text-gray-600">
              Tente ajustar os filtros de categoria ou gênero
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-2xl border-2 border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-black text-gray-600 uppercase tracking-wider">
                      Posição
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-black text-gray-600 uppercase tracking-wider">
                      Jogador
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-black text-gray-600 uppercase tracking-wider">
                      Categoria
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-black text-gray-600 uppercase tracking-wider">
                      Pontos
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-black text-gray-600 uppercase tracking-wider">
                      Torneios
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-black text-gray-600 uppercase tracking-wider">
                      Cidade
                    </th>
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
                        className={`hover:bg-primary-50/30 transition-colors cursor-pointer group ${
                          isPodium ? podiumBg[index] : ''
                        }`}
                      >
                        {/* Posição */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <div
                              className={`flex items-center justify-center w-10 h-10 rounded-xl font-black text-lg shadow-md ${
                                index === 0
                                  ? 'bg-gradient-to-br from-primary-400 to-primary-600 text-white'
                                  : index === 1
                                  ? 'bg-gradient-to-br from-gray-300 to-gray-500 text-white'
                                  : index === 2
                                  ? 'bg-gradient-to-br from-orange-400 to-orange-600 text-white'
                                  : 'bg-gray-100 text-gray-700'
                              }`}
                            >
                              {index === 0 && <Trophy className="w-5 h-5" />}
                              {index !== 0 && jogador.posicao}
                            </div>
                          </div>
                        </td>

                        {/* Nome */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div>
                              <div className="font-bold text-gray-900 text-base group-hover:text-primary-600 transition-colors">
                                {jogador.nome}
                              </div>
                              <div className="text-sm text-gray-600">
                                {jogador.genero === 'Masculino' ? '👨' : '👩'} {jogador.genero}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Categoria */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-black ${
                              jogador.categoria === 'A'
                                ? 'bg-red-100 text-red-700'
                                : jogador.categoria === 'B'
                                ? 'bg-orange-100 text-orange-700'
                                : jogador.categoria === 'C'
                                ? 'bg-yellow-100 text-yellow-700'
                                : jogador.categoria === 'D'
                                ? 'bg-green-100 text-green-700'
                                : 'bg-blue-100 text-blue-700'
                            }`}
                          >
                            {jogador.categoria}
                          </span>
                        </td>

                        {/* Pontos */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <Award className="w-4 h-4 text-primary-600" />
                            <span className="font-black text-primary-600 text-lg">
                              {jogador.pontos}
                            </span>
                          </div>
                        </td>

                        {/* Torneios */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <TrendingUp className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-700 font-semibold">
                              {jogador.torneios_disputados}
                            </span>
                          </div>
                        </td>

                        {/* Cidade */}
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
        )}

        {/* Informações do Sistema */}
        <div className="mt-8 bg-blue-50 border-2 border-blue-200 rounded-xl p-6">
          <div className="flex gap-4">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
                <Trophy className="w-6 h-6 text-white" />
              </div>
            </div>
            <div>
              <h3 className="font-bold text-blue-900 mb-2">Como funciona o sistema Top 10?</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Apenas os <strong>10 melhores resultados</strong> dos últimos 12 meses contam para o ranking</li>
                <li>• Resultados mais antigos que 12 meses são automaticamente descartados</li>
                <li>• Sistema justo que valoriza consistência e performance recente</li>
                <li>• Padrão internacional ITF (International Tennis Federation)</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}