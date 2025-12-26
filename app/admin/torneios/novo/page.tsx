'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, Trophy, Calendar, MapPin, Award, DollarSign } from 'lucide-react';
import ProtectedRoute from '@/components/admin/ProtectedRoute';
import { supabase } from '@/lib/supabase';
import { getConfigPontuacaoAtiva } from '@/lib/pontuacao';
import { StatusTorneio } from '@/types/database';

export default function NovoTorneioPage() {
  const [loading, setLoading] = useState(false);
  const [configPadrao, setConfigPadrao] = useState<any>(null);
  const [usarPontuacaoCustom, setUsarPontuacaoCustom] = useState(false);
  const [formData, setFormData] = useState({
    nome: '',
    data: '',
    local: '',
    cidade: '',
    status: 'confirmado' as StatusTorneio,
  });
  const [pontuacaoCustom, setPontuacaoCustom] = useState({
    campeao: 100,
    vice: 75,
    terceiro: 50,
    quartas: 25,
    oitavas: 10,
    participacao: 5,
  });
  const router = useRouter();

  useEffect(() => {
    loadConfigPadrao();
  }, []);

  const loadConfigPadrao = async () => {
    const config = await getConfigPontuacaoAtiva();
    if (config) {
      setConfigPadrao(config);
      setPontuacaoCustom({
        campeao: config.campeao,
        vice: config.vice,
        terceiro: config.terceiro,
        quartas: config.quartas,
        oitavas: config.oitavas,
        participacao: config.participacao,
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nome.trim() || !formData.data || !formData.local.trim() || !formData.cidade.trim()) {
      alert('Por favor, preencha todos os campos obrigatórios!');
      return;
    }

    setLoading(true);

    const torneioData: any = {
      nome: formData.nome.trim(),
      data: formData.data,
      local: formData.local.trim(),
      cidade: formData.cidade.trim(),
      status: formData.status,
    };

    // Adicionar pontuação custom se habilitado
    if (usarPontuacaoCustom) {
      torneioData.pontuacao_custom = pontuacaoCustom;
    }

    const { error } = await supabase
      .from('torneios')
      .insert(torneioData);

    if (error) {
      alert(`Erro ao criar torneio: ${error.message}`);
      setLoading(false);
    } else {
      alert('Torneio criado com sucesso!');
      router.push('/admin/torneios');
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handlePontuacaoChange = (field: string, value: number) => {
    setPontuacaoCustom(prev => ({ ...prev, [field]: value }));
  };

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
                  <h1 className="text-xl font-bold text-gray-900">Novo Torneio</h1>
                  <p className="text-xs text-gray-500">Criar novo torneio</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              {/* Card Principal */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="bg-gradient-to-r from-primary-500 to-primary-600 px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                      <Trophy className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-white">Informações do Torneio</h2>
                      <p className="text-sm text-primary-100">Preencha os dados básicos</p>
                    </div>
                  </div>
                </div>

                <div className="p-6 space-y-6">
                  {/* Nome */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Nome do Torneio <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Trophy className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        value={formData.nome}
                        onChange={(e) => handleChange('nome', e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="Ex: Santos Open de Beach Tennis 2025"
                        required
                      />
                    </div>
                  </div>

                  {/* Data e Status */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Data do Torneio <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="date"
                          value={formData.data}
                          onChange={(e) => handleChange('data', e.target.value)}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Status <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={formData.status}
                        onChange={(e) => handleChange('status', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        required
                      >
                        <option value="confirmado">📅 Confirmado</option>
                        <option value="em_andamento">▶️ Em Andamento</option>
                        <option value="realizado">✅ Realizado</option>
                      </select>
                    </div>
                  </div>

                  {/* Local */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Local <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        value={formData.local}
                        onChange={(e) => handleChange('local', e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="Ex: Arena Beach Tennis Santos"
                        required
                      />
                    </div>
                  </div>

                  {/* Cidade */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Cidade <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.cidade}
                      onChange={(e) => handleChange('cidade', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Ex: Santos"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Card Pontuação Custom */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="bg-gradient-to-r from-purple-500 to-purple-600 px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                        <Award className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h2 className="text-lg font-bold text-white">Pontuação</h2>
                        <p className="text-sm text-purple-100">
                          {usarPontuacaoCustom ? 'Pontuação especial ativa' : 'Usando pontuação padrão'}
                        </p>
                      </div>
                    </div>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <span className="text-sm font-semibold text-white">Personalizar</span>
                      <div className="relative">
                        <input
                          type="checkbox"
                          checked={usarPontuacaoCustom}
                          onChange={(e) => setUsarPontuacaoCustom(e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-white/20 rounded-full peer peer-checked:bg-white/40 transition-all"></div>
                        <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-5"></div>
                      </div>
                    </label>
                  </div>
                </div>

                <div className="p-6">
                  {!usarPontuacaoCustom ? (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="flex gap-3">
                        <div className="flex-shrink-0">
                          <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                            <span className="text-white text-sm">ℹ️</span>
                          </div>
                        </div>
                        <div className="text-sm text-blue-900">
                          <p className="font-semibold mb-2">Usando pontuação padrão do ano:</p>
                          <div className="grid grid-cols-3 gap-3">
                            <div><strong>Campeão:</strong> {configPadrao?.campeao || 100}pts</div>
                            <div><strong>Vice:</strong> {configPadrao?.vice || 75}pts</div>
                            <div><strong>3º:</strong> {configPadrao?.terceiro || 50}pts</div>
                            <div><strong>Quartas:</strong> {configPadrao?.quartas || 25}pts</div>
                            <div><strong>Oitavas:</strong> {configPadrao?.oitavas || 10}pts</div>
                            <div><strong>Participação:</strong> {configPadrao?.participacao || 5}pts</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-4">
                        <p className="text-sm text-purple-900 font-semibold">
                          ⭐ Este torneio terá pontuação especial! Ideal para finais de temporada ou campeonatos importantes.
                        </p>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {Object.entries(pontuacaoCustom).map(([key, value]) => {
                          const labels: Record<string, string> = {
                            campeao: 'Campeão 🏆',
                            vice: 'Vice 🥈',
                            terceiro: '3º Lugar 🥉',
                            quartas: 'Quartas',
                            oitavas: 'Oitavas',
                            participacao: 'Participação',
                          };

                          return (
                            <div key={key}>
                              <label className="block text-sm font-semibold text-gray-700 mb-2">
                                {labels[key]}
                              </label>
                              <input
                                type="number"
                                value={value}
                                onChange={(e) => handlePontuacaoChange(key, parseInt(e.target.value) || 0)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                min="0"
                              />
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Ações */}
              <div className="flex items-center justify-end gap-3">
                <Link
                  href="/admin/torneios"
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
                >
                  Cancelar
                </Link>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-semibold disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Criando...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      Criar Torneio
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </main>
      </div>
    </ProtectedRoute>
  );
}