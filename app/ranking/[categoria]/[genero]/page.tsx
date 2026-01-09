'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Download, Calendar, Archive } from 'lucide-react';
import { getJogadoresPorCategoriaEGenero, calcularPosicoes } from '@/lib/api';
import { getRankingTemporada } from '@/lib/api/temporadas';
import { useTemporada } from '@/contexts/TemporadaContext';
import { Categoria, Genero } from '@/types/database';
import RankingTable from '@/components/RankingTable';

const categorias: Categoria[] = ['A', 'B', 'C', 'D', 'FUN'];
const generos: Genero[] = ['Masculino', 'Feminino'];

const categoriaNomes: Record<string, Categoria> = {
  'a': 'A',
  'b': 'B',
  'c': 'C',
  'd': 'D',
  'fun': 'FUN',
};

const generoNomes: Record<string, Genero> = {
  'masculino': 'Masculino',
  'feminino': 'Feminino',
};

const categoriaDescricoes: Record<Categoria, { nome: string; descricao: string }> = {
  'A': { nome: 'Elite', descricao: 'Nível Avançado' },
  'B': { nome: 'Avançado', descricao: 'Alto Nível Técnico' },
  'C': { nome: 'Intermediário', descricao: 'Em Desenvolvimento' },
  'D': { nome: 'Iniciante', descricao: 'Aprendizado' },
  'FUN': { nome: 'Recreativo', descricao: 'Diversão' },
};

