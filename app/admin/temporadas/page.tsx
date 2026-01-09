'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Calendar, 
  Plus, 
  Archive, 
  CheckCircle, 
  AlertCircle,
  Trophy,
  Users,
  Target,
  Clock,
  Play,
  Pause,
  ArrowRight,
  X,
  Info,
  RotateCcw
} from 'lucide-react';
import ProtectedRoute from '@/components/admin/ProtectedRoute';
import AdminHeader from '@/components/Header';
import { 
  getTemporadas,
  criarTemporada,
  ativarTemporada,
  encerrarTemporada,
  resetarPontosJogadores
} from '@/lib/api/temporadas';
import { supabase } from '@/lib/supabase';
import { Temporada } from '@/types/temporada';

interface TemporadaComStats extends Temporada {
  total_torneios?: number;
  total_jogadores?: number;
}

type Etapa = 1 | 2 | 3 | 4 | 5;

export default function TemporadasAdminPage() {
  const router = useRouter();
  const [temporadas, setTemporadas] = useState<TemporadaComStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalAberto, setModalAberto] = useState(false);
  const [wizardAberto, setWizardAberto] = useState(false);
  const [processando, setProcessando] = useState(false);
  const [erro, setErro] = useState('');

  // Wizard state
  const [etapaWizard, setEtapaWizard] = useState<Etapa>(1);
  const [dadosWizard, setDadosWizard] = useState({
    temporadaAntigaId: '',
    temporadaAntigaNome: '',
    novoAno: new Date().getFullYear() + 1,
    novoNome: '',
    novaDataInicio: '',
    novaTemporadaId: '',
  });

  // Form state (modal simples)
  const [novaTemporada, setNovaTemporada] = useState({
    ano: new Date().getFullYear(),
    nome: '',
    data_inicio: new Date().toISOString().split('T')[0],
    descricao: '',
  });

  useEffect(() => {
    carregarTemporadas();
  }, []);

  const carregarTemporadas = async () => {
    setLoading(true);
    const data = await getTemporadas();
    
    const temporadasComStats = await Promise.all(
      data.map(async (t) => {
        const { count: totalTorneios } = await supabase
          .from('torneios')
          .select('*', { count: 'exact', head: true })
          .eq('temporada_id', t.id);

        const { count: totalJogadores } = await supabase
          .from('rankings_temporada')
          .select('*', { count: 'exact', head: true })
          .eq('temporada_id', t.id);

        return {
          ...t,
          total_torneios: totalTorneios || 0,
          total_jogadores: totalJogadores || 0,
        };
      })
    );

    setTemporadas(temporadasComStats);
    setLoading(false);
  };

  const handleCriarTemporada = async () => {
    setErro('');
    setProcessando(true);

    try {
      const resultado = await criarTemporada({
        ano: novaTemporada.ano,
        nome: novaTemporada.nome || `Temporada ${novaTemporada.ano}`,
        data_inicio: novaTemporada.data_inicio,
        descricao: novaTemporada.descricao,
        ativar: false,
      });

      if (!resultado.success) {
        setErro(resultado.error || 'Erro ao criar temporada');
        setProcessando(false);
        return;
      }

      alert('✅ Temporada criada com sucesso!');
      setModalAberto(false);
      carregarTemporadas();
      
      setNovaTemporada({
        ano: new Date().getFullYear() + 1,
        nome: '',
        data_inicio: new Date().toISOString().split('T')[0],
        descricao: '',
      });
    } catch (error: any) {
      setErro(error.message);
    }
    
    setProcessando(false);
  };

  const handleAtivarTemporada = async (id: string, ano: number) => {
    if (!confirm(`Deseja ativar a temporada ${ano}?\n\nIsso irá desativar automaticamente a temporada atual.`)) {
      return;
    }

    setProcessando(true);
    const resultado = await ativarTemporada(id);
    
    if (resultado.success) {
      alert('✅ Temporada ativada com sucesso!');
      carregarTemporadas();
    } else {
      alert('❌ Erro: ' + resultado.error);
    }
    
    setProcessando(false);
  };

  const handleEncerrarTemporada = async (id: string, ano: number) => {
    const confirmacao = confirm(
      `⚠️ ATENÇÃO: Deseja encerrar a temporada ${ano}?\n\n` +
      `Isso irá:\n` +
      `✅ Criar snapshot do ranking final\n` +
      `✅ Desativar a temporada\n` +
      `✅ Preservar todos os dados\n\n` +
      `Esta ação NÃO pode ser desfeita!`
    );

    if (!confirmacao) return;

    setProcessando(true);
    const resultado = await encerrarTemporada(id);
    
    if (resultado.success) {
      alert('✅ Temporada encerrada e snapshot criado com sucesso!');
      carregarTemporadas();
    } else {
      alert('❌ Erro: ' + resultado.error);
    }
    
    setProcessando(false);
  };

  const handleResetarPontos = async () => {
    const confirmacao = confirm(
      `⚠️ PERIGO: Resetar pontos de TODOS os jogadores?\n\n` +
      `Esta ação irá:\n` +
      `❌ ZERAR pontos de todos os jogadores\n` +
      `❌ ZERAR torneios disputados\n\n` +
      `Use apenas ao INICIAR uma NOVA TEMPORADA!\n\n` +
      `Esta ação NÃO pode ser desfeita!\n\n` +
      `Tem CERTEZA ABSOLUTA?`
    );

    if (!confirmacao) return;

    setProcessando(true);
    const resultado = await resetarPontosJogadores();
    
    if (resultado.success) {
      alert('✅ Pontos resetados com sucesso! Todos os jogadores começam do zero.');
      router.refresh();
    } else {
      alert('❌ Erro: ' + resultado.error);
    }
    
    setProcessando(false);
  };

  // ========================================
  // FUNÇÕES DO WIZARD
  // ========================================

  const iniciarWizard = () => {
    const temporadaAtiva = temporadas.find(t => t.ativa);
    if (temporadaAtiva) {
      setDadosWizard({
        ...dadosWizard,
        temporadaAntigaId: temporadaAtiva.id,
        temporadaAntigaNome: temporadaAtiva.nome,
        novoAno: temporadaAtiva.ano + 1,
        novoNome: `Temporada ${temporadaAtiva.ano + 1}`,
        novaDataInicio: `${temporadaAtiva.ano + 1}-01-01`,
      });
    }
    setEtapaWizard(1);
    setWizardAberto(true);
  };

  const executarEtapaWizard1 = () => setEtapaWizard(2);

  const executarEtapaWizard2 = async () => {
    if (!dadosWizard.temporadaAntigaId) {
      setErro('Temporada antiga não encontrada');
      return;
    }

    setProcessando(true);
    setErro('');

    const resultado = await encerrarTemporada(dadosWizard.temporadaAntigaId);
    
    if (!resultado.success) {
      setErro(resultado.error || 'Erro ao encerrar temporada');
      setProcessando(false);
      return;
    }

    alert('✅ Temporada encerrada e snapshot criado com sucesso!');
    setEtapaWizard(3);
    setProcessando(false);
  };

  const executarEtapaWizard3 = async () => {
    if (!dadosWizard.novoNome || !dadosWizard.novaDataInicio) {
      setErro('Preencha todos os campos');
      return;
    }

    setProcessando(true);
    setErro('');

    const resultado = await criarTemporada({
      ano: dadosWizard.novoAno,
      nome: dadosWizard.novoNome,
      data_inicio: dadosWizard.novaDataInicio,
      ativar: false,
    });
    
    if (!resultado.success) {
      setErro(resultado.error || 'Erro ao criar temporada');
      setProcessando(false);
      return;
    }

    setDadosWizard({ ...dadosWizard, novaTemporadaId: resultado.temporada!.id });
    alert('✅ Nova temporada criada com sucesso!');
    setEtapaWizard(4);
    setProcessando(false);
  };

  const executarEtapaWizard4 = async () => {
    const confirmacao = confirm(
      '⚠️ ATENÇÃO!\n\n' +
      'Você está prestes a ZERAR os pontos de TODOS os jogadores.\n\n' +
      'Esta ação NÃO pode ser desfeita!\n\n' +
      'Tem certeza?'
    );

    if (!confirmacao) return;

    setProcessando(true);
    setErro('');

    const resultado = await resetarPontosJogadores();
    
    if (!resultado.success) {
      setErro(resultado.error || 'Erro ao resetar pontos');
      setProcessando(false);
      return;
    }

    alert('✅ Pontos resetados com sucesso!');
    setEtapaWizard(5);
    setProcessando(false);
  };

  const executarEtapaWizard5 = async () => {
    if (!dadosWizard.novaTemporadaId) {
      setErro('ID da nova temporada não encontrado');
      return;
    }

    setProcessando(true);
    setErro('');

    const resultado = await ativarTemporada(dadosWizard.novaTemporadaId);
    
    if (!resultado.success) {
      setErro(resultado.error || 'Erro ao ativar temporada');
      setProcessando(false);
      return;
    }

    alert('🎉 VIRADA DE ANO CONCLUÍDA COM SUCESSO!');
    setWizardAberto(false);
    carregarTemporadas();
    setProcessando(false);
  };

  const etapasWizard = [
    { numero: 1, titulo: 'Preparação', icone: Info },
    { numero: 2, titulo: 'Encerrar Antiga', icone: Archive },
    { numero: 3, titulo: 'Criar Nova', icone: Calendar },
    { numero: 4, titulo: 'Resetar Pontos', icone: RotateCcw },
    { numero: 5, titulo: 'Ativar Nova', icone: Play },
  ];

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <AdminHeader />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Gerenciar Temporadas</h1>
                <p className="text-gray-600 mt-1">Controle os anos e períodos do ranking</p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={iniciarWizard}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition-colors shadow-lg font-bold"
                >
                  🎆 Wizard Virada de Ano
                </button>
                <button
                  onClick={() => setModalAberto(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                >
                  <Plus className="w-5 h-5" />
                  Nova Temporada
                </button>
              </div>
            </div>
          </div>

          {/* Cards de Ações Críticas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {/* Card: Wizard */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Trophy className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-green-900 mb-1">🎆 Virada de Ano Segura</h3>
                  <p className="text-sm text-green-700 mb-3">
                    Processo guiado passo a passo. Impossível errar a ordem!
                  </p>
                  <button
                    onClick={iniciarWizard}
                    className="text-sm px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-bold"
                  >
                    Iniciar Wizard
                  </button>
                </div>
              </div>
            </div>

            {/* Card: Resetar Pontos */}
            <div className="bg-gradient-to-br from-red-50 to-orange-50 border-2 border-red-200 rounded-xl p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-red-500 rounded-xl flex items-center justify-center flex-shrink-0">
                  <AlertCircle className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-red-900 mb-1">Resetar Pontos (Avançado)</h3>
                  <p className="text-sm text-red-700 mb-3">
                    Zera pontos de TODOS. Use apenas se souber o que está fazendo!
                  </p>
                  <button
                    onClick={handleResetarPontos}
                    disabled={processando}
                    className="text-sm px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                  >
                    🚨 Resetar Pontos
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Lista de Temporadas */}
          {loading ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">Carregando temporadas...</p>
            </div>
          ) : (
            <div className="space-y-4">
              {temporadas.map((temporada) => (
                <div
                  key={temporada.id}
                  className={`bg-white rounded-xl shadow-sm border-2 overflow-hidden transition-all ${
                    temporada.ativa 
                      ? 'border-green-500 shadow-lg' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`w-16 h-16 rounded-xl flex items-center justify-center ${
                          temporada.ativa 
                            ? 'bg-green-100 text-green-600' 
                            : 'bg-gray-100 text-gray-600'
                        }`}>
                          <Calendar className="w-8 h-8" />
                        </div>
                        
                        <div>
                          <div className="flex items-center gap-3 mb-1">
                            <h3 className="text-xl font-bold text-gray-900">
                              {temporada.nome}
                            </h3>
                            {temporada.ativa && (
                              <span className="inline-flex items-center gap-1 text-xs bg-green-500 text-white px-3 py-1 rounded-full">
                                <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                                Ativa
                              </span>
                            )}
                          </div>
                          
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <span className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {new Date(temporada.data_inicio).toLocaleDateString('pt-BR')}
                              {temporada.data_fim && ` - ${new Date(temporada.data_fim).toLocaleDateString('pt-BR')}`}
                            </span>
                            <span className="flex items-center gap-1">
                              <Target className="w-4 h-4" />
                              {temporada.total_torneios || 0} torneios
                            </span>
                            <span className="flex items-center gap-1">
                              <Users className="w-4 h-4" />
                              {temporada.total_jogadores || 0} jogadores
                            </span>
                          </div>

                          {temporada.descricao && (
                            <p className="text-sm text-gray-500 mt-2">{temporada.descricao}</p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {!temporada.ativa && !temporada.data_fim && (
                          <button
                            onClick={() => handleAtivarTemporada(temporada.id, temporada.ano)}
                            disabled={processando}
                            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                          >
                            <Play className="w-4 h-4" />
                            Ativar
                          </button>
                        )}

                        {temporada.ativa && (
                          <button
                            onClick={() => handleEncerrarTemporada(temporada.id, temporada.ano)}
                            disabled={processando}
                            className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50"
                          >
                            <Pause className="w-4 h-4" />
                            Encerrar
                          </button>
                        )}

                        {temporada.data_fim && (
                          <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-600 rounded-lg">
                            <Archive className="w-4 h-4" />
                            Encerrada
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {temporadas.length === 0 && (
                <div className="text-center py-12 bg-white rounded-xl border-2 border-dashed border-gray-300">
                  <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">Nenhuma temporada cadastrada</p>
                  <button
                    onClick={() => setModalAberto(true)}
                    className="text-primary-600 hover:text-primary-700 font-semibold"
                  >
                    Criar primeira temporada
                  </button>
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      {/* Modal: Nova Temporada Simples */}
      {modalAberto && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setModalAberto(false)}
        >
          <div 
            className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-gradient-to-r from-primary-500 to-primary-600 px-6 py-4 flex items-center justify-between rounded-t-2xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                  <Plus className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Nova Temporada</h2>
                  <p className="text-sm text-primary-100">Criar novo período de ranking</p>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-4">
              {erro && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 text-sm">
                  {erro}
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Ano <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={novaTemporada.ano}
                    onChange={(e) => setNovaTemporada({...novaTemporada, ano: parseInt(e.target.value)})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    min={2024}
                    max={2099}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Data de Início <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={novaTemporada.data_inicio}
                    onChange={(e) => setNovaTemporada({...novaTemporada, data_inicio: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Nome da Temporada <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={novaTemporada.nome}
                  onChange={(e) => setNovaTemporada({...novaTemporada, nome: e.target.value})}
                  placeholder={`Temporada ${novaTemporada.ano}`}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Descrição (opcional)
                </label>
                <textarea
                  value={novaTemporada.descricao}
                  onChange={(e) => setNovaTemporada({...novaTemporada, descricao: e.target.value})}
                  placeholder="Ex: Temporada inaugural do novo sistema..."
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                />
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-900">
                  💡 <strong>Dica:</strong> A nova temporada será criada como inativa. 
                  Você pode ativá-la depois usando o botão &quot;Ativar&quot;.
                </p>
              </div>
            </div>

            <div className="bg-gray-50 px-6 py-4 flex items-center justify-end gap-3 border-t border-gray-200 rounded-b-2xl">
              <button
                onClick={() => setModalAberto(false)}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleCriarTemporada}
                disabled={processando}
                className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50"
              >
                {processando ? 'Criando...' : 'Criar Temporada'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: WIZARD VIRADA DE ANO */}
      {wizardAberto && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto"
          onClick={() => !processando && setWizardAberto(false)}
        >
          <div 
            className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full my-8"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header Wizard */}
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 px-6 py-4 flex items-center justify-between rounded-t-2xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                  <Trophy className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">🎆 Wizard de Virada de Ano</h2>
                  <p className="text-sm text-green-100">Processo guiado - Impossível errar!</p>
                </div>
              </div>
              {!processando && (
                <button
                  onClick={() => setWizardAberto(false)}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
              )}
            </div>

            {/* Progress Bar */}
            <div className="bg-gray-50 p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                {etapasWizard.map((etapa, index) => (
                  <div key={etapa.numero} className="flex items-center flex-1">
                    <div className="flex flex-col items-center flex-1">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 ${
                        etapaWizard > etapa.numero 
                          ? 'bg-green-500 text-white'
                          : etapaWizard === etapa.numero
                          ? 'bg-primary-600 text-white'
                          : 'bg-gray-200 text-gray-500'
                      }`}>
                        {etapaWizard > etapa.numero ? (
                          <CheckCircle className="w-6 h-6" />
                        ) : (
                          <etapa.icone className="w-6 h-6" />
                        )}
                      </div>
                      <span className={`text-xs font-medium text-center ${
                        etapaWizard >= etapa.numero ? 'text-gray-900' : 'text-gray-500'
                      }`}>
                        {etapa.titulo}
                      </span>
                    </div>
                    {index < etapasWizard.length - 1 && (
                      <div className={`h-1 flex-1 mx-2 ${
                        etapaWizard > etapa.numero ? 'bg-green-500' : 'bg-gray-200'
                      }`}></div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Erro */}
            {erro && (
              <div className="mx-6 mt-6 bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-red-600" />
                  <p className="text-red-800 font-medium">{erro}</p>
                </div>
              </div>
            )}

            {/* Conteúdo das Etapas */}
            <div className="p-8">
              
              {/* ETAPA 1: Preparação */}
              {etapaWizard === 1 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    📋 Preparação - Leia com Atenção
                  </h2>
                  
                  <div className="bg-yellow-50 border-2 border-yellow-300 rounded-lg p-6">
                    <h3 className="font-bold text-yellow-900 mb-3 flex items-center gap-2">
                      <AlertCircle className="w-5 h-5" />
                      ⚠️ IMPORTANTE: Ordem das Ações
                    </h3>
                    <ol className="list-decimal list-inside space-y-2 text-yellow-900">
                      <li className="font-semibold">Encerrar temporada antiga (cria snapshot COM pontos)</li>
                      <li className="font-semibold">Criar nova temporada</li>
                      <li className="font-semibold">Resetar pontos (agora sim pode zerar)</li>
                      <li className="font-semibold">Ativar nova temporada</li>
                    </ol>
                    <p className="mt-4 text-sm text-yellow-800">
                      💡 Este wizard faz tudo na ordem correta automaticamente!
                    </p>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                    <h3 className="font-bold text-blue-900 mb-3">
                      ✅ O que será feito:
                    </h3>
                    <ul className="space-y-2 text-blue-800 text-sm">
                      <li>✓ Preservar histórico completo da temporada antiga</li>
                      <li>✓ Criar snapshot do ranking final</li>
                      <li>✓ Configurar nova temporada</li>
                      <li>✓ Zerar pontos de todos os jogadores</li>
                      <li>✓ Ativar nova temporada</li>
                    </ul>
                  </div>

                  <button
                    onClick={executarEtapaWizard1}
                    className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-bold"
                  >
                    Iniciar Processo
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              )}

              {/* ETAPA 2: Encerrar */}
              {etapaWizard === 2 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    📁 Encerrar Temporada: {dadosWizard.temporadaAntigaNome}
                  </h2>
                  
                  <p className="text-gray-600">
                    Isso irá criar um snapshot do ranking atual e marcar a temporada como encerrada.
                  </p>

                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                    <p className="text-sm text-orange-900">
                      ⚠️ Certifique-se de que todos os torneios foram finalizados antes de encerrar!
                    </p>
                  </div>

                  <button
                    onClick={executarEtapaWizard2}
                    disabled={processando}
                    className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-bold disabled:opacity-50"
                  >
                    {processando ? 'Processando...' : 'Encerrar Temporada'}
                    <Archive className="w-5 h-5" />
                  </button>
                </div>
              )}

              {/* ETAPA 3: Criar Nova */}
              {etapaWizard === 3 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    📅 Criar Nova Temporada
                  </h2>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Ano</label>
                      <input
                        type="number"
                        value={dadosWizard.novoAno}
                        onChange={(e) => setDadosWizard({...dadosWizard, novoAno: parseInt(e.target.value)})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Nome</label>
                      <input
                        type="text"
                        value={dadosWizard.novoNome}
                        onChange={(e) => setDadosWizard({...dadosWizard, novoNome: e.target.value})}
                        placeholder={`Temporada ${dadosWizard.novoAno}`}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Data de Início</label>
                      <input
                        type="date"
                        value={dadosWizard.novaDataInicio}
                        onChange={(e) => setDadosWizard({...dadosWizard, novaDataInicio: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                      />
                    </div>
                  </div>

                  <button
                    onClick={executarEtapaWizard3}
                    disabled={processando}
                    className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-bold disabled:opacity-50"
                  >
                    {processando ? 'Criando...' : 'Criar Temporada'}
                    <Calendar className="w-5 h-5" />
                  </button>
                </div>
              )}

              {/* ETAPA 4: Resetar */}
              {etapaWizard === 4 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    🔄 Resetar Pontos
                  </h2>
                  
                  <div className="bg-red-50 border-2 border-red-300 rounded-lg p-6">
                    <h3 className="font-bold text-red-900 mb-3 flex items-center gap-2">
                      <AlertCircle className="w-5 h-5" />
                      ⚠️ ATENÇÃO: Ação Irreversível
                    </h3>
                    <p className="text-red-800 mb-4">
                      Isso irá zerar os pontos e torneios disputados de TODOS os jogadores.
                    </p>
                    <ul className="list-disc list-inside space-y-1 text-red-800 text-sm">
                      <li>Histórico da temporada antiga JÁ FOI SALVO ✓</li>
                      <li>Todos começam do zero na nova temporada</li>
                      <li>Esta ação não pode ser desfeita</li>
                    </ul>
                  </div>

                  <button
                    onClick={executarEtapaWizard4}
                    disabled={processando}
                    className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-bold disabled:opacity-50"
                  >
                    {processando ? 'Resetando...' : 'Resetar Pontos'}
                    <RotateCcw className="w-5 h-5" />
                  </button>
                </div>
              )}

              {/* ETAPA 5: Ativar */}
              {etapaWizard === 5 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    🚀 Ativar Nova Temporada
                  </h2>
                  
                  <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                    <h3 className="font-bold text-green-900 mb-3">
                      ✅ Tudo Pronto!
                    </h3>
                    <ul className="space-y-2 text-green-800 text-sm">
                      <li>✓ Temporada antiga encerrada e preservada</li>
                      <li>✓ Nova temporada criada</li>
                      <li>✓ Pontos resetados</li>
                      <li>✓ Pronto para ativar!</li>
                    </ul>
                  </div>

                  <button
                    onClick={executarEtapaWizard5}
                    disabled={processando}
                    className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-bold disabled:opacity-50"
                  >
                    {processando ? 'Ativando...' : '🎉 Ativar e Finalizar'}
                    <Play className="w-5 h-5" />
                  </button>
                </div>
              )}

            </div>
          </div>
        </div>
      )}
    </ProtectedRoute>
  );
}