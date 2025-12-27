'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft, Trophy, Calendar, Award, TrendingUp, MapPin,
  User, Star, Target, BarChart3
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { Jogador, Categoria } from '@/types/database';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface ResultadoTorneio {
  id: string;
  torneio_nome: string;
  torneio_data: string;
  torneio_cidade: string;
  colocacao: string;
  pontos_ganhos: number;
  categoria_jogada: Categoria;
}

interface HistoricoCategoria {
  id: string;
  categoria_anterior: Categoria;
  categoria_nova: Categoria;
  data_mudanca: string;
  motivo: string;
}

interface PontosMensais {
  mes: string;
  pontos: number;
}

export default function PerfilJogadorPage({ params }: { params: { id: string } }) {
  const [loading, setLoading] = useState(true);
  const [jogador, setJogador] = useState<Jogador | null>(null);
  const [resultados, setResultados] = useState<ResultadoTorneio[]>([]);
  const [historico, setHistorico] = useState<HistoricoCategoria[]>([]);
  const [evolucao, setEvolucao] = useState<PontosMensais[]>([]);
  const router = useRouter();

  useEffect(() => {
    loadJogador();
  }, []);

  const loadJogador = async () => {
    try {
      // Buscar jogador
      const { data: jogadorData, error: jogadorError } = await supabase
        .from('jogadores')
        .select('*')
        .eq('id', params.id)
        .single();

      if (jogadorError || !jogadorData) {
        alert('Jogador não encontrado!');
        router.push('/rankings');
        return;
      }

      // Buscar resultados
      const { data: resultadosData } = await supabase
        .from('resultados')
        .select(`
          id,
          colocacao,
          pontos_ganhos,
          categoria_jogada,
          torneios:torneio_id (
            nome,
            data,
            cidade
          )
        `)
        .eq('jogador_id', params.id)
        .order('torneios(data)', { ascending: false });

      // Formatar resultados
      const resultadosFormatados = resultadosData?.map((r: any) => ({
        id: r.id,
        torneio_nome: r.torneios?.nome || 'Torneio',
        torneio_data: r.torneios?.data || '',
        torneio_cidade: r.torneios?.cidade || '',
        colocacao: r.colocacao,
        pontos_ganhos: r.pontos_ganhos,
        categoria_jogada: r.categoria_jogada,
      })) || [];

      // Buscar histórico de categorias
      const { data: historicoData } = await supabase
        .from('historico_categorias_jogador')
        .select('*')
        .eq('jogador_id', params.id)
        .order('data_mudanca', { ascending: false });

      // Calcular evolução mensal (últimos 6 meses)
      const mesesPt = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
      const pontosPorMes: { [key: string]: number } = {};

      resultadosFormatados.forEach((r: ResultadoTorneio) => {
        const data = new Date(r.torneio_data);
        const mesAno = `${mesesPt[data.getMonth()]}/${data.getFullYear().toString().slice(2)}`;
        pontosPorMes[mesAno] = (pontosPorMes[mesAno] || 0) + r.pontos_ganhos;
      });

      const evolucaoData = Object.entries(pontosPorMes)
        .map(([mes, pontos]) => ({ mes, pontos }))
        .slice(-6)
        .reverse();

      setJogador(jogadorData);
      setResultados(resultadosFormatados);
      setHistorico(historicoData || []);
      setEvolucao(evolucaoData);
      setLoading(false);
    } catch (error) {
      console.error('Erro ao carregar jogador:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando perfil...</p>
        </div>
      </div>
    );
  }

  if (!jogador) {
    return null;
  }

  const stats = [
    { label: 'Pontos Totais', value: jogador.pontos, icon: Award, color: 'yellow' },
    { label: 'Torneios', value: jogador.torneios_disputados, icon: Trophy, color: 'blue' },
    { label: 'Categoria Atual', value: jogador.categoria, icon: Star, color: 'purple' },
  ];

  const titulos = resultados.filter(r => r.colocacao === 'Campeão').length;
  const vices = resultados.filter(r => r.colocacao === 'Vice').length;
  const podios = resultados.filter(r => ['Campeão', 'Vice', '3º Lugar'].includes(r.colocacao)).length;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/rankings"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-primary-600 transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar para Rankings
          </Link>
        </div>

        {/* Card Principal do Jogador */}
        <div className="bg-gradient-to-br from-primary-500 to-primary-600 rounded-3xl shadow-2xl p-8 mb-8 text-white">
          <div className="flex items-start gap-6">
            {/* Avatar */}
            <div className="w-24 h-24 bg-white/20 rounded-2xl flex items-center justify-center flex-shrink-0 backdrop-blur-sm">
              <User className="w-12 h-12 text-white" />
            </div>

            {/* Info */}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-4xl font-black">{jogador.nome}</h1>
                <span className={`px-3 py-1 rounded-full text-xs font-black ${
                  jogador.categoria === 'A' ? 'bg-red-500' :
                  jogador.categoria === 'B' ? 'bg-orange-500' :
                  jogador.categoria === 'C' ? 'bg-yellow-500' :
                  jogador.categoria === 'D' ? 'bg-green-500' :
                  'bg-blue-500'
                } text-white`}>
                  CATEGORIA {jogador.categoria}
                </span>
              </div>

              <div className="flex items-center gap-4 text-primary-100 mb-4">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  <span>{jogador.genero}</span>
                </div>
                <span>•</span>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span>{jogador.cidade || 'Baixada Santista'}</span>
                </div>
                {jogador.telefone && (
                  <>
                    <span>•</span>
                    <span>{jogador.telefone}</span>
                  </>
                )}
              </div>

              {/* Conquistas Rápidas */}
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-yellow-300" />
                  <span className="font-bold">{titulos} {titulos === 1 ? 'Título' : 'Títulos'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-gray-300" />
                  <span className="font-bold">{vices} Vice{vices !== 1 ? 's' : ''}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-orange-300" />
                  <span className="font-bold">{podios} Pódio{podios !== 1 ? 's' : ''}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 bg-${stat.color}-100 rounded-lg flex items-center justify-center`}>
                  <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
                </div>
                <TrendingUp className="w-5 h-5 text-green-500" />
              </div>
              <h3 className="text-3xl font-black text-gray-900 mb-1">{stat.value}</h3>
              <p className="text-sm text-gray-600 font-semibold">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Gráfico de Evolução */}
        {evolucao.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-primary-600" />
              Evolução de Pontos (Últimos 6 Meses)
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={evolucao}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="mes" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="pontos" stroke="#FCBA28" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Grid: Histórico de Torneios + Histórico de Categorias */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Histórico de Torneios */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
                <h3 className="font-bold text-gray-900 flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-primary-600" />
                  Histórico de Torneios ({resultados.length})
                </h3>
              </div>

              <div className="divide-y divide-gray-100 max-h-[600px] overflow-y-auto">
                {resultados.length === 0 ? (
                  <div className="p-12 text-center">
                    <Trophy className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">Nenhum torneio disputado ainda</p>
                  </div>
                ) : (
                  resultados.map((resultado) => (
                    <div key={resultado.id} className="p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-bold text-gray-900 mb-1">
                            {resultado.torneio_nome}
                          </h4>
                          <div className="flex items-center gap-3 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {new Date(resultado.torneio_data).toLocaleDateString('pt-BR')}
                            </div>
                            <span>•</span>
                            <div className="flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                              {resultado.torneio_cidade}
                            </div>
                            <span>•</span>
                            <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                              resultado.categoria_jogada === 'A' ? 'bg-red-100 text-red-700' :
                              resultado.categoria_jogada === 'B' ? 'bg-orange-100 text-orange-700' :
                              resultado.categoria_jogada === 'C' ? 'bg-yellow-100 text-yellow-700' :
                              resultado.categoria_jogada === 'D' ? 'bg-green-100 text-green-700' :
                              'bg-blue-100 text-blue-700'
                            }`}>
                              Cat. {resultado.categoria_jogada}
                            </span>
                          </div>
                        </div>
                        <div className="text-right ml-4">
                          <div className={`font-bold mb-1 ${
                            resultado.colocacao === 'Campeão' ? 'text-yellow-600' :
                            resultado.colocacao === 'Vice' ? 'text-gray-600' :
                            resultado.colocacao === '3º Lugar' ? 'text-orange-600' :
                            'text-gray-700'
                          }`}>
                            {resultado.colocacao}
                          </div>
                          <div className="text-sm font-bold text-primary-600">
                            +{resultado.pontos_ganhos} pts
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Histórico de Categorias */}
          <div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="bg-gradient-to-r from-purple-50 to-purple-100 px-6 py-4 border-b border-purple-200">
                <h3 className="font-bold text-purple-900 flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Mudanças de Categoria
                </h3>
              </div>

              <div className="p-6">
                {historico.length === 0 ? (
                  <div className="text-center py-8">
                    <Target className="w-10 h-10 text-gray-400 mx-auto mb-3" />
                    <p className="text-sm text-gray-600">Sem mudanças registradas</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {historico.map((item, index) => (
                      <div key={item.id} className="relative">
                        {index !== historico.length - 1 && (
                          <div className="absolute left-4 top-10 bottom-0 w-0.5 bg-purple-200"></div>
                        )}
                        <div className="flex gap-3">
                          <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 relative z-10">
                            <div className="w-3 h-3 bg-purple-600 rounded-full"></div>
                          </div>
                          <div className="flex-1 pb-6">
                            <div className="text-xs text-gray-500 mb-1">
                              {new Date(item.data_mudanca).toLocaleDateString('pt-BR')}
                            </div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="px-2 py-0.5 bg-red-100 text-red-700 rounded text-xs font-bold">
                                {item.categoria_anterior}
                              </span>
                              <span className="text-gray-400">→</span>
                              <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded text-xs font-bold">
                                {item.categoria_nova}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600">{item.motivo}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-8 text-center">
  <p className="text-sm text-gray-500">
    Ranking BT - Sistema Oficial de Rankings da Baixada Santista
  </p>
</div>
    </div>
  );
}