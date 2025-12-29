'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft, Plus, Search, Edit2, Trash2, User,
  Filter, Trophy, History, Mail, Phone, MapPin, GitMerge
} from 'lucide-react';
import ProtectedRoute from '@/components/admin/ProtectedRoute';
import { verificarAdmin } from '@/lib/auth';
import { getJogadores, deletarJogador } from '@/lib/api';
import { Jogador, Categoria, Genero } from '@/types/database';

export default function JogadoresPage() {
  const [loading, setLoading] = useState(true);
  const [jogadores, setJogadores] = useState<Jogador[]>([]);
  const [filteredJogadores, setFilteredJogadores] = useState<Jogador[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoriaFiltro, setCategoriaFiltro] = useState<Categoria | 'TODAS'>('TODAS');
  const [generoFiltro, setGeneroFiltro] = useState<Genero | 'TODOS'>('TODOS');
  const [deletando, setDeletando] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    filterJogadores();
  }, [searchTerm, categoriaFiltro, generoFiltro, jogadores]);

  const loadData = async () => {
    const { isAdmin } = await verificarAdmin();
    if (!isAdmin) {
      router.push('/admin/login');
      return;
    }

    const data = await getJogadores();
    setJogadores(data);
    setLoading(false);
  };

  const filterJogadores = () => {
    let filtered = [...jogadores];

    // Filtro de busca
    if (searchTerm) {
      filtered = filtered.filter(j =>
        j.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        j.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        j.cidade?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtro de categoria
    if (categoriaFiltro !== 'TODAS') {
      filtered = filtered.filter(j => j.categoria === categoriaFiltro);
    }

    // Filtro de gênero
    if (generoFiltro !== 'TODOS') {
      filtered = filtered.filter(j => j.genero === generoFiltro);
    }

    setFilteredJogadores(filtered);
  };

  const handleDelete = async (id: string, nome: string) => {
    if (!confirm(`Tem certeza que deseja deletar ${nome}?\n\nEsta ação não pode ser desfeita!`)) {
      return;
    }

    setDeletando(id);
    const result = await deletarJogador(id);

    if (result.success) {
      alert('Jogador deletado com sucesso!');
      loadData();
    } else {
      alert(`Erro ao deletar: ${result.error}`);
    }
    setDeletando(null);
  };

  const getCategoriaColor = (cat: Categoria) => {
    const colors = {
      'A': 'bg-red-100 text-red-700',
      'B': 'bg-orange-100 text-orange-700',
      'C': 'bg-yellow-100 text-yellow-700',
      'D': 'bg-green-100 text-green-700',
      'FUN': 'bg-blue-100 text-blue-700',
    };
    return colors[cat];
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Carregando jogadores...</p>
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
                  <h1 className="text-xl font-bold text-gray-900">Gestão de Jogadores</h1>
                  <p className="text-xs text-gray-500">{filteredJogadores.length} jogador(es)</p>
                </div>
              </div>
              <div className='flex gap-3'>
                <Link
                href="/admin/jogadores/novo"
                className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-semibold"
                >
                  <Plus className="w-4 h-4" />
                Novo Jogador
                </Link>

                <Link
                href="/admin/jogadores/mesclar"
                className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-semibold"
                >
                  <GitMerge className="w-4 h-4" />
                Mesclar Duplicatas
                </Link>
              </div>

              
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

          {/* Filtros */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Busca */}
              <div className="md:col-span-1">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Buscar
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Nome, email ou cidade..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Categoria */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Categoria
                </label>
                <select
                  value={categoriaFiltro}
                  onChange={(e) => setCategoriaFiltro(e.target.value as Categoria | 'TODAS')}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="TODAS">Todas</option>
                  <option value="A">A - Elite</option>
                  <option value="B">B - Avançado</option>
                  <option value="C">C - Intermediário</option>
                  <option value="D">D - Iniciante</option>
                  <option value="FUN">FUN - Recreativo</option>
                </select>
              </div>

              {/* Gênero */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Gênero
                </label>
                <select
                  value={generoFiltro}
                  onChange={(e) => setGeneroFiltro(e.target.value as Genero | 'TODOS')}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="TODOS">Todos</option>
                  <option value="Masculino">👨 Masculino</option>
                  <option value="Feminino">👩 Feminino</option>
                </select>
              </div>
            </div>
          </div>

          {/* Lista de Jogadores */}
          {filteredJogadores.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
              <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Nenhum jogador encontrado
              </h3>
              <p className="text-gray-600 mb-6">
                {searchTerm || categoriaFiltro !== 'TODAS' || generoFiltro !== 'TODOS'
                  ? 'Tente ajustar os filtros de busca'
                  : 'Comece adicionando um novo jogador'}
              </p>
              {!searchTerm && categoriaFiltro === 'TODAS' && generoFiltro === 'TODOS' && (
                <Link
                  href="/admin/jogadores/novo"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-semibold"
                >
                  <Plus className="w-4 h-4" />
                  Adicionar Primeiro Jogador
                </Link>
              )}
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Jogador
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Categoria
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Pontos
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Torneios
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Contato
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Ações
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredJogadores.map((jogador) => (
                      <tr key={jogador.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center flex-shrink-0">
                              <User className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <div className="font-semibold text-gray-900">{jogador.nome}</div>
                              <div className="text-sm text-gray-500">
                                {jogador.genero === 'Masculino' ? '👨' : '👩'} {jogador.genero}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${getCategoriaColor(jogador.categoria)}`}>
                            {jogador.categoria}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <Trophy className="w-4 h-4 text-primary-600" />
                            <span className="font-bold text-primary-600">{jogador.pontos}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-gray-700">{jogador.torneios_disputados}</span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="space-y-1 text-sm">
                            {jogador.email && (
                              <div className="flex items-center gap-2 text-gray-600">
                                <Mail className="w-3 h-3" />
                                {jogador.email}
                              </div>
                            )}
                            {jogador.telefone && (
                              <div className="flex items-center gap-2 text-gray-600">
                                <Phone className="w-3 h-3" />
                                {jogador.telefone}
                              </div>
                            )}
                            {jogador.cidade && (
                              <div className="flex items-center gap-2 text-gray-600">
                                <MapPin className="w-3 h-3" />
                                {jogador.cidade}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Link
                              href={`/admin/jogadores/${jogador.id}/historico`}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Ver histórico"
                            >
                              <History className="w-4 h-4" />
                            </Link>
                            <Link
                              href={`/admin/jogadores/${jogador.id}/editar`}
                              className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                              title="Editar"
                            >
                              <Edit2 className="w-4 h-4" />
                            </Link>
                            <button
                              onClick={() => handleDelete(jogador.id, jogador.nome)}
                              disabled={deletando === jogador.id}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                              title="Deletar"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </main>
      </div>
    </ProtectedRoute>
  );
}