export default function CategoriaGeneroRankingPage() {
  const params = useParams();
  const { temporadaAtual } = useTemporada();
  const [jogadores, setJogadores] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const categoriaKey = (params.categoria as string).toLowerCase();
  const generoKey = (params.genero as string).toLowerCase();
  
  const categoria = categoriaNomes[categoriaKey];
  const genero = generoNomes[generoKey];

  if (!categoria || !categorias.includes(categoria) || !genero || !generos.includes(genero)) {
    notFound();
  }

  useEffect(() => {
    carregarRanking();
  }, [temporadaAtual, categoria, genero]);

  const carregarRanking = async () => {
    if (!temporadaAtual) return;
    
    setLoading(true);

    try {
      if (temporadaAtual.ativa) {
        // Temporada ativa: busca ranking atual (tabela jogadores)
        const jogadoresRaw = await getJogadoresPorCategoriaEGenero(categoria, genero);
        
        // ✅ FILTRAR APENAS JOGADORES COM PONTOS
        const jogadoresComPontos = jogadoresRaw.filter(j => j.pontos > 0);
        
        const jogadoresComPosicao = calcularPosicoes(jogadoresComPontos);
        setJogadores(jogadoresComPosicao);
      } else {
        // Temporada encerrada: busca snapshot (tabela rankings_temporada)
        const rankingSnapshot = await getRankingTemporada(
          temporadaAtual.id,
          categoria,
          genero
        );
        
        // Transformar formato para compatibilidade com RankingTable
        const jogadoresFormatados = rankingSnapshot.map((r) => ({
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
      console.error('Erro ao carregar ranking:', error);
      setJogadores([]);
    }

    setLoading(false);
  };

  const info = categoriaDescricoes[categoria];
  const generoEmoji = genero === 'Masculino' ? '👨' : '👩';
  const generoLabel = genero === 'Masculino' ? 'Masculino' : 'Feminino';

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Link 
          href="/rankings"
          className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 mb-6 font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar para categorias
        </Link>

        {/* Badge de Temporada */}
        {temporadaAtual && !temporadaAtual.ativa && (
          <div className="bg-orange-50 border-2 border-orange-200 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-3">
              <Archive className="w-5 h-5 text-orange-600" />
              <div>
                <p className="font-semibold text-orange-900">
                  📁 Visualizando Temporada Encerrada: {temporadaAtual.nome}
                </p>
                <p className="text-sm text-orange-700">
                  Este é o ranking final preservado desta temporada.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-4xl font-bold text-gray-900">
                  Categoria {categoria}
                </h1>
                <span className="text-4xl">{generoEmoji}</span>
              </div>
              <p className="text-lg text-gray-600 mb-1">{info.nome} · {generoLabel}</p>
              <p className="text-sm text-gray-500">{info.descricao}</p>
              {temporadaAtual && (
                <div className="flex items-center gap-2 mt-3">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600">
                    {temporadaAtual.nome}
                    {temporadaAtual.ativa && (
                      <span className="ml-2 inline-flex items-center gap-1 text-xs bg-green-500 text-white px-2 py-0.5 rounded-full">
                        🟢 Ativa
                      </span>
                    )}
                  </span>
                </div>
              )}
            </div>
            <div className="mt-6 md:mt-0">
              <button className="inline-flex items-center gap-2 bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors font-medium">
                <Download className="w-5 h-5" />
                Exportar PDF
              </button>
            </div>
          </div>
        </div>

        {/* Switch Gênero */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-8">
          <div className="flex items-center justify-center gap-4">
            <span className="text-sm font-medium text-gray-600">Filtrar por:</span>
            <div className="flex gap-2">
              <Link
                href={`/ranking/${params.categoria}/masculino`}
                className={`px-6 py-2 rounded-lg font-bold transition-all ${
                  genero === 'Masculino'
                    ? 'bg-primary-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                👨 Masculino
              </Link>
              <Link
                href={`/ranking/${params.categoria}/feminino`}
                className={`px-6 py-2 rounded-lg font-bold transition-all ${
                  genero === 'Feminino'
                    ? 'bg-primary-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                👩 Feminino
              </Link>
            </div>
          </div>
        </div>

        {/* Stats */}
        {loading ? (
          <div className="text-center py-12">
            <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Carregando ranking...</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="text-sm text-gray-600 mb-1">Total de Jogadores</div>
                <div className="text-3xl font-bold text-gray-900">{jogadores.length}</div>
              </div>
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="text-sm text-gray-600 mb-1">Líder</div>
                <div className="text-xl font-bold text-gray-900">{jogadores[0]?.nome || '-'}</div>
                <div className="text-sm text-primary-600 font-medium">{jogadores[0]?.pontos || 0} pontos</div>
              </div>
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="text-sm text-gray-600 mb-1">
                  {temporadaAtual?.ativa ? 'Última Atualização' : 'Temporada Encerrada'}
                </div>
                <div className="text-xl font-bold text-gray-900">
                  {temporadaAtual?.ativa 
                    ? new Date().toLocaleDateString('pt-BR')
                    : temporadaAtual?.data_fim 
                      ? new Date(temporadaAtual.data_fim).toLocaleDateString('pt-BR')
                      : '-'
                  }
                </div>
              </div>
            </div>

            {/* Ranking Table */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                <h2 className="font-semibold text-gray-900">
                  Ranking Completo - Categoria {categoria} {generoEmoji} {generoLabel}
                </h2>
              </div>
              <RankingTable jogadores={jogadores} />
            </div>

            {/* Info */}
            <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="font-semibold text-blue-900 mb-2">
                ℹ️ Informação
              </h3>
              <p className="text-blue-800 text-sm">
                {temporadaAtual?.ativa ? (
                  <>
                    O ranking é atualizado após cada torneio homologado. A pontuação é baseada nos <strong>10 melhores resultados</strong> dos últimos 12 meses. 
                    Jogadores podem subir de categoria quando quiserem (pontuação zera), mas para descer é necessário aprovação do administrador.
                  </>
                ) : (
                  <>
                    Este é o ranking final da <strong>{temporadaAtual?.nome}</strong>. 
                    Os dados estão preservados como histórico e não são mais atualizados. 
                    Para ver o ranking atual, selecione a temporada ativa no rodapé da página.
                  </>
                )}
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}