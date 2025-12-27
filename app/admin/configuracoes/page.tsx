'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Plus, Edit2, Trash2, Trophy } from 'lucide-react';
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

export default function ConfiguracoesPage() {
  const [configuracoes, setConfiguracoes] = useState<Configuracao[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    nome: '',
    descricao: '',
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadData = async () => {
    const { isAdmin } = await verificarAdmin();
    if (!isAdmin) {
      router.push('/admin/login');
      return;
    }

    const { data } = await supabase
      .from('config_pontuacao')
      .select('*')
      .order('nome', { ascending: true });

    if (data) {
      setConfiguracoes(data);
    }
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validar nome
    if (!formData.nome.trim()) {
      alert('Nome da configuração é obrigatório!');
      return;
    }

    try {
      if (editingId) {
        // Atualizar
        const { error } = await supabase
          .from('config_pontuacao')
          .update(formData)
          .eq('id', editingId);

        if (error) throw error;
        alert('Configuração atualizada com sucesso!');
      } else {
        // Criar nova
        const { error } = await supabase
          .from('config_pontuacao')
          .insert([formData]);

        if (error) throw error;
        alert('Configuração criada com sucesso!');
      }

      // Reset e reload
      resetForm();
      loadData();
    } catch (error: any) {
      alert(`Erro: ${error.message}`);
    }
  };

  const handleEdit = (config: Configuracao) => {
    setFormData({
      nome: config.nome,
      descricao: config.descricao || '',
      campeao: config.campeao,
      vice: config.vice,
      terceiro: config.terceiro,
      quartas: config.quartas,
      oitavas: config.oitavas,
      participacao: config.participacao,
    });
    setEditingId(config.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir esta configuração?')) return;

    try {
      const { error } = await supabase
        .from('config_pontuacao')
        .delete()
        .eq('id', id);

      if (error) throw error;
      alert('Configuração excluída com sucesso!');
      loadData();
    } catch (error: any) {
      alert(`Erro: ${error.message}`);
    }
  };

  const resetForm = () => {
    setFormData({
      nome: '',
      descricao: '',
      campeao: 100,
      vice: 75,
      terceiro: 50,
      quartas: 25,
      oitavas: 10,
      participacao: 5,
    });
    setEditingId(null);
    setShowForm(false);
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
                  <p className="text-xs text-gray-500">Gerencie os níveis de torneios</p>
                </div>
              </div>
              {!showForm && (
                <button
                  onClick={() => setShowForm(true)}
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
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Formulário */}
          {showForm && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
              <h2 className="text-lg font-bold text-gray-900 mb-6">
                {editingId ? 'Editar Configuração' : 'Nova Configuração'}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Nome */}
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Nome da Configuração *
                    </label>
                    <input
                      type="text"
                      value={formData.nome}
                      onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                      placeholder="Ex: BT 1000, BT 500, Circuito Ouro..."
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">Use nomes descritivos como BT 1000, Liga Premium, etc</p>
                  </div>

                  {/* Descrição */}
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Descrição (opcional)
                    </label>
                    <input
                      type="text"
                      value={formData.descricao}
                      onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                      placeholder="Ex: Torneios Super Premium do Circuito"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Pontuações */}
                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-sm font-bold text-gray-700 mb-4 flex items-center gap-2">
                    <Trophy className="w-4 h-4 text-primary-600" />
                    Pontuação por Colocação
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        🥇 Campeão
                      </label>
                      <input
                        type="number"
                        value={formData.campeao}
                        onChange={(e) => setFormData({ ...formData, campeao: parseInt(e.target.value) })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        required
                        min="0"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        🥈 Vice
                      </label>
                      <input
                        type="number"
                        value={formData.vice}
                        onChange={(e) => setFormData({ ...formData, vice: parseInt(e.target.value) })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        required
                        min="0"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        🥉 3º Lugar
                      </label>
                      <input
                        type="number"
                        value={formData.terceiro}
                        onChange={(e) => setFormData({ ...formData, terceiro: parseInt(e.target.value) })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        required
                        min="0"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Quartas de Final
                      </label>
                      <input
                        type="number"
                        value={formData.quartas}
                        onChange={(e) => setFormData({ ...formData, quartas: parseInt(e.target.value) })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        required
                        min="0"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Oitavas de Final
                      </label>
                      <input
                        type="number"
                        value={formData.oitavas}
                        onChange={(e) => setFormData({ ...formData, oitavas: parseInt(e.target.value) })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        required
                        min="0"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Participação
                      </label>
                      <input
                        type="number"
                        value={formData.participacao}
                        onChange={(e) => setFormData({ ...formData, participacao: parseInt(e.target.value) })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        required
                        min="0"
                      />
                    </div>
                  </div>
                </div>

                {/* Botões */}
                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-semibold"
                  >
                    {editingId ? 'Salvar Alterações' : 'Criar Configuração'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Lista de Configurações */}
          <div className="space-y-4">
            {configuracoes.length === 0 ? (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                <Trophy className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Nenhuma configuração cadastrada
                </h3>
                <p className="text-gray-600 mb-6">
                  Crie sua primeira configuração de pontuação para começar
                </p>
                <button
                  onClick={() => setShowForm(true)}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-semibold"
                >
                  <Plus className="w-5 h-5" />
                  Nova Configuração
                </button>
              </div>
            ) : (
              configuracoes.map((config) => (
                <div
                  key={config.id}
                  className="bg-white rounded-xl shadow-sm border-2 border-gray-200 p-6 transition-all hover:border-primary-200"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-2xl font-black text-gray-900">
                          {config.nome}
                        </h3>
                      </div>
                      {config.descricao && (
                        <p className="text-sm text-gray-600 mb-4">{config.descricao}</p>
                      )}
                      <div className="flex flex-wrap gap-3 text-sm">
                        <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full font-semibold">
                          🥇 Campeão: {config.campeao}
                        </span>
                        <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full font-semibold">
                          🥈 Vice: {config.vice}
                        </span>
                        <span className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full font-semibold">
                          🥉 3º: {config.terceiro}
                        </span>
                        <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full font-semibold">
                          Quartas: {config.quartas}
                        </span>
                        <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full font-semibold">
                          Oitavas: {config.oitavas}
                        </span>
                        <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full font-semibold">
                          Participação: {config.participacao}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 ml-4">
                      <button
                        onClick={() => handleEdit(config)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Editar"
                      >
                        <Edit2 className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(config.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Excluir"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}