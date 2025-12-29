'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Users, AlertTriangle, Loader2, CheckCircle, GitMerge, X, RotateCcw } from 'lucide-react';
import ProtectedRoute from '@/components/admin/ProtectedRoute';
import { verificarAdmin } from '@/lib/auth';
import { supabase } from '@/lib/supabase';

interface Jogador {
  id: string;
  nome: string;
  email?: string;
  telefone?: string;
  cidade?: string;
  categoria: string;
  genero: string;
  pontos: number;
  torneios_disputados: number;
  created_at: string;
}

interface DuplicataGrupo {
  jogadores: Jogador[];
  similaridade: number;
}

export default function MesclarJogadoresPage() {
  const [loading, setLoading] = useState(true);
  const [mesclando, setMesclando] = useState(false);
  const [duplicatas, setDuplicatas] = useState<DuplicataGrupo[]>([]);
  const [jogadores, setJogadores] = useState<Jogador[]>([]);
  const [gruposIgnorados, setGruposIgnorados] = useState<number[]>([]);
  const [abaAtiva, setAbaAtiva] = useState<'pendentes' | 'ignorados'>('pendentes');
  const router = useRouter();

  useEffect(() => {
    // Carregar grupos ignorados do localStorage
    const ignoradosSalvos = localStorage.getItem('gruposIgnorados');
    if (ignoradosSalvos) {
      try {
        const indices = JSON.parse(ignoradosSalvos);
        setGruposIgnorados(indices);
      } catch (error) {
        console.error('Erro ao carregar grupos ignorados:', error);
      }
    }
    
    loadData();
  }, []);

  const loadData = async () => {
    const { isAdmin } = await verificarAdmin();
    if (!isAdmin) {
      router.push('/admin/login');
      return;
    }

    setLoading(true);

    // Buscar todos os jogadores
    const { data, error } = await supabase
      .from('jogadores')
      .select('*')
      .order('nome');

    if (error) {
      console.error('Erro ao carregar jogadores:', error);
      setLoading(false);
      return;
    }

    setJogadores(data || []);
    
    // Detectar duplicatas
    const grupos = detectarDuplicatas(data || []);
    setDuplicatas(grupos);
    setLoading(false);
  };

  // Algoritmo de detecção de similaridade
  const calcularSimilaridade = (nome1: string, nome2: string): number => {
    const n1 = nome1.toLowerCase().trim();
    const n2 = nome2.toLowerCase().trim();

    // Exatamente igual
    if (n1 === n2) return 100;

    // Remover acentos para comparação
    const removeAcentos = (str: string) => 
      str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    
    const n1Clean = removeAcentos(n1);
    const n2Clean = removeAcentos(n2);

    if (n1Clean === n2Clean) return 95;

    // Quebrar em palavras
    const palavras1 = n1Clean.split(' ').filter(p => p.length > 2);
    const palavras2 = n2Clean.split(' ').filter(p => p.length > 2);

    if (palavras1.length === 0 || palavras2.length === 0) return 0;

    // Contar palavras em comum
    let palavrasComum = 0;
    palavras1.forEach(p1 => {
      if (palavras2.some(p2 => p2 === p1 || p2.startsWith(p1) || p1.startsWith(p2))) {
        palavrasComum++;
      }
    });

    const percentual = (palavrasComum / Math.max(palavras1.length, palavras2.length)) * 100;

    // Se tem pelo menos 2 palavras em comum e percentual alto
    if (palavrasComum >= 2 && percentual >= 60) {
      return percentual;
    }

    return 0;
  };

  const detectarDuplicatas = (jogadores: Jogador[]): DuplicataGrupo[] => {
    const grupos: DuplicataGrupo[] = [];
    const processados = new Set<string>();

    for (let i = 0; i < jogadores.length; i++) {
      if (processados.has(jogadores[i].id)) continue;

      const grupo: Jogador[] = [jogadores[i]];
      processados.add(jogadores[i].id);

      for (let j = i + 1; j < jogadores.length; j++) {
        if (processados.has(jogadores[j].id)) continue;

        const similaridade = calcularSimilaridade(jogadores[i].nome, jogadores[j].nome);

        if (similaridade >= 60) {
          grupo.push(jogadores[j]);
          processados.add(jogadores[j].id);
        }
      }

      if (grupo.length > 1) {
        const maxSimilaridade = Math.max(
          ...grupo.slice(1).map(j => calcularSimilaridade(grupo[0].nome, j.nome))
        );
        grupos.push({ jogadores: grupo, similaridade: maxSimilaridade });
      }
    }

    return grupos.sort((a, b) => b.similaridade - a.similaridade);
  };

  const mesclarJogadores = async (manter: Jogador, remover: Jogador[]) => {
    if (!confirm(`Tem certeza que deseja mesclar ${remover.length} jogador(es) em "${manter.nome}"?\n\nEsta ação NÃO pode ser desfeita!`)) {
      return;
    }

    setMesclando(true);

    try {
      const idsRemover = remover.map(j => j.id);

      // 1. Transferir todos os resultados
      const { error: resultadosError } = await supabase
        .from('resultados')
        .update({ jogador_id: manter.id })
        .in('jogador_id', idsRemover);

      if (resultadosError) throw resultadosError;

      // 2. Transferir histórico de categorias
      const { error: historicoError } = await supabase
        .from('historico_categorias')
        .update({ jogador_id: manter.id })
        .in('jogador_id', idsRemover);

      if (historicoError) throw historicoError;

      // 3. Recalcular categoria e pontos do jogador mantido
      const { error: recalcError } = await supabase
        .rpc('recalcular_categoria_jogador', { p_jogador_id: manter.id });

      if (recalcError) throw recalcError;

      // 4. Deletar jogadores removidos
      const { error: deleteError } = await supabase
        .from('jogadores')
        .delete()
        .in('id', idsRemover);

      if (deleteError) throw deleteError;

      alert(`✅ Mesclagem concluída com sucesso!\n\n${remover.length} jogador(es) mesclado(s) em "${manter.nome}"`);
      
      // Limpar grupos ignorados do localStorage (vamos redetectar tudo)
      localStorage.removeItem('gruposIgnorados');
      
      // Recarregar dados
      loadData();

    } catch (error: any) {
      console.error('Erro ao mesclar:', error);
      alert(`❌ Erro ao mesclar jogadores: ${error.message}`);
    }

    setMesclando(false);
  };

  const ignorarGrupo = (indice: number) => {
    setGruposIgnorados(prev => {
      const novo = [...prev, indice];
      // Salvar no localStorage
      localStorage.setItem('gruposIgnorados', JSON.stringify(novo));
      return novo;
    });
  };

  const restaurarGrupo = (indice: number) => {
    setGruposIgnorados(prev => {
      const novo = prev.filter(i => i !== indice);
      // Salvar no localStorage
      localStorage.setItem('gruposIgnorados', JSON.stringify(novo));
      return novo;
    });
    setAbaAtiva('pendentes');
  };

  const limparTodosIgnorados = () => {
    if (!confirm('Tem certeza que deseja restaurar TODOS os grupos ignorados?')) {
      return;
    }
    setGruposIgnorados([]);
    localStorage.removeItem('gruposIgnorados');
    setAbaAtiva('pendentes');
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-primary-600 animate-spin" />
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
                  <h1 className="text-xl font-bold text-gray-900">Mesclar Jogadores</h1>
                  <p className="text-xs text-gray-500">Detectar e mesclar jogadores duplicados</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">{jogadores.length}</div>
                  <div className="text-sm text-gray-500">Total de Jogadores</div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-yellow-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">
                    {duplicatas.filter((_, idx) => !gruposIgnorados.includes(idx)).length}
                  </div>
                  <div className="text-sm text-gray-500">Grupos Duplicados</div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">
                    {jogadores.length - duplicatas
                      .filter((_, idx) => !gruposIgnorados.includes(idx))
                      .reduce((acc, g) => acc + g.jogadores.length - 1, 0)}
                  </div>
                  <div className="text-sm text-gray-500">Após Mesclagem</div>
                </div>
              </div>
            </div>
          </div>

          {/* Abas */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
            <div className="flex border-b border-gray-200">
              <button
                onClick={() => setAbaAtiva('pendentes')}
                className={`flex-1 px-6 py-4 text-sm font-bold transition-colors ${
                  abaAtiva === 'pendentes'
                    ? 'text-primary-600 border-b-2 border-primary-600 bg-primary-50'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Pendentes ({duplicatas.filter((_, idx) => !gruposIgnorados.includes(idx)).length})</span>
                </div>
              </button>
              <button
                onClick={() => setAbaAtiva('ignorados')}
                className={`flex-1 px-6 py-4 text-sm font-bold transition-colors ${
                  abaAtiva === 'ignorados'
                    ? 'text-gray-600 border-b-2 border-gray-600 bg-gray-50'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <X className="w-4 h-4" />
                  <span>Ignorados ({gruposIgnorados.length})</span>
                </div>
              </button>
            </div>
          </div>

          {/* Duplicatas Pendentes */}
          {abaAtiva === 'pendentes' && (
            <>
              {duplicatas.filter((_, idx) => !gruposIgnorados.includes(idx)).length === 0 ? (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                  <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    Nenhuma duplicata pendente!
                  </h3>
                  <p className="text-gray-600">
                    Todos os grupos foram processados ou ignorados.
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {duplicatas.map((grupo, idx) => {
                    if (gruposIgnorados.includes(idx)) return null;
                    
                    return (
                      <div key={idx} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        {/* Header do Grupo */}
                        <div className="bg-yellow-50 border-b border-yellow-100 px-6 py-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <AlertTriangle className="w-5 h-5 text-yellow-600" />
                              <div>
                                <h3 className="font-bold text-gray-900">
                                  Grupo {idx + 1} - Similaridade: {Math.round(grupo.similaridade)}%
                                </h3>
                                <p className="text-sm text-gray-600">
                                  Escolha qual jogador manter (os demais serão mesclados nele)
                                </p>
                              </div>
                            </div>
                            <button
                              onClick={() => ignorarGrupo(idx)}
                              className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors text-sm font-medium"
                              title="Ignorar este grupo (não são duplicatas)"
                            >
                              <X className="w-4 h-4" />
                              Ignorar
                            </button>
                          </div>
                        </div>

                        {/* Lista de Jogadores */}
                        <div className="p-6">
                          <div className="space-y-4">
                            {grupo.jogadores.map((jogador) => (
                              <div
                                key={jogador.id}
                                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                              >
                                <div className="flex-1">
                                  <div className="font-semibold text-gray-900">{jogador.nome}</div>
                                  <div className="text-sm text-gray-500 flex items-center gap-4 mt-1">
                                    <span>{jogador.categoria} • {jogador.genero}</span>
                                    <span>•</span>
                                    <span>{jogador.pontos} pts</span>
                                    <span>•</span>
                                    <span>{jogador.torneios_disputados} torneios</span>
                                    {jogador.email && (
                                      <>
                                        <span>•</span>
                                        <span>{jogador.email}</span>
                                      </>
                                    )}
                                  </div>
                                </div>

                                <button
                                  onClick={() => mesclarJogadores(jogador, grupo.jogadores.filter(j => j.id !== jogador.id))}
                                  disabled={mesclando}
                                  className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
                                >
                                  {mesclando ? (
                                    <>
                                      <Loader2 className="w-4 h-4 animate-spin" />
                                      Mesclando...
                                    </>
                                  ) : (
                                    <>
                                      <GitMerge className="w-4 h-4" />
                                      Manter este
                                    </>
                                  )}
                                </button>
                              </div>
                            ))}
                          </div>

                          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                            <p className="text-sm text-blue-900">
                              <strong>💡 Como funciona:</strong> Clique em &ldquo;Manter este&rdquo; no jogador que deseja preservar. 
                              Todos os resultados e torneios dos outros jogadores serão transferidos para ele, 
                              e os jogadores duplicados serão removidos.
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          )}

          {/* Duplicatas Ignoradas */}
          {abaAtiva === 'ignorados' && (
            <>
              {gruposIgnorados.length === 0 ? (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                  <CheckCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    Nenhum grupo ignorado
                  </h3>
                  <p className="text-gray-600">
                    Grupos ignorados aparecerão aqui.
                  </p>
                </div>
              ) : (
                <>
                  {/* Botão Restaurar Todos */}
                  <div className="mb-6 flex justify-end">
                    <button
                      onClick={limparTodosIgnorados}
                      className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-semibold"
                    >
                      <RotateCcw className="w-4 h-4" />
                      Restaurar Todos
                    </button>
                  </div>

                  <div className="space-y-6">
                  {duplicatas.map((grupo, idx) => {
                    if (!gruposIgnorados.includes(idx)) return null;
                    
                    return (
                      <div key={idx} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden opacity-75">
                        {/* Header do Grupo */}
                        <div className="bg-gray-50 border-b border-gray-200 px-6 py-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <X className="w-5 h-5 text-gray-600" />
                              <div>
                                <h3 className="font-bold text-gray-900">
                                  Grupo {idx + 1} - Similaridade: {Math.round(grupo.similaridade)}%
                                </h3>
                                <p className="text-sm text-gray-600">
                                  Este grupo foi marcado como não duplicado
                                </p>
                              </div>
                            </div>
                            <button
                              onClick={() => restaurarGrupo(idx)}
                              className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors text-sm font-medium"
                              title="Restaurar para pendentes"
                            >
                              <RotateCcw className="w-4 h-4" />
                              Restaurar
                            </button>
                          </div>
                        </div>

                        {/* Lista de Jogadores */}
                        <div className="p-6">
                          <div className="space-y-4">
                            {grupo.jogadores.map((jogador) => (
                              <div
                                key={jogador.id}
                                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg bg-gray-50"
                              >
                                <div className="flex-1">
                                  <div className="font-semibold text-gray-900">{jogador.nome}</div>
                                  <div className="text-sm text-gray-500 flex items-center gap-4 mt-1">
                                    <span>{jogador.categoria} • {jogador.genero}</span>
                                    <span>•</span>
                                    <span>{jogador.pontos} pts</span>
                                    <span>•</span>
                                    <span>{jogador.torneios_disputados} torneios</span>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  </div>
                </>
              )}
            </>
          )}
        </main>
      </div>
    </ProtectedRoute>
  );
}