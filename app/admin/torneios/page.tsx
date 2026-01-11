'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft, Plus, Calendar, MapPin, Trophy, Edit2, Trash2,
  CheckCircle, Clock, Play, Filter, ExternalLink
} from 'lucide-react';
import ProtectedRoute from '@/components/admin/ProtectedRoute';
import { verificarAdmin } from '@/lib/auth';
import { getTorneios } from '@/lib/api';
import { supabase } from '@/lib/supabase';
import { Torneio, StatusTorneio } from '@/types/database';

export default function TorneiosPage() {
  const [loading, setLoading] = useState(true);
  const [torneios, setTorneios] = useState<Torneio[]>([]);
  const [filtro, setFiltro] = useState<StatusTorneio | 'TODOS'>('TODOS');
  const [deletando, setDeletando] = useState<string | null>(null);
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

    const data = await getTorneios();
    setTorneios(data);
    setLoading(false);
  };

  const handleDelete = async (id: string, nome: string) => {
    if (!confirm(`Tem certeza que deseja deletar o torneio "${nome}"?\n\nEsta ação não pode ser desfeita e todos os resultados vinculados serão perdidos!`)) {
      return;
    }

    setDeletando(id);
    const { error } = await supabase
      .from('torneios')
      .delete()
      .eq('id', id);

    if (error) {
      alert(`Erro ao deletar: ${error.message}`);
    } else {
      alert('Torneio deletado com sucesso!');
      loadData();
    }
    setDeletando(null);
  };

  const getStatusBadge = (status: StatusTorneio) => {
    const badges = {
      'confirmado': { color: 'bg-blue-100 text-blue-700 border-blue-200', icon: Calendar, label: 'Confirmado' },
      'em_andamento': { color: 'bg-orange-100 text-orange-700 border-orange-200', icon: Play, label: 'Em Andamento' },
      'realizado': { color: 'bg-green-100 text-green-700 border-green-200', icon: CheckCircle, label: 'Realizado' },
    };
    return badges[status];
  };

  const formatarPeriodo = (dataInicio: string, dataFim?: string | null) => {
    const inicio = new Date(dataInicio);
    const fim = dataFim ? new Date(dataFim) : inicio;
    const diasDuracao = Math.ceil((fim.getTime() - inicio.getTime()) / (1000 * 60 * 60 * 24)) + 1;

    if (dataInicio === dataFim || !dataFim) {
      // Torneio de 1 dia
      return inicio.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
      });
    } else {
      // Torneio multi-dia
      const mesmoMes = inicio.getMonth() === fim.getMonth();
      if (mesmoMes) {
        return `${inicio.getDate()} a ${fim.toLocaleDateString('pt-BR', {
          day: '2-digit',
          month: 'long',
          year: 'numeric',
        })} (${diasDuracao} dias)`;
      } else {
        return `${inicio.toLocaleDateString('pt-BR', {
          day: '2-digit',
          month: 'short',
        })} a ${fim.toLocaleDateString('pt-BR', {
          day: '2-digit',
          month: 'long',
          year: 'numeric',
        })} (${diasDuracao} dias)`;
      }
    }
  };

  const torneiosFiltrados = filtro === 'TODOS' 
    ? torneios 
    : torneios.filter(t => t.status === filtro);

  const confirmados = torneios.filter(t => t.status === 'confirmado');
  const emAndamento = torneios.filter(t => t.status === 'em_andamento');
  const realizados = torneios.filter(t => t.status === 'realizado');

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Carregando torneios...</p>
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
                  <h1 className="text-xl font-bold text-gray-900">Gestão de Torneios</h1>
                  <p className="text-xs text-gray-500">{torneiosFiltrados.length} torneio(s)</p>
                </div>
              </div>
              <Link
                href="/admin/torneios/novo"
                className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-semibold"
              >
                <Plus className="w-4 h-4" />
                Novo Torneio
              </Link>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <button
              onClick={() => setFiltro('TODOS')}
              className={`bg-white rounded-xl shadow-sm border-2 p-4 text-left transition-all ${
                filtro === 'TODOS' ? 'border-primary-500' : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="text-2xl font-bold text-gray-900">{torneios.length}</div>
              <div className="text-sm text-gray-600">Total</div>
            </button>

            <button
              onClick={() => setFiltro('confirmado')}
              className={`bg-white rounded-xl shadow-sm border-2 p-4 text-left transition-all ${
                filtro === 'confirmado' ? 'border-blue-500' : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <div className="text-2xl font-bold text-blue-600">{confirmados.length}</div>
                <Calendar className="w-5 h-5 text-blue-500" />
              </div>
              <div className="text-sm text-gray-600">Confirmados</div>
            </button>

            <button
              onClick={() => setFiltro('em_andamento')}
              className={`bg-white rounded-xl shadow-sm border-2 p-4 text-left transition-all ${
                filtro === 'em_andamento' ? 'border-orange-500' : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <div className="text-2xl font-bold text-orange-600">{emAndamento.length}</div>
                <Play className="w-5 h-5 text-orange-500" />
              </div>
              <div className="text-sm text-gray-600">Em Andamento</div>
            </button>

            <button
              onClick={() => setFiltro('realizado')}
              className={`bg-white rounded-xl shadow-sm border-2 p-4 text-left transition-all ${
                filtro === 'realizado' ? 'border-green-500' : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <div className="text-2xl font-bold text-green-600">{realizados.length}</div>
                <CheckCircle className="w-5 h-5 text-green-500" />
              </div>
              <div className="text-sm text-gray-600">Realizados</div>
            </button>
          </div>

          {/* Lista de Torneios */}
          {torneiosFiltrados.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
              <Trophy className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Nenhum torneio {filtro !== 'TODOS' ? filtro : 'cadastrado'}
              </h3>
              <p className="text-gray-600 mb-6">
                {filtro !== 'TODOS' 
                  ? `Não há torneios com status "${filtro}"`
                  : 'Comece criando seu primeiro torneio'
                }
              </p>
              {filtro === 'TODOS' && (
                <Link
                  href="/admin/torneios/novo"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-semibold"
                >
                  <Plus className="w-4 h-4" />
                  Criar Primeiro Torneio
                </Link>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {torneiosFiltrados.map((torneio) => {
                const statusInfo = getStatusBadge(torneio.status);
                const StatusIcon = statusInfo.icon;

                return (
                  <div
                    key={torneio.id}
                    className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all"
                  >
                    {/* Header do Card */}
                    <div className="bg-gradient-to-r from-primary-500 to-primary-600 px-4 py-3">
                      <div className="flex items-center justify-between">
                        <Trophy className="w-6 h-6 text-white" />
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold border-2 ${statusInfo.color} bg-white`}>
                          <StatusIcon className="w-3 h-3" />
                          {statusInfo.label}
                        </span>
                      </div>
                    </div>

                    {/* Conteúdo */}
                    <div className="p-4">
                      <h3 className="font-bold text-gray-900 text-lg mb-3 line-clamp-2">
                        {torneio.nome}
                      </h3>

                      <div className="space-y-2 mb-4">
                        {/* Data com período */}
                        <div className="flex items-start gap-2 text-sm text-gray-600">
                          <Calendar className="w-4 h-4 text-primary-600 mt-0.5 flex-shrink-0" />
                          <span>{formatarPeriodo(torneio.data, torneio.data_fim)}</span>
                        </div>
                        
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <MapPin className="w-4 h-4 text-primary-600" />
                          <span>{torneio.local}</span>
                        </div>
                        
                        <div className="text-sm text-gray-600">
                          <span className="font-semibold">{torneio.cidade}</span>
                        </div>
                      </div>

                      {/* Badges */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {/* Pontuação Custom */}
                        {torneio.pontuacao_custom && (
                          <span className="inline-flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-bold">
                            ⭐ Pontuação Especial
                          </span>
                        )}
                        
                        {/* Link LetzPlay */}
                        {torneio.link_letzplay && (
                          <a
                            href={torneio.link_letzplay}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold hover:bg-blue-200 transition-colors"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <ExternalLink className="w-3 h-3" />
                            LetzPlay
                          </a>
                        )}
                      </div>

                      {/* Ações */}
                      <div className="flex gap-2 pt-4 border-t border-gray-200">
                        <Link
                          href={`/admin/torneios/${torneio.id}/editar`}
                          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-primary-50 text-primary-700 rounded-lg hover:bg-primary-100 transition-colors font-semibold text-sm"
                        >
                          <Edit2 className="w-4 h-4" />
                          Editar
                        </Link>
                        <button
                          onClick={() => handleDelete(torneio.id, torneio.nome)}
                          disabled={deletando === torneio.id}
                          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors font-semibold text-sm disabled:opacity-50"
                        >
                          <Trash2 className="w-4 h-4" />
                          Deletar
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </main>
      </div>
    </ProtectedRoute>
  );
}