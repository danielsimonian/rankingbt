'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft, Plus, Save, Trash2, Trophy, Calendar, MapPin,
  User, Award, Loader2, CheckCircle
} from 'lucide-react';
import ProtectedRoute from '@/components/admin/ProtectedRoute';
import { verificarAdmin } from '@/lib/auth';
import { supabase } from '@/lib/supabase';
import { getJogadores } from '@/lib/api';
import { getConfigPontuacaoAtiva, calcularPontosPorColocacao } from '@/lib/pontuacao';
import { Torneio, Jogador, Categoria, ConfiguracaoPontuacao } from '@/types/database';
interface ResultadoForm {
  id: string;
  jogador_id: string;
  jogador_nome: string;
  categoria: Categoria;
  colocacao: string;
  pontos_ganhos: number;
}

export default function RegistrarResultadosPage({ params }: { params: { id: string } }) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [torneio, setTorneio] = useState<Torneio | null>(null);
  const [jogadores, setJogadores] = useState<Jogador[]>([]);
  const [configPontuacao, setConfigPontuacao] = useState<ConfiguracaoPontuacao | null>(null);
  const [resultados, setResultados] = useState<ResultadoForm[]>([]);
  const [resultadosExistentes, setResultadosExistentes] = useState<any[]>([]);
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

    // Buscar torneio
    const { data: torneioData, error: torneioError } = await supabase
      .from('torneios')
      .select('*')
      .eq('id', params.id)
      .single();

    if (torneioError || !torneioData) {
      alert('Torneio não encontrado!');
      router.push('/admin/resultados');
      return;
    }

    // Buscar config de pontuação
    const config = await getConfigPontuacaoAtiva();

    // Buscar jogadores
    const jogadoresData = await getJogadores();

    // Buscar resultados já existentes
    const { data: resultadosData } = await supabase
      .from('resultados')
      .select(`
        *,
        jogadores:jogador_id (nome, categoria)
      `)
      .eq('torneio_id', params.id);

    setTorneio(torneioData);
    setConfigPontuacao(config);
    setJogadores(jogadoresData);
    setResultadosExistentes(resultadosData || []);
    setResultados([]); // Sempre começar com formulário vazio
    setLoading(false);
  };

  const adicionarResultado = () => {
    const novoId = `temp-${Date.now()}`;
    setResultados([...resultados, {
      id: novoId,
      jogador_id: '',
      jogador_nome: '',
      categoria: 'FUN' as Categoria,
      colocacao: 'Campeão',
      pontos_ganhos: 0,
    }]);
  };

  const removerResultado = (id: string) => {
    setResultados(resultados.filter(r => r.id !== id));
  };

  const atualizarResultado = (id: string, field: string, value: any) => {
    setResultados(resultados.map(r => {
      if (r.id === id) {
        const updated = { ...r, [field]: value };

        // Se mudou jogador, atualizar nome e categoria
        if (field === 'jogador_id') {
          const jogador = jogadores.find(j => j.id === value);
          if (jogador) {
            updated.jogador_nome = jogador.nome;
            updated.categoria = jogador.categoria;
          }
        }

// Recalcular pontos se mudou colocação ou jogador
if (field === 'colocacao' || field === 'jogador_id') {
  if (updated.colocacao && torneio) {
    // ✅ USA PONTUAÇÃO DO TORNEIO (pontuacao_custom)
    const pontuacao = torneio.pontuacao_custom || configPontuacao;
    
    if (pontuacao) {
      // Mapear colocação para pontos
      const mapa: Record<string, keyof typeof pontuacao> = {
        'Campeão': 'campeao',
        'Vice': 'vice',
        '3º Lugar': 'terceiro',
        'Quartas de Final': 'quartas',
        'Oitavas de Final': 'oitavas',
        'Participação': 'participacao',
      };
      
      const chave = mapa[updated.colocacao];
      updated.pontos_ganhos = chave ? pontuacao[chave] : 0;
    }
  }
}

        return updated;
      }
      return r;
    }));
  };

  const handleSalvar = async () => {
    // Validar
    const resultadosValidos = resultados.filter(r => r.jogador_id && r.colocacao);
    
    if (resultadosValidos.length === 0) {
      alert('Adicione pelo menos um resultado!');
      return;
    }

    // Verificar duplicatas
    const jogadoresUnicos = new Set(resultadosValidos.map(r => r.jogador_id));
    if (jogadoresUnicos.size !== resultadosValidos.length) {
      alert('Não pode haver jogadores duplicados!');
      return;
    }

    setSaving(true);

    try {
      // Preparar dados para inserir
      const resultadosParaInserir = resultadosValidos.map(r => ({
        torneio_id: params.id,
        jogador_id: r.jogador_id,
        colocacao: r.colocacao,
        pontos_ganhos: r.pontos_ganhos,
        categoria_jogada: r.categoria,
      }));

      // Inserir resultados
      const { error: insertError } = await supabase
        .from('resultados')
        .insert(resultadosParaInserir);

      if (insertError) {
        throw insertError;
      }

      // Atualizar pontos e torneios_disputados dos jogadores
      for (const resultado of resultadosValidos) {
        const jogador = jogadores.find(j => j.id === resultado.jogador_id);
        if (jogador) {
          await supabase
            .from('jogadores')
            .update({
              pontos: jogador.pontos + resultado.pontos_ganhos,
              torneios_disputados: jogador.torneios_disputados + 1,
            })
            .eq('id', resultado.jogador_id);
        }
      }

      // Atualizar status do torneio para "realizado" se ainda não estiver
      if (torneio?.status !== 'realizado') {
        await supabase
          .from('torneios')
          .update({ status: 'realizado' })
          .eq('id', params.id);
      }

      alert(`${resultadosValidos.length} resultado(s) registrado(s) com sucesso!\n\nRanking atualizado!`);
      
      // Limpar formulário e recarregar
      setSaving(false);
      await loadData();
      
    } catch (error: any) {
      alert(`Erro ao salvar: ${error.message}`);
      setSaving(false);
    }
  };

  // Filtrar jogadores já adicionados
  const getJogadoresDisponiveis = () => {
    const jogadoresAdicionados = new Set([
      ...resultados.map(r => r.jogador_id),
      ...resultadosExistentes.map(r => r.jogador_id)
    ]);
    return jogadores.filter(j => !jogadoresAdicionados.has(j.id));
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Carregando torneio...</p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  const colocacoes = [
    'Campeão',
    'Vice',
    '3º Lugar',
    'Quartas de Final',
    'Oitavas de Final',
    'Participação',
  ];

  const jogadoresDisponiveis = getJogadoresDisponiveis();

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center gap-3">
                <Link
                  href="/admin/resultados"
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ArrowLeft className="w-5 h-5 text-gray-600" />
                </Link>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Registrar Resultados</h1>
                  <p className="text-xs text-gray-500">{torneio?.nome}</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Info do Torneio */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center flex-shrink-0">
                <Trophy className="w-8 h-8 text-white" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900 mb-3">{torneio?.nome}</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Calendar className="w-4 h-4 text-primary-600" />
                    <span>
                      {torneio && new Date(torneio.data).toLocaleDateString('pt-BR', {
                        day: '2-digit',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <MapPin className="w-4 h-4 text-primary-600" />
                    <span>{torneio?.local}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Award className="w-4 h-4 text-primary-600" />
                    <span>{torneio?.cidade}</span>
                  </div>
                </div>

                {torneio?.pontuacao_custom && (
                  <div className="mt-3 inline-flex items-center gap-2 px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-bold">
                    ⭐ Pontuação Especial Ativa
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Resultados Existentes */}
          {resultadosExistentes.length > 0 && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-6 mb-8">
              <div className="flex items-start gap-3 mb-4">
                <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
                <div className="flex-1">
                  <h3 className="font-bold text-green-900 mb-2">
                    Resultados já registrados ({resultadosExistentes.length})
                  </h3>
                  <p className="text-sm text-green-800 mb-3">
                    Este torneio já possui resultados cadastrados. Você pode adicionar mais resultados abaixo.
                  </p>
                  <div className="space-y-2">
                    {resultadosExistentes.map((r: any) => (
                      <div key={r.id} className="bg-white rounded-lg p-3 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="font-semibold text-gray-900">{r.jogadores?.nome}</span>
                          <span className="text-gray-500">•</span>
                          <span className={`font-bold text-sm ${
                            r.jogadores?.categoria === 'A' ? 'text-red-600' :
                            r.jogadores?.categoria === 'B' ? 'text-orange-600' :
                            r.jogadores?.categoria === 'C' ? 'text-yellow-600' :
                            r.jogadores?.categoria === 'D' ? 'text-green-600' :
                            'text-blue-600'
                          }`}>
                            Cat. {r.jogadores?.categoria}
                          </span>
                          <span className="text-gray-500">•</span>
                          <span className="text-gray-600">{r.colocacao}</span>
                        </div>
                        <span className="font-bold text-primary-600">{r.pontos_ganhos} pts</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Formulário de Resultados */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6">
            <div className="bg-gradient-to-r from-primary-500 to-primary-600 px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white">Adicionar Resultados</h3>
                    <p className="text-sm text-primary-100">{resultados.length} novo(s) resultado(s)</p>
                  </div>
                </div>
                <button
                  onClick={adicionarResultado}
                  type="button"
                  disabled={jogadoresDisponiveis.length === 0}
                  className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Plus className="w-4 h-4" />
                  Adicionar Jogador
                </button>
              </div>
            </div>

            <div className="p-6">
              {jogadoresDisponiveis.length === 0 && resultados.length === 0 ? (
                <div className="text-center py-12">
                  <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Todos os jogadores já foram adicionados!
                  </h3>
                  <p className="text-gray-600">
                    Não há mais jogadores disponíveis para adicionar neste torneio.
                  </p>
                </div>
              ) : resultados.length === 0 ? (
                <div className="text-center py-12">
                  <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">Nenhum resultado novo adicionado</p>
                  <button
                    onClick={adicionarResultado}
                    type="button"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-semibold"
                  >
                    <Plus className="w-4 h-4" />
                    Adicionar Primeiro Resultado
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {resultados.map((resultado, index) => (
                    <div key={resultado.id} className="bg-gray-50 rounded-lg border-2 border-gray-200 p-4">
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
                        {/* Número */}
                        <div className="md:col-span-1">
                          <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold">{index + 1}</span>
                          </div>
                        </div>

                        {/* Jogador */}
                        <div className="md:col-span-4">
                          <label className="block text-xs font-semibold text-gray-600 mb-1">
                            Jogador *
                          </label>
                          <select
                            value={resultado.jogador_id}
                            onChange={(e) => atualizarResultado(resultado.id, 'jogador_id', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                            required
                          >
                            <option value="">Selecione o jogador...</option>
                            {/* Mostrar jogador atual se já foi selecionado */}
                            {resultado.jogador_id && !jogadoresDisponiveis.find(j => j.id === resultado.jogador_id) && (
                              <option value={resultado.jogador_id}>
                                {resultado.jogador_nome} - Cat. {resultado.categoria}
                              </option>
                            )}
                            {/* Mostrar apenas jogadores disponíveis */}
                            {jogadoresDisponiveis.map(jogador => (
                              <option key={jogador.id} value={jogador.id}>
                                {jogador.nome} - Cat. {jogador.categoria} ({jogador.genero})
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Categoria (exibição) */}
                        <div className="md:col-span-1">
                          <label className="block text-xs font-semibold text-gray-600 mb-1">
                            Cat.
                          </label>
                          <div className="px-2 py-2 bg-white border border-gray-300 rounded-lg text-center">
                            <span className={`font-bold text-sm ${
                              resultado.categoria === 'A' ? 'text-red-600' :
                              resultado.categoria === 'B' ? 'text-orange-600' :
                              resultado.categoria === 'C' ? 'text-yellow-600' :
                              resultado.categoria === 'D' ? 'text-green-600' :
                              'text-blue-600'
                            }`}>
                              {resultado.jogador_id ? resultado.categoria : '-'}
                            </span>
                          </div>
                        </div>

                        {/* Colocação */}
                        <div className="md:col-span-3">
                          <label className="block text-xs font-semibold text-gray-600 mb-1">
                            Colocação *
                          </label>
                          <select
                            value={resultado.colocacao}
                            onChange={(e) => atualizarResultado(resultado.id, 'colocacao', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                            required
                          >
                            {colocacoes.map(col => (
                              <option key={col} value={col}>{col}</option>
                            ))}
                          </select>
                        </div>

                        {/* Pontos */}
                        <div className="md:col-span-2">
                          <label className="block text-xs font-semibold text-gray-600 mb-1">
                            Pontos
                          </label>
                          <div className="px-3 py-2 bg-primary-50 border border-primary-200 rounded-lg text-center">
                            <span className="font-bold text-primary-600">{resultado.pontos_ganhos}</span>
                          </div>
                        </div>

                        {/* Remover */}
                        <div className="md:col-span-1">
                          <button
                            type="button"
                            onClick={() => removerResultado(resultado.id)}
                            className="w-full md:w-10 h-10 flex items-center justify-center bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                            title="Remover"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Resumo do Resultado */}
                      {resultado.jogador_id && (
                        <div className="mt-3 pt-3 border-t border-gray-200">
                          <div className="flex items-center gap-2 text-sm text-gray-700">
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            <span className="font-semibold">{resultado.jogador_nome}</span>
                            <span className="text-gray-400">•</span>
                            <span className={`font-bold ${
                              resultado.categoria === 'A' ? 'text-red-600' :
                              resultado.categoria === 'B' ? 'text-orange-600' :
                              resultado.categoria === 'C' ? 'text-yellow-600' :
                              resultado.categoria === 'D' ? 'text-green-600' :
                              'text-blue-600'
                            }`}>
                              Categoria {resultado.categoria}
                            </span>
                            <span className="text-gray-400">•</span>
                            <span>{resultado.colocacao}</span>
                            <span className="text-gray-400">•</span>
                            <span className="font-bold text-primary-600">{resultado.pontos_ganhos} pontos</span>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Ações */}
          {resultados.length > 0 && (
            <div className="flex items-center justify-end gap-3">
              <Link
                href="/admin/resultados"
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
              >
                Cancelar
              </Link>
              <button
                onClick={handleSalvar}
                disabled={saving}
                className="flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    Salvar Resultados ({resultados.length})
                  </>
                )}
              </button>
            </div>
          )}
        </main>
      </div>
    </ProtectedRoute>
  );
}