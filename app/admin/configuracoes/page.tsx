'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft, Plus, Save, Award, CheckCircle, Clock, Edit2, Trash2
} from 'lucide-react';
import ProtectedRoute from '@/components/admin/ProtectedRoute';
import { verificarAdmin } from '@/lib/auth';
import { supabase } from '@/lib/supabase';
import { ConfigPontuacao } from '@/types/database';

export default function ConfiguracoesPage() {
  const [loading, setLoading] = useState(true);
  const [configuracoes, setConfiguracoes] = useState<ConfigPontuacao[]>([]);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [editando, setEditando] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    ano: new Date().getFullYear(),
    campeao: 100,
    vice: 75,
    terceiro: 50,
    quartas: 25,
    oitavas: 10,
    participacao: 5,
  });
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

    const { data, error } = await supabase
      .from('config_pontuacao')
      .select('*')
      .order('ano', { ascending: false });

    if (!error && data) {
      setConfiguracoes(data);
    }

    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      if (editando) {
        // Atualizar configuração existente
        const { error } = await supabase
          .from('config_pontuacao')
          .update(formData)
          .eq('id', editando);

        if (error) throw error;
        alert('Configuração atualizada com sucesso!');
      } else {
        // Criar nova configuração
        const { error } = await supabase
          .from('config_pontuacao')
          .insert(formData);

        if (error) throw error;
        alert('Configuração criada com sucesso!');
      }

      // Resetar formulário
      setMostrarForm(false);
      setEditando(null);
      setFormData({
        ano: new Date().getFullYear() + 1,
        campeao: 100,
        vice: 75,
        terceiro: 50,
        quartas: 25,
        oitavas: 10,
        participacao: 5,
      });

      await loadData();
    } catch (error: any) {
      alert(`Erro: ${error.message}`);
    }

    setSaving(false);
  };

  const handleEditar = (config: ConfigPontuacao) => {
    setFormData({
      ano: config.ano,
      campeao: config.campeao,
      vice: config.vice,
      terceiro: config.terceiro,
      quartas: config.quartas,
      oitavas: config.oitavas,
      participacao: config.participacao,
    });
    setEditando(config.id);
    setMostrarForm(true);
  };

  const handleAtivar = async (id: string) => {
    if (!confirm('Tem certeza que deseja ativar esta configuração?\n\nApenas uma configuração pode estar ativa por vez.')) {
      return;
    }

    try {
      // Desativar todas
      await supabase
        .from('config_pontuacao')
        .update({ ativo: false })
        .neq('id', '00000000-0000-0000-0000-000000000000'); // Atualizar todas

      // Ativar a selecionada
      const { error } = await supabase
        .from('config_pontuacao')
        .update({ ativo: true })
        .eq('id', id);

      if (error) throw error;

      alert('Configuração ativada com sucesso!');
      await loadData();
    } catch (error: any) {
      alert(`Erro: ${error.message}`);
    }
  };

  const handleDeletar = async (id: string, ano: number) => {
    if (!confirm(`Tem certeza que deseja deletar a configuração de ${ano}?\n\nEsta ação não pode ser desfeita!`)) {
      return;
    }

    const { error } = await supabase
      .from('config_pontuacao')
      .delete()
      .eq('id', id);

    if (error) {
      alert(`Erro ao deletar: ${error.message}`);
    } else {
      alert('Configuração deletada com sucesso!');
      await loadData();
    }
  };

  const handleChange = (field: string, value: number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const configAtiva = configuracoes.find(c => c.ativo);

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Carregando configurações...</p>
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
                  <h1 className="text-xl font-bold text-gray-900">Configurações de Pontuação</h1>
                  <p className="text-xs text-gray-500">Gerenciar pontuação por ano</p>
                </div>
              </div>
              {!mostrarForm && (
                <button
                  onClick={() => {
                    setMostrarForm(true);
                    setEditando(null);
                    setFormData({
                      ano: new Date().getFullYear() + 1,
                      campeao: 100,
                      vice: 75,
                      terceiro: 50,
                      quartas: 25,
                      oitavas: 10,
                      participacao: 5,
                    });
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-semibold"
                >
                  <Plus className="w-4 h-4" />
                  Nova Configuração
                </button>
              )}
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Configuração Ativa */}
          {configAtiva && (
            <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl shadow-lg p-6 mb-8 text-white">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-8 h-8 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h2 className="text-2xl font-bold">Configuração Ativa - {configAtiva.ano}</h2>
                  </div>
                  <p className="text-green-100 mb-4">
                    Esta é a configuração de pontuação padrão atualmente em uso
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                    <div className="bg-white/10 rounded-lg p-3 backdrop-blur-sm">
                      <div className="text-xs text-green-100 mb-1">Campeão</div>
                      <div className="text-2xl font-bold">{configAtiva.campeao}</div>
                    </div>
                    <div className="bg-white/10 rounded-lg p-3 backdrop-blur-sm">
                      <div className="text-xs text-green-100 mb-1">Vice</div>
                      <div className="text-2xl font-bold">{configAtiva.vice}</div>
                    </div>
                    <div className="bg-white/10 rounded-lg p-3 backdrop-blur-sm">
                      <div className="text-xs text-green-100 mb-1">3º Lugar</div>
                      <div className="text-2xl font-bold">{configAtiva.terceiro}</div>
                    </div>
                    <div className="bg-white/10 rounded-lg p-3 backdrop-blur-sm">
                      <div className="text-xs text-green-100 mb-1">Quartas</div>
                      <div className="text-2xl font-bold">{configAtiva.quartas}</div>
                    </div>
                    <div className="bg-white/10 rounded-lg p-3 backdrop-blur-sm">
                      <div className="text-xs text-green-100 mb-1">Oitavas</div>
                      <div className="text-2xl font-bold">{configAtiva.oitavas}</div>
                    </div>
                    <div className="bg-white/10 rounded-lg p-3 backdrop-blur-sm">
                      <div className="text-xs text-green-100 mb-1">Participação</div>
                      <div className="text-2xl font-bold">{configAtiva.participacao}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Formulário */}
          {mostrarForm && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-8">
              <div className="bg-gradient-to-r from-primary-500 to-primary-600 px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                    <Award className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white">
                      {editando ? 'Editar Configuração' : 'Nova Configuração'}
                    </h3>
                    <p className="text-sm text-primary-100">Defina os valores de pontuação</p>
                  </div>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="p-6">
                <div className="space-y-6">
                  {/* Ano */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Ano <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      value={formData.ano}
                      onChange={(e) => handleChange('ano', parseInt(e.target.value))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      min="2020"
                      max="2100"
                      required
                      disabled={!!editando}
                    />
                  </div>

                  {/* Pontuações */}
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Campeão 🏆
                      </label>
                      <input
                        type="number"
                        value={formData.campeao}
                        onChange={(e) => handleChange('campeao', parseInt(e.target.value) || 0)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        min="0"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Vice 🥈
                      </label>
                      <input
                        type="number"
                        value={formData.vice}
                        onChange={(e) => handleChange('vice', parseInt(e.target.value) || 0)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        min="0"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        3º Lugar 🥉
                      </label>
                      <input
                        type="number"
                        value={formData.terceiro}
                        onChange={(e) => handleChange('terceiro', parseInt(e.target.value) || 0)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        min="0"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Quartas de Final
                      </label>
                      <input
                        type="number"
                        value={formData.quartas}
                        onChange={(e) => handleChange('quartas', parseInt(e.target.value) || 0)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        min="0"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Oitavas de Final
                      </label>
                      <input
                        type="number"
                        value={formData.oitavas}
                        onChange={(e) => handleChange('oitavas', parseInt(e.target.value) || 0)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        min="0"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Participação
                      </label>
                      <input
                        type="number"
                        value={formData.participacao}
                        onChange={(e) => handleChange('participacao', parseInt(e.target.value) || 0)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        min="0"
                        required
                      />
                    </div>
                  </div>

                  {/* Ações */}
                  <div className="flex gap-3 pt-4 border-t">
                    <button
                      type="button"
                      onClick={() => {
                        setMostrarForm(false);
                        setEditando(null);
                      }}
                      className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      disabled={saving}
                      className="flex-1 flex items-center justify-center gap-2 px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-semibold disabled:opacity-50"
                    >
                      {saving ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Salvando...
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4" />
                          {editando ? 'Salvar Alterações' : 'Criar Configuração'}
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          )}

          {/* Lista de Configurações */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
              <h3 className="font-bold text-gray-900">Todas as Configurações</h3>
            </div>

            {configuracoes.length === 0 ? (
              <div className="p-12 text-center">
                <Award className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Nenhuma configuração cadastrada
                </h3>
                <p className="text-gray-600 mb-6">
                  Crie sua primeira configuração de pontuação
                </p>
                <button
                  onClick={() => setMostrarForm(true)}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-semibold"
                >
                  <Plus className="w-4 h-4" />
                  Criar Configuração
                </button>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {configuracoes.map((config) => (
                  <div key={config.id} className="p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                          config.ativo
                            ? 'bg-green-100'
                            : 'bg-gray-100'
                        }`}>
                          {config.ativo ? (
                            <CheckCircle className="w-6 h-6 text-green-600" />
                          ) : (
                            <Clock className="w-6 h-6 text-gray-600" />
                          )}
                        </div>
                        <div>
                          <h4 className="text-lg font-bold text-gray-900">
                            Configuração {config.ano}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {config.ativo ? (
                              <span className="text-green-600 font-semibold">✓ Ativa</span>
                            ) : (
                              <span className="text-gray-500">Inativa</span>
                            )}
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        {!config.ativo && (
                          <button
                            onClick={() => handleAtivar(config.id)}
                            className="px-3 py-1 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors text-sm font-semibold"
                          >
                            Ativar
                          </button>
                        )}
                        <button
                          onClick={() => handleEditar(config)}
                          className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                          title="Editar"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeletar(config.id, config.ano)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Deletar"
                          disabled={config.ativo}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                      <div className="bg-gray-50 rounded-lg p-3">
                        <div className="text-xs text-gray-500 mb-1">Campeão</div>
                        <div className="text-lg font-bold text-gray-900">{config.campeao}</div>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-3">
                        <div className="text-xs text-gray-500 mb-1">Vice</div>
                        <div className="text-lg font-bold text-gray-900">{config.vice}</div>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-3">
                        <div className="text-xs text-gray-500 mb-1">3º</div>
                        <div className="text-lg font-bold text-gray-900">{config.terceiro}</div>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-3">
                        <div className="text-xs text-gray-500 mb-1">Quartas</div>
                        <div className="text-lg font-bold text-gray-900">{config.quartas}</div>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-3">
                        <div className="text-xs text-gray-500 mb-1">Oitavas</div>
                        <div className="text-lg font-bold text-gray-900">{config.oitavas}</div>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-3">
                        <div className="text-xs text-gray-500 mb-1">Partic.</div>
                        <div className="text-lg font-bold text-gray-900">{config.participacao}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}