'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { verificarAdmin } from '@/lib/auth';
import ProtectedRoute from '@/components/admin/ProtectedRoute';

interface Configuracao {
  id: string;
  nome: string;
  descricao?: string;
  campeao: number;
  vice: number;
  terceiro: number;
  quartas: number;
  oitavas: number;
  participacao: number;
}

export default function EditarTorneioPage({ params }: { params: { id: string } }) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [configuracoes, setConfiguracoes] = useState<Configuracao[]>([]);
  const [configSelecionada, setConfigSelecionada] = useState<string>('');
  
  const [formData, setFormData] = useState({
    nome: '',
    data: '',
    local: '',
    cidade: '',
    status: 'confirmado' as 'confirmado' | 'em_andamento' | 'realizado',
  });

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

    // Buscar configurações disponíveis
    const { data: configsData } = await supabase
      .from('config_pontuacao')
      .select('*')
      .order('nome', { ascending: true });

    if (configsData) {
      setConfiguracoes(configsData);
    }

    // Buscar torneio
    const { data: torneioData, error } = await supabase
      .from('torneios')
      .select('*')
      .eq('id', params.id)
      .single();

    if (error || !torneioData) {
      alert('Torneio não encontrado!');
      router.push('/admin/torneios');
      return;
    }

    setFormData({
      nome: torneioData.nome,
      data: torneioData.data,
      local: torneioData.local,
      cidade: torneioData.cidade,
      status: torneioData.status,
    });

    // Selecionar config atual
    if (torneioData.config_pontuacao_id) {
      setConfigSelecionada(torneioData.config_pontuacao_id);
    }

    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      // Validação
      if (!configSelecionada) {
        alert('Selecione uma configuração de pontuação!');
        setSaving(false);
        return;
      }

      // Buscar a configuração selecionada
      const config = configuracoes.find(c => c.id === configSelecionada);
      if (!config) {
        alert('Configuração não encontrada!');
        setSaving(false);
        return;
      }

      // Preparar pontuação custom (cópia dos valores da config)
      const pontuacao_custom = {
        campeao: config.campeao,
        vice: config.vice,
        terceiro: config.terceiro,
        quartas: config.quartas,
        oitavas: config.oitavas,
        participacao: config.participacao,
      };

      // Atualizar torneio
      const { error } = await supabase
        .from('torneios')
        .update({
          ...formData,
          config_pontuacao_id: configSelecionada,
          pontuacao_custom: pontuacao_custom,
        })
        .eq('id', params.id);

      if (error) throw error;

      alert('Torneio atualizado com sucesso!');
      router.push('/admin/torneios');
    } catch (error: any) {
      alert(`Erro ao atualizar torneio: ${error.message}`);
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Carregando...</p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  const configAtual = configuracoes.find(c => c.id === configSelecionada);

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center gap-3">
                <Link
                  href="/admin/torneios"
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ArrowLeft className="w-5 h-5 text-gray-600" />
                </Link>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Editar Torneio</h1>
                  <p className="text-xs text-gray-500">Atualizar informações do torneio</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="space-y-6">
              {/* Informações Básicas */}
              <div>
                <h2 className="text-lg font-bold text-gray-900 mb-4">Informações do Torneio</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Nome */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Nome do Torneio *
                    </label>
                    <input
                      type="text"
                      value={formData.nome}
                      onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                      placeholder="Ex: Copa Baixada Santista 2025"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      required
                    />
                  </div>

                  {/* Data */}
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Data *
                    </label>
                    <input
                      type="date"
                      value={formData.data}
                      onChange={(e) => setFormData({ ...formData, data: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      required
                    />
                  </div>

                  {/* Status */}
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Status *
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      <option value="confirmado">Confirmado</option>
                      <option value="em_andamento">Em Andamento</option>
                      <option value="realizado">Realizado</option>
                    </select>
                  </div>

                  {/* Local */}
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Local *
                    </label>
                    <input
                      type="text"
                      value={formData.local}
                      onChange={(e) => setFormData({ ...formData, local: e.target.value })}
                      placeholder="Ex: Arena Beach Santos"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      required
                    />
                  </div>

                  {/* Cidade */}
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Cidade *
                    </label>
                    <input
                      type="text"
                      value={formData.cidade}
                      onChange={(e) => setFormData({ ...formData, cidade: e.target.value })}
                      placeholder="Ex: Santos"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Configuração de Pontuação */}
              <div className="border-t border-gray-200 pt-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Configuração de Pontuação</h2>
                
                {configuracoes.length === 0 ? (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <p className="text-yellow-800 text-sm">
                      ⚠️ Nenhuma configuração de pontuação cadastrada! 
                      <Link href="/admin/configuracoes" className="font-bold underline ml-1">
                        Crie uma configuração primeiro
                      </Link>
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="mb-4">
                      <label className="block text-sm font-bold text-gray-700 mb-2">
                        Selecione a Configuração de Pontuação *
                      </label>
                      <select
                        value={configSelecionada}
                        onChange={(e) => setConfigSelecionada(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        required
                      >
                        <option value="">Escolha uma configuração...</option>
                        {configuracoes.map((config) => (
                          <option key={config.id} value={config.id}>
                            {config.nome} {config.descricao ? `- ${config.descricao}` : ''}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Preview da configuração */}
                    {configAtual && (
                      <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
                        <h3 className="font-bold text-primary-900 mb-3">
                          📊 Pontuação que será usada: {configAtual.nome}
                        </h3>
                        {configAtual.descricao && (
                          <p className="text-sm text-primary-800 mb-3">{configAtual.descricao}</p>
                        )}
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
                          <div className="bg-white rounded-lg p-3 border border-primary-200">
                            <div className="text-xs text-gray-600 mb-1">🥇 Campeão</div>
                            <div className="text-lg font-bold text-primary-600">{configAtual.campeao}</div>
                          </div>
                          <div className="bg-white rounded-lg p-3 border border-primary-200">
                            <div className="text-xs text-gray-600 mb-1">🥈 Vice</div>
                            <div className="text-lg font-bold text-primary-600">{configAtual.vice}</div>
                          </div>
                          <div className="bg-white rounded-lg p-3 border border-primary-200">
                            <div className="text-xs text-gray-600 mb-1">🥉 3º Lugar</div>
                            <div className="text-lg font-bold text-primary-600">{configAtual.terceiro}</div>
                          </div>
                          <div className="bg-white rounded-lg p-3 border border-primary-200">
                            <div className="text-xs text-gray-600 mb-1">Quartas</div>
                            <div className="text-lg font-bold text-primary-600">{configAtual.quartas}</div>
                          </div>
                          <div className="bg-white rounded-lg p-3 border border-primary-200">
                            <div className="text-xs text-gray-600 mb-1">Oitavas</div>
                            <div className="text-lg font-bold text-primary-600">{configAtual.oitavas}</div>
                          </div>
                          <div className="bg-white rounded-lg p-3 border border-primary-200">
                            <div className="text-xs text-gray-600 mb-1">Participação</div>
                            <div className="text-lg font-bold text-primary-600">{configAtual.participacao}</div>
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Botões */}
              <div className="flex justify-end gap-3 pt-6">
                <Link
                  href="/admin/torneios"
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
                >
                  Cancelar
                </Link>
                <button
                  type="submit"
                  disabled={saving || configuracoes.length === 0}
                  className="flex items-center gap-2 px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Save className="w-4 h-4" />
                  {saving ? 'Salvando...' : 'Salvar Alterações'}
                </button>
              </div>
            </div>
          </form>
        </main>
      </div>
    </ProtectedRoute>
  );
}