'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft, CheckCircle, XCircle, Clock, User,
  Mail, TrendingDown, AlertCircle, Trophy, Loader2
} from 'lucide-react';
import ProtectedRoute from '@/components/admin/ProtectedRoute';
import { verificarAdmin } from '@/lib/auth';
import { getSolicitacoes, aprovarSolicitacao, rejeitarSolicitacao } from '@/lib/admin';

interface Solicitacao {
  id: string;
  jogador_id: string;
  categoria_atual: string;
  categoria_solicitada: string;
  motivo: string;
  status: string;
  data_solicitacao: string;
  data_resposta?: string;
  resposta_admin?: string;
  jogadores: {
    nome: string;
    email?: string;
    genero: string;
    pontos: number;
    categoria: string;
  };
}

export default function SolicitacoesPage() {
  const [loading, setLoading] = useState(true);
  const [solicitacoes, setSolicitacoes] = useState<Solicitacao[]>([]);
  const [filtro, setFiltro] = useState<'pendente' | 'aprovada' | 'rejeitada' | 'todas'>('pendente');
  const [processando, setProcessando] = useState<string | null>(null);
  const [modalAberto, setModalAberto] = useState<string | null>(null);
  const [respostaAdmin, setRespostaAdmin] = useState('');
  const [adminId, setAdminId] = useState('');
  const router = useRouter();

  useEffect(() => {
    loadData();
  }, [filtro]);

  const loadData = async () => {
    const { isAdmin, user, admin } = await verificarAdmin();
    if (!isAdmin) {
      router.push('/admin/login');
      return;
    }

    setAdminId(user?.id || '');

    const filtroStatus = filtro === 'todas' ? undefined : filtro;
    const data = await getSolicitacoes(filtroStatus);
    setSolicitacoes(data);
    setLoading(false);
  };

  const handleAprovar = async (solicitacaoId: string) => {
    setProcessando(solicitacaoId);
    const result = await aprovarSolicitacao(solicitacaoId, adminId, respostaAdmin || undefined);
    
    if (result.success) {
      alert('Solicitação aprovada com sucesso!');
      setModalAberto(null);
      setRespostaAdmin('');
      loadData();
    } else {
      alert(`Erro: ${result.error}`);
    }
    setProcessando(null);
  };

  const handleRejeitar = async (solicitacaoId: string) => {
    if (!respostaAdmin.trim()) {
      alert('Por favor, informe o motivo da rejeição');
      return;
    }

    setProcessando(solicitacaoId);
    const result = await rejeitarSolicitacao(solicitacaoId, adminId, respostaAdmin);
    
    if (result.success) {
      alert('Solicitação rejeitada');
      setModalAberto(null);
      setRespostaAdmin('');
      loadData();
    } else {
      alert(`Erro: ${result.error}`);
    }
    setProcessando(null);
  };

  const pendentes = solicitacoes.filter(s => s.status === 'pendente');
  const aprovadas = solicitacoes.filter(s => s.status === 'aprovada');
  const rejeitadas = solicitacoes.filter(s => s.status === 'rejeitada');

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Carregando solicitações...</p>
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
                  <h1 className="text-xl font-bold text-gray-900">Solicitações de Mudança de Categoria</h1>
                  <p className="text-xs text-gray-500">Aprovar ou rejeitar descidas de categoria</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <button
              onClick={() => setFiltro('todas')}
              className={`bg-white rounded-xl shadow-sm border-2 p-4 text-left transition-all ${
                filtro === 'todas' ? 'border-primary-500' : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="text-2xl font-bold text-gray-900">{solicitacoes.length}</div>
              <div className="text-sm text-gray-600">Total</div>
            </button>

            <button
              onClick={() => setFiltro('pendente')}
              className={`bg-white rounded-xl shadow-sm border-2 p-4 text-left transition-all ${
                filtro === 'pendente' ? 'border-orange-500' : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <div className="text-2xl font-bold text-orange-600">{pendentes.length}</div>
                <Clock className="w-5 h-5 text-orange-500" />
              </div>
              <div className="text-sm text-gray-600">Pendentes</div>
            </button>

            <button
              onClick={() => setFiltro('aprovada')}
              className={`bg-white rounded-xl shadow-sm border-2 p-4 text-left transition-all ${
                filtro === 'aprovada' ? 'border-green-500' : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <div className="text-2xl font-bold text-green-600">{aprovadas.length}</div>
                <CheckCircle className="w-5 h-5 text-green-500" />
              </div>
              <div className="text-sm text-gray-600">Aprovadas</div>
            </button>

            <button
              onClick={() => setFiltro('rejeitada')}
              className={`bg-white rounded-xl shadow-sm border-2 p-4 text-left transition-all ${
                filtro === 'rejeitada' ? 'border-red-500' : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <div className="text-2xl font-bold text-red-600">{rejeitadas.length}</div>
                <XCircle className="w-5 h-5 text-red-500" />
              </div>
              <div className="text-sm text-gray-600">Rejeitadas</div>
            </button>
          </div>

          {/* Lista de Solicitações */}
          {solicitacoes.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
              <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Nenhuma solicitação {filtro !== 'todas' ? filtro : ''}
              </h3>
              <p className="text-gray-600">
                Não há solicitações de mudança de categoria no momento
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {solicitacoes.map((solicitacao) => (
                <div
                  key={solicitacao.id}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-4 flex-1">
                      {/* Avatar */}
                      <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center flex-shrink-0">
                        <User className="w-6 h-6 text-white" />
                      </div>

                      {/* Info */}
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-bold text-gray-900">
                            {solicitacao.jogadores.nome}
                          </h3>
                          <span className="text-sm text-gray-500">
                            {solicitacao.jogadores.genero === 'Masculino' ? '👨' : '👩'}
                          </span>
                        </div>

                        {solicitacao.jogadores.email && (
                          <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                            <Mail className="w-4 h-4" />
                            {solicitacao.jogadores.email}
                          </div>
                        )}

                        {/* Mudança de Categoria */}
                        <div className="flex items-center gap-3 mb-3">
                          <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-bold">
                            Categoria {solicitacao.categoria_atual}
                          </span>
                          <TrendingDown className="w-5 h-5 text-gray-400" />
                          <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-bold">
                            Categoria {solicitacao.categoria_solicitada}
                          </span>
                        </div>

                        {/* Motivo */}
                        <div className="bg-gray-50 rounded-lg p-3 mb-3">
                          <div className="text-xs font-semibold text-gray-500 uppercase mb-1">
                            Motivo
                          </div>
                          <p className="text-sm text-gray-700">{solicitacao.motivo}</p>
                        </div>

                        {/* Info adicional */}
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <div className="flex items-center gap-1">
                            <Trophy className="w-3 h-3" />
                            {solicitacao.jogadores.pontos} pontos
                          </div>
                          <div>
                            Solicitado em {new Date(solicitacao.data_solicitacao).toLocaleDateString('pt-BR')}
                          </div>
                        </div>

                        {/* Resposta do admin (se houver) */}
                        {solicitacao.resposta_admin && (
                          <div className="mt-3 bg-blue-50 border border-blue-200 rounded-lg p-3">
                            <div className="text-xs font-semibold text-blue-700 uppercase mb-1">
                              Resposta do Administrador
                            </div>
                            <p className="text-sm text-blue-900">{solicitacao.resposta_admin}</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Status Badge */}
                    <div>
                      {solicitacao.status === 'pendente' && (
                        <span className="inline-flex items-center gap-2 px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-semibold">
                          <Clock className="w-4 h-4" />
                          Pendente
                        </span>
                      )}
                      {solicitacao.status === 'aprovada' && (
                        <span className="inline-flex items-center gap-2 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
                          <CheckCircle className="w-4 h-4" />
                          Aprovada
                        </span>
                      )}
                      {solicitacao.status === 'rejeitada' && (
                        <span className="inline-flex items-center gap-2 px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-semibold">
                          <XCircle className="w-4 h-4" />
                          Rejeitada
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Ações (só para pendentes) */}
                  {solicitacao.status === 'pendente' && (
                    <div className="flex gap-3 pt-4 border-t border-gray-200">
                      <button
                        onClick={() => {
                          setModalAberto(solicitacao.id);
                          setRespostaAdmin('');
                        }}
                        disabled={processando === solicitacao.id}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold disabled:opacity-50"
                      >
                        {processando === solicitacao.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <CheckCircle className="w-4 h-4" />
                        )}
                        Aprovar
                      </button>
                      <button
                        onClick={() => {
                          setModalAberto(`rejeitar-${solicitacao.id}`);
                          setRespostaAdmin('');
                        }}
                        disabled={processando === solicitacao.id}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold disabled:opacity-50"
                      >
                        {processando === solicitacao.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <XCircle className="w-4 h-4" />
                        )}
                        Rejeitar
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </main>

        {/* Modal de Confirmação */}
        {modalAberto && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                {modalAberto.startsWith('rejeitar-') ? 'Rejeitar Solicitação' : 'Aprovar Solicitação'}
              </h3>
              
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Mensagem para o jogador {modalAberto.startsWith('rejeitar-') ? '(obrigatório)' : '(opcional)'}
                </label>
                <textarea
                  value={respostaAdmin}
                  onChange={(e) => setRespostaAdmin(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                  rows={4}
                  placeholder="Ex: Aprovado para ajustar o nível de competitividade..."
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setModalAberto(null);
                    setRespostaAdmin('');
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => {
                    const id = modalAberto.replace('rejeitar-', '');
                    if (modalAberto.startsWith('rejeitar-')) {
                      handleRejeitar(id);
                    } else {
                      handleAprovar(id);
                    }
                  }}
                  disabled={modalAberto.startsWith('rejeitar-') && !respostaAdmin.trim()}
                  className={`flex-1 px-4 py-2 text-white rounded-lg transition-colors font-semibold disabled:opacity-50 ${
                    modalAberto.startsWith('rejeitar-')
                      ? 'bg-red-600 hover:bg-red-700'
                      : 'bg-green-600 hover:bg-green-700'
                  }`}
                >
                  Confirmar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}