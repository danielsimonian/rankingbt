'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, User, Mail, Phone, MapPin, Award, Loader2 } from 'lucide-react';
import ProtectedRoute from '@/components/admin/ProtectedRoute';
import { getJogadorPorId, atualizarJogador } from '@/lib/api';
import { Categoria, Genero, Jogador } from '@/types/database';
import { phoneMask } from '@/lib/masks';

export default function EditarJogadorPage({ params }: { params: { id: string } }) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [jogador, setJogador] = useState<Jogador | null>(null);
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    cidade: '',
    categoria: 'FUN' as Categoria,
    genero: 'Masculino' as Genero,
  });
  const router = useRouter();

  useEffect(() => {
    loadJogador();
  }, []);

  const loadJogador = async () => {
    const data = await getJogadorPorId(params.id);
    
    if (!data) {
      alert('Jogador não encontrado!');
      router.push('/admin/jogadores');
      return;
    }

    setJogador(data);
    setFormData({
      nome: data.nome,
      email: data.email || '',
      telefone: data.telefone || '',
      cidade: data.cidade || '',
      categoria: data.categoria,
      genero: data.genero,
    });
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nome.trim()) {
      alert('Nome é obrigatório!');
      return;
    }

    setSaving(true);

    const result = await atualizarJogador(params.id, {
      nome: formData.nome.trim(),
      email: formData.email.trim() || undefined,
      telefone: formData.telefone.trim() || undefined,
      cidade: formData.cidade.trim() || undefined,
      categoria: formData.categoria,
      genero: formData.genero,
    });

    if (result.success) {
      alert('Jogador atualizado com sucesso!');
      router.push('/admin/jogadores');
    } else {
      alert(`Erro ao atualizar: ${result.error}`);
      setSaving(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Carregando jogador...</p>
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
                  href="/admin/jogadores"
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ArrowLeft className="w-5 h-5 text-gray-600" />
                </Link>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Editar Jogador</h1>
                  <p className="text-xs text-gray-500">{jogador?.nome}</p>
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
                    <p className="text-sm text-primary-100">Atualize os dados abaixo</p>
                  </div>
                </div>
              </div>

              {/* Formulário */}
              <div className="p-6 space-y-6">
                {/* Info Atual */}
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Pontos Atuais:</span>
                      <span className="ml-2 font-bold text-primary-600">{jogador?.pontos}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Torneios:</span>
                      <span className="ml-2 font-bold text-gray-900">{jogador?.torneios_disputados}</span>
                    </div>
                  </div>
                </div>

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
                      Categoria <span className="text-red-500">*</span>
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

                {/* Aviso */}
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                  <div className="flex gap-3">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                        <span className="text-white text-sm">⚠️</span>
                      </div>
                    </div>
                    <div className="text-sm text-orange-900">
                      <p className="font-semibold mb-1">Atenção ao alterar categoria:</p>
                      <p className="text-orange-800">
                        Alterar a categoria manualmente <strong>não respeita</strong> as regras de subida/descida. 
                        Use apenas para correções administrativas. Para mudanças normais, o jogador deve solicitar via sistema.
                      </p>
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
                  disabled={saving}
                  className="flex items-center gap-2 px-6 py-2.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Salvando...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      Salvar Alterações
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