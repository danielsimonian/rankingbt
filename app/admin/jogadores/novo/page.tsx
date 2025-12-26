'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, User, Mail, Phone, MapPin, Award } from 'lucide-react';
import ProtectedRoute from '@/components/admin/ProtectedRoute';
import { criarJogador } from '@/lib/api';
import { Categoria, Genero } from '@/types/database';
import { phoneMask } from '@/lib/masks';

export default function NovoJogadorPage() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    cidade: '',
    categoria: 'FUN' as Categoria,
    genero: 'Masculino' as Genero,
  });
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nome.trim()) {
      alert('Nome é obrigatório!');
      return;
    }

    setLoading(true);

    const result = await criarJogador({
      nome: formData.nome.trim(),
      email: formData.email.trim() || undefined,
      telefone: formData.telefone.trim() || undefined,
      cidade: formData.cidade.trim() || undefined,
      categoria: formData.categoria,
      genero: formData.genero,
    });

    if (result.success) {
      alert('Jogador criado com sucesso!');
      router.push('/admin/jogadores');
    } else {
      alert(`Erro ao criar jogador: ${result.error}`);
      setLoading(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
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
                  href="/admin/jogadores"
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ArrowLeft className="w-5 h-5 text-gray-600" />
                </Link>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Novo Jogador</h1>
                  <p className="text-xs text-gray-500">Adicionar jogador ao sistema</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <form onSubmit={handleSubmit}>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              {/* Header do Card */}
              <div className="bg-gradient-to-r from-primary-500 to-primary-600 px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                    <User className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-white">Informações do Jogador</h2>
                    <p className="text-sm text-primary-100">Preencha os dados abaixo</p>
                  </div>
                </div>
              </div>

              {/* Formulário */}
              <div className="p-6 space-y-6">
                {/* Nome */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Nome Completo <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={formData.nome}
                      onChange={(e) => handleChange('nome', e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Ex: João da Silva"
                      required
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleChange('email', e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Ex: joao@email.com"
                    />
                  </div>
                </div>

                {/* Telefone */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Telefone
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={formData.telefone}
                      onChange={(e) => handleChange('telefone', phoneMask(e.target.value))}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="(13) 99999-9999"
                      maxLength={15}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Digite apenas os números
                  </p>
                </div>

                {/* Cidade */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Cidade
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={formData.cidade}
                      onChange={(e) => handleChange('cidade', e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Ex: Santos"
                    />
                  </div>
                </div>

                {/* Grid: Categoria e Gênero */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Categoria */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Categoria Inicial <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Award className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <select
                        value={formData.categoria}
                        onChange={(e) => handleChange('categoria', e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent appearance-none bg-white"
                        required
                      >
                        <option value="FUN">FUN - Recreativo</option>
                        <option value="D">D - Iniciante</option>
                        <option value="C">C - Intermediário</option>
                        <option value="B">B - Avançado</option>
                        <option value="A">A - Elite</option>
                      </select>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Jogador pode mudar depois
                    </p>
                  </div>

                  {/* Gênero */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Gênero <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.genero}
                      onChange={(e) => handleChange('genero', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent appearance-none bg-white"
                      required
                    >
                      <option value="Masculino">👨 Masculino</option>
                      <option value="Feminino">👩 Feminino</option>
                    </select>
                  </div>
                </div>

                {/* Info */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex gap-3">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                        <span className="text-white text-sm">ℹ️</span>
                      </div>
                    </div>
                    <div className="text-sm text-blue-900">
                      <p className="font-semibold mb-1">Informações importantes:</p>
                      <ul className="list-disc list-inside space-y-1 text-blue-800">
                        <li>O jogador começará com 0 pontos</li>
                        <li>Categoria inicial é escolhida pelo jogador</li>
                        <li>Pontos serão calculados após participação em torneios</li>
                        <li>Sistema Top 10 (últimos 12 meses)</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer - Ações */}
              <div className="bg-gray-50 px-6 py-4 flex items-center justify-end gap-3 border-t border-gray-200">
                <Link
                  href="/admin/jogadores"
                  className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors font-semibold"
                >
                  Cancelar
                </Link>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center gap-2 px-6 py-2.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Salvando...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      Salvar Jogador
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