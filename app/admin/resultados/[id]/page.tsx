'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft, Plus, Save, Trash2, Trophy, Calendar, MapPin,
  User, Award, Loader2, CheckCircle, Edit2, X
} from 'lucide-react';
import ProtectedRoute from '@/components/admin/ProtectedRoute';
import { verificarAdmin } from '@/lib/auth';
import { supabase } from '@/lib/supabase';
import { getJogadores } from '@/lib/api';
import { getConfigPontuacaoAtiva } from '@/lib/pontuacao';
import { Torneio, Jogador, Categoria, ConfiguracaoPontuacao } from '@/types/database';

interface ResultadoForm {
  id: string;
  jogador_id: string;
  jogador_nome: string;
  categoria: Categoria;
  colocacao: string;
  pontos_ganhos: number;
}

interface ResultadoExistente {
  id: string;
  jogador_id: string;
  colocacao: string;
  pontos_ganhos: number;
  categoria_jogada: Categoria;
  jogadores: {
    nome: string;
    categoria: Categoria;
    pontos: number;
    torneios_disputados: number;
  };
}

export default function RegistrarResultadosPage({ params }: { params: { id: string } }) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [torneio, setTorneio] = useState<Torneio | null>(null);
  const [jogadores, setJogadores] = useState<Jogador[]>([]);
  const [configPontuacao, setConfigPontuacao] = useState<ConfiguracaoPontuacao | null>(null);
  const [resultados, setResultados] = useState<ResultadoForm[]>([]);
  const [resultadosExistentes, setResultadosExistentes] = useState<ResultadoExistente[]>([]);
  const [editandoId, setEditandoId] = useState<string | null>(null);
  const [editandoColocacao, setEditandoColocacao] = useState<string>('');
  const router = useRouter();

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
        jogadores:jogador_id (nome, categoria, pontos, torneios_disputados)
      `)
      .eq('torneio_id', params.id);

    setTorneio(torneioData);
    setConfigPontuacao(config);
    setJogadores(jogadoresData);
    setResultadosExistentes(resultadosData || []);
    setResultados([]);
    setLoading(false);
  };

  const calcularPontos = (colocacao: string): number => {
    const pontuacao = torneio?.pontuacao_custom || configPontuacao;
    
    if (!pontuacao) return 0;

    const mapa: Record<string, keyof typeof pontuacao> = {
      'Campeão': 'campeao',
      'Vice': 'vice',
      '3º Lugar': 'terceiro',
      'Quartas de Final': 'quartas',
      'Oitavas de Final': 'oitavas',
      'Participação': 'participacao',
    };
    
    const chave = mapa[colocacao];
    return chave ? (pontuacao[chave] as number) : 0;
  };

  // ==================== NOVOS RESULTADOS ====================

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

        if (field === 'jogador_id') {
          const jogador = jogadores.find(j => j.id === value);
          if (jogador) {
            updated.jogador_nome = jogador.nome;
            updated.categoria = jogador.categoria;
          }
        }

        if (field === 'colocacao' || field === 'jogador_id') {
          if (updated.colocacao) {
            updated.pontos_ganhos = calcularPontos(updated.colocacao);
          }
        }

        return updated;
      }
      return r;
    }));
  };

  const handleSalvar = async () => {
    const resultadosValidos = resultados.filter(r => r.jogador_id && r.colocacao);
    
    if (resultadosValidos.length === 0) {
      alert('Adicione pelo menos um resultado!');
      return;
    }

    const jogadoresUnicos = new Set(resultadosValidos.map(r => r.jogador_id));
    if (jogadoresUnicos.size !== resultadosValidos.length) {
      alert('Não pode haver jogadores duplicados!');
      return;
    }

    setSaving(true);

    try {
      const resultadosParaInserir = resultadosValidos.map(r => ({
        torneio_id: params.id,
        jogador_id: r.jogador_id,
        colocacao: r.colocacao,
        pontos_ganhos: r.pontos_ganhos,
        categoria_jogada: r.categoria,
      }));

      const { error: insertError } = await supabase
        .from('resultados')
        .insert(resultadosParaInserir);

      if (insertError) throw insertError;

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

      if (torneio?.status !== 'realizado') {
        await supabase
          .from('torneios')
          .update({ status: 'realizado' })
          .eq('id', params.id);
      }

      alert(`${resultadosValidos.length} resultado(s) registrado(s) com sucesso!`);
      setSaving(false);
      await loadData();
      
    } catch (error: any) {
      alert(`Erro ao salvar: ${error.message}`);
      setSaving(false);
    }
  };

  // ==================== EDITAR RESULTADO ====================

  const iniciarEdicao = (resultado: ResultadoExistente) => {
    setEditandoId(resultado.id);
    setEditandoColocacao(resultado.colocacao);
  };

  const cancelarEdicao = () => {
    setEditandoId(null);
    setEditandoColocacao('');
  };

  const salvarEdicao = async (resultado: ResultadoExistente) => {
    if (!editandoColocacao) return;

    setSaving(true);

    try {
      const novaPontuacao = calcularPontos(editandoColocacao);
      const diferencaPontos = novaPontuacao - resultado.pontos_ganhos;

      // Atualizar resultado
      const { error: updateError } = await supabase
        .from('resultados')
        .update({
          colocacao: editandoColocacao,
          pontos_ganhos: novaPontuacao,
        })
        .eq('id', resultado.id);

      if (updateError) throw updateError;

      // Atualizar pontos do jogador
      await supabase
        .from('jogadores')
        .update({
          pontos: resultado.jogadores.pontos + diferencaPontos,
        })
        .eq('id', resultado.jogador_id);

      alert('Resultado atualizado com sucesso!');
      setEditandoId(null);
      setEditandoColocacao('');
      setSaving(false);
      await loadData();

    } catch (error: any) {
      alert(`Erro ao editar: ${error.message}`);
      setSaving(false);
    }
  };

  // ==================== EXCLUIR RESULTADO ====================

  const excluirResultado = async (resultado: ResultadoExistente) => {
    if (!confirm(`Tem certeza que deseja excluir o resultado de ${resultado.jogadores.nome}?`)) {
      return;
    }

    setSaving(true);

    try {
      // Excluir resultado
      const { error: deleteError } = await supabase
        .from('resultados')
        .delete()
        .eq('id', resultado.id);

      if (deleteError) throw deleteError;

      // Atualizar jogador (diminuir pontos e torneios disputados)
      await supabase
        .from('jogadores')
        .update({
          pontos: resultado.jogadores.pontos - resultado.pontos_ganhos,
          torneios_disputados: resultado.jogadores.torneios_disputados - 1,
        })
        .eq('id', resultado.jogador_id);

      alert('Resultado excluído com sucesso!');
      setSaving(false);
      await loadData();

    } catch (error: any) {
      alert(`Erro ao excluir: ${error.message}`);
      setSaving(false);
    }
  };

  // ==================== RENDER ====================

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
                  <h1 className="text-xl font-bold text-gray-900">Gerenciar Resultados</h1>
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
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-8">
              <div className="bg-gradient-to-r from-green-500 to-emerald-600 px-6 py-4">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-6 h-6 text-white" />
                  <div>
                    <h3 className="font-bold text-white">
                      Resultados Cadastrados ({resultadosExistentes.length})
                    </h3>
                    <p className="text-sm text-green-100">
                      Clique em Editar ✏️ para alterar ou Excluir 🗑️ para remover
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-6 space-y-3">
                {resultadosExistentes.map((r) => (
                  <div key={r.id} className="bg-gray-50 rounded-lg border-2 border-gray-200 p-4">
                    {editandoId === r.id ? (
                      // MODO EDIÇÃO
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
                          <div className="md:col-span-4">
                            <div className="font-semibold text-gray-900">{r.jogadores.nome}</div>
                            <div className="text-sm text-gray-500">Cat. {r.jogadores.categoria}</div>
                          </div>

                          <div className="md:col-span-4">
                            <label className="block text-xs font-semibold text-gray-600 mb-1">
                              Nova Colocação
                            </label>
                            <select
                              value={editandoColocacao}
                              onChange={(e) => setEditandoColocacao(e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                            >
                              {colocacoes.map(col => (
                                <option key={col} value={col}>{col}</option>
                              ))}
                            </select>
                          </div>

                          <div className="md:col-span-2">
                            <label className="block text-xs font-semibold text-gray-600 mb-1">
                              Novos Pontos
                            </label>
                            <div className="px-3 py-2 bg-primary-50 border border-primary-200 rounded-lg text-center">
                              <span className="font-bold text-primary-600">
                                {calcularPontos(editandoColocacao)}
                              </span>
                            </div>
                          </div>

                          <div className="md:col-span-2 flex gap-2">
                            <button
                              onClick={() => salvarEdicao(r)}
                              disabled={saving}
                              className="flex-1 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold text-sm disabled:opacity-50"
                            >
                              {saving ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : '✓'}
                            </button>
                            <button
                              onClick={cancelarEdicao}
                              disabled={saving}
                              className="flex-1 px-3 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors font-semibold text-sm"
                            >
                              <X className="w-4 h-4 mx-auto" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      // MODO VISUALIZAÇÃO
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 flex-1">
                          <span className="font-semibold text-gray-900">{r.jogadores.nome}</span>
                          <span className="text-gray-400">•</span>
                          <span className={`font-bold text-sm ${
                            r.jogadores.categoria === 'A' ? 'text-red-600' :
                            r.jogadores.categoria === 'B' ? 'text-orange-600' :
                            r.jogadores.categoria === 'C' ? 'text-yellow-600' :
                            r.jogadores.categoria === 'D' ? 'text-green-600' :
                            'text-blue-600'
                          }`}>
                            Cat. {r.jogadores.categoria}
                          </span>
                          <span className="text-gray-400">•</span>
                          <span className="text-gray-700">{r.colocacao}</span>
                          <span className="text-gray-400">•</span>
                          <span className="font-bold text-primary-600">{r.pontos_ganhos} pts</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => iniciarEdicao(r)}
                            disabled={saving}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Editar"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => excluirResultado(r)}
                            disabled={saving}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Excluir"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Formulário Novos Resultados */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6">
            <div className="bg-gradient-to-r from-primary-500 to-primary-600 px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                    <Plus className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white">Adicionar Novos Resultados</h3>
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
                    Não há mais jogadores disponíveis. Use Editar ✏️ para modificar resultados.
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
                    Adicionar Resultado
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {resultados.map((resultado, index) => (
                    <div key={resultado.id} className="bg-gray-50 rounded-lg border-2 border-gray-200 p-4">
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
                        <div className="md:col-span-1">
                          <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold">{index + 1}</span>
                          </div>
                        </div>

                        <div className="md:col-span-4">
                          <label className="block text-xs font-semibold text-gray-600 mb-1">
                            Jogador *
                          </label>
                          <select
                            value={resultado.jogador_id}
                            onChange={(e) => atualizarResultado(resultado.id, 'jogador_id', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 text-sm"
                            required
                          >
                            <option value="">Selecione...</option>
                            {resultado.jogador_id && !jogadoresDisponiveis.find(j => j.id === resultado.jogador_id) && (
                              <option value={resultado.jogador_id}>
                                {resultado.jogador_nome} - Cat. {resultado.categoria}
                              </option>
                            )}
                            {jogadoresDisponiveis.map(jogador => (
                              <option key={jogador.id} value={jogador.id}>
                                {jogador.nome} - Cat. {jogador.categoria}
                              </option>
                            ))}
                          </select>
                        </div>

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

                        <div className="md:col-span-3">
                          <label className="block text-xs font-semibold text-gray-600 mb-1">
                            Colocação *
                          </label>
                          <select
                            value={resultado.colocacao}
                            onChange={(e) => atualizarResultado(resultado.id, 'colocacao', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 text-sm"
                            required
                          >
                            {colocacoes.map(col => (
                              <option key={col} value={col}>{col}</option>
                            ))}
                          </select>
                        </div>

                        <div className="md:col-span-2">
                          <label className="block text-xs font-semibold text-gray-600 mb-1">
                            Pontos
                          </label>
                          <div className="px-3 py-2 bg-primary-50 border border-primary-200 rounded-lg text-center">
                            <span className="font-bold text-primary-600">{resultado.pontos_ganhos}</span>
                          </div>
                        </div>

                        <div className="md:col-span-1">
                          <button
                            type="button"
                            onClick={() => removerResultado(resultado.id)}
                            className="w-full h-10 flex items-center justify-center bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Botões */}
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
                className="flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-semibold disabled:opacity-50"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    Salvar Novos Resultados ({resultados.length})
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