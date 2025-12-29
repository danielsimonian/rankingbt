'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft, Upload, Download, Users, Trophy,
  CheckCircle, AlertCircle, Info, Loader2
} from 'lucide-react';
import ProtectedRoute from '@/components/admin/ProtectedRoute';
import { verificarAdmin } from '@/lib/auth';
import { supabase } from '@/lib/supabase';
import { Categoria, Genero } from '@/types/database';

interface JogadorImport {
  nome: string;
  email?: string;
  telefone?: string;
  cidade?: string;
  categoria: Categoria;
  genero: Genero;
  status?: 'novo' | 'existente' | 'erro';
  erro?: string;
}

interface ResultadoImport {
  nome_jogador: string;
  colocacao: string;
  categoria: Categoria; // ← NOVO!
  jogador_id?: string;
  pontos?: number;
  status?: 'ok' | 'erro';
  erro?: string;
}

export default function ImportarPage() {
  const [activeTab, setActiveTab] = useState<'jogadores' | 'resultados'>('jogadores');
  const [loading, setLoading] = useState(false);
  const [importing, setImporting] = useState(false);
  
  const [jogadoresPreview, setJogadoresPreview] = useState<JogadorImport[]>([]);
  const [jogadoresTexto, setJogadoresTexto] = useState('');
  
  const [torneioSelecionado, setTorneioSelecionado] = useState('');
  const [torneios, setTorneios] = useState<any[]>([]);
  const [resultadosPreview, setResultadosPreview] = useState<ResultadoImport[]>([]);
  const [resultadosTexto, setResultadosTexto] = useState('');

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

    const { data } = await supabase
      .from('torneios')
      .select('*')
      .order('data', { ascending: false });
    
    if (data) {
      setTorneios(data);
    }
  };

  // ==================== JOGADORES ====================

  const handleJogadoresFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    const text = await file.text();
    processarJogadoresCSV(text);
    setLoading(false);
  };

  const processarJogadoresTexto = () => {
    setLoading(true);
    processarJogadoresCSV(jogadoresTexto);
    setLoading(false);
  };

  const processarJogadoresCSV = (text: string) => {
    const lines = text.trim().split('\n');
    const jogadores: JogadorImport[] = [];

    const hasHeader = lines[0].toLowerCase().includes('nome');
    const startIndex = hasHeader ? 1 : 0;

    for (let i = startIndex; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      const parts = line.split(',').map(p => p.trim());
      
      if (parts.length >= 2) {
        const jogador: JogadorImport = {
          nome: parts[0],
          email: parts[1] || undefined,
          telefone: parts[2] || undefined,
          cidade: parts[3] || undefined,
          categoria: (parts[4]?.toUpperCase() || 'FUN') as Categoria,
          genero: (parts[5] || 'Masculino') as Genero,
        };

        if (!jogador.nome) {
          jogador.status = 'erro';
          jogador.erro = 'Nome obrigatório';
        } else if (!['A', 'B', 'C', 'D', 'FUN'].includes(jogador.categoria)) {
          jogador.status = 'erro';
          jogador.erro = 'Categoria inválida';
        } else {
          jogador.status = 'novo';
        }

        jogadores.push(jogador);
      }
    }

    setJogadoresPreview(jogadores);
  };

const importarJogadores = async () => {
    setImporting(true);

    try {
      const jogadoresValidos = jogadoresPreview.filter(j => j.status !== 'erro');
      let novos = 0;
      let atualizados = 0;
      
      for (const jogador of jogadoresValidos) {
        // Verifica se já existe (case-insensitive e ignora acentos)
        const { data: existente } = await supabase
          .from('jogadores')
          .select('id')
          .ilike('nome', jogador.nome)
          .single();

        if (existente) {
          // ✅ Jogador já existe - APENAS atualiza dados de contato
          // NÃO atualiza categoria (será recalculada automaticamente pelo trigger)
          await supabase
            .from('jogadores')
            .update({
              email: jogador.email || null,
              telefone: jogador.telefone || null,
              cidade: jogador.cidade || null,
              genero: jogador.genero,
            })
            .eq('id', existente.id);
          
          atualizados++;
        } else {
          // ✅ Jogador novo - cria com categoria inicial
          await supabase
            .from('jogadores')
            .insert({
              nome: jogador.nome,
              email: jogador.email,
              telefone: jogador.telefone,
              cidade: jogador.cidade,
              categoria: jogador.categoria, // Categoria inicial (será ajustada pelo trigger)
              genero: jogador.genero,
              pontos: 0,
              torneios_disputados: 0,
            });
          
          novos++;
        }
      }

      alert(`✅ Importação concluída!\n\n📊 Novos: ${novos}\n🔄 Atualizados: ${atualizados}\n\n💡 Categoria será calculada automaticamente após adicionar resultados.`);
      setJogadoresPreview([]);
      setJogadoresTexto('');
      
    } catch (error: any) {
      alert(`Erro ao importar: ${error.message}`);
    }

    setImporting(false);
  };

  // ==================== RESULTADOS ====================

  const processarResultadosTexto = async () => {
    if (!torneioSelecionado) {
      alert('Selecione um torneio primeiro!');
      return;
    }

    setLoading(true);

    const { data: torneioData } = await supabase
      .from('torneios')
      .select('pontuacao_custom')
      .eq('id', torneioSelecionado)
      .single();

    const lines = resultadosTexto.trim().split('\n');
    const resultados: ResultadoImport[] = [];

    const { data: jogadores } = await supabase
      .from('jogadores')
      .select('id, nome');

    const hasHeader = lines[0].toLowerCase().includes('nome');
    const startIndex = hasHeader ? 1 : 0;

    for (let i = startIndex; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      const parts = line.split(',').map(p => p.trim());
      
      // FORMATO: nome_jogador,colocacao,categoria
      if (parts.length >= 3) {
        const nomeJogador = parts[0];
        const colocacao = parts[1];
        const categoria = parts[2].toUpperCase() as Categoria;

        // ✅ Busca case-insensitive
        const jogador = jogadores?.find(j => 
          j.nome.toLowerCase().trim() === nomeJogador.toLowerCase().trim()
        );

        const resultado: ResultadoImport = {
          nome_jogador: nomeJogador,
          colocacao: colocacao,
          categoria: categoria,
          jogador_id: jogador?.id,
        };

        if (!jogador) {
          resultado.status = 'erro';
          resultado.erro = 'Jogador não cadastrado - importe primeiro na aba Jogadores';
        } else if (!['A', 'B', 'C', 'D', 'FUN'].includes(categoria)) {
          resultado.status = 'erro';
          resultado.erro = 'Categoria inválida';
        } else {
          resultado.status = 'ok';
          resultado.pontos = calcularPontosDinamico(colocacao, torneioData?.pontuacao_custom);
        }

        resultados.push(resultado);
      }
    }

    setResultadosPreview(resultados);
    setLoading(false);
  };

  const calcularPontosDinamico = (colocacao: string, pontuacaoCustom: any): number => {
    if (!pontuacaoCustom) {
      const pontosPadrao: Record<string, number> = {
        'Campeão': 100,
        'Vice': 60,
        '3º Lugar': 36,
        'Quartas de Final': 18,
        'Oitavas de Final': 9,
        'Participação': 4,
      };
      return pontosPadrao[colocacao] || 0;
    }

    const mapa: Record<string, keyof typeof pontuacaoCustom> = {
      'Campeão': 'campeao',
      'Vice': 'vice',
      '3º Lugar': 'terceiro',
      'Quartas de Final': 'quartas',
      'Oitavas de Final': 'oitavas',
      'Participação': 'participacao',
    };
    
    const chave = mapa[colocacao];
    return chave ? (pontuacaoCustom[chave] as number) : 0;
  };

  const importarResultados = async () => {
    if (!torneioSelecionado) {
      alert('Selecione um torneio!');
      return;
    }

    setImporting(true);

    try {
      const resultadosValidos = resultadosPreview.filter(r => r.status === 'ok');

      for (const resultado of resultadosValidos) {
        // Inserir resultado COM categoria_jogada
        await supabase
          .from('resultados')
          .insert({
            torneio_id: torneioSelecionado,
            jogador_id: resultado.jogador_id,
            colocacao: resultado.colocacao,
            pontos_ganhos: resultado.pontos,
            categoria_jogada: resultado.categoria, // ← CATEGORIA VEM DO CSV!
          });

        // ✅ TRIGGER RECALCULA AUTOMATICAMENTE!
        // NÃO precisa atualizar pontos manualmente!
      }

      alert(`✅ ${resultadosValidos.length} resultado(s) importado(s)!\n🔄 Categorias e pontos recalculados automaticamente!`);
      setResultadosPreview([]);
      setResultadosTexto('');
      
    } catch (error: any) {
      alert(`Erro ao importar: ${error.message}`);
    }

    setImporting(false);
  };

  const downloadTemplateJogadores = () => {
    const csv = `nome,email,telefone,cidade,categoria,genero
CORA LEITE LIMA,cora@email.com,(13)99999-9999,Santos,B,Feminino
MARIA SILVA,maria@email.com,(13)98888-8888,Guarujá,C,Feminino`;

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'template-jogadores.csv';
    a.click();
  };

  const downloadTemplateResultados = () => {
    const csv = `nome_jogador,colocacao,categoria
CORA LEITE LIMA,Campeão,B
MARIA SILVA,Vice,C
JOÃO SANTOS,3º Lugar,A`;

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'template-resultados.csv';
    a.click();
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
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
                  <h1 className="text-xl font-bold text-gray-900">Importar Dados</h1>
                  <p className="text-xs text-gray-500">Sistema com Categoria no CSV</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-8">
            <div className="flex border-b border-gray-200">
              <button
                onClick={() => setActiveTab('jogadores')}
                className={`flex-1 px-6 py-4 font-bold transition-colors ${
                  activeTab === 'jogadores'
                    ? 'bg-primary-50 text-primary-600 border-b-2 border-primary-600'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <Users className="w-5 h-5" />
                  Importar Jogadores
                </div>
              </button>
              <button
                onClick={() => setActiveTab('resultados')}
                className={`flex-1 px-6 py-4 font-bold transition-colors ${
                  activeTab === 'resultados'
                    ? 'bg-primary-50 text-primary-600 border-b-2 border-primary-600'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <Trophy className="w-5 h-5" />
                  Importar Resultados
                </div>
              </button>
            </div>

            {/* TAB JOGADORES */}
            {activeTab === 'jogadores' && (
              <div className="p-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <div className="flex gap-3">
                    <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-blue-900">
                      <h4 className="font-bold mb-2">📋 Formato CSV:</h4>
                      <code className="bg-white px-2 py-1 rounded text-xs">
                        nome,email,telefone,cidade,categoria,genero
                      </code>
                    </div>
                  </div>
                </div>

                <button
                  onClick={downloadTemplateJogadores}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 mb-6 font-semibold"
                >
                  <Download className="w-4 h-4" />
                  Baixar Template
                </button>

                <div className="mb-6">
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    📁 Upload CSV
                  </label>
                  <input
                    type="file"
                    accept=".csv,.txt"
                    onChange={handleJogadoresFileUpload}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
                  />
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    📝 Ou cole os dados
                  </label>
                  <textarea
                    value={jogadoresTexto}
                    onChange={(e) => setJogadoresTexto(e.target.value)}
                    placeholder="Cole aqui..."
                    className="w-full h-40 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 font-mono text-sm"
                  />
                  <button
                    onClick={processarJogadoresTexto}
                    disabled={!jogadoresTexto.trim() || loading}
                    className="mt-3 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-semibold disabled:opacity-50"
                  >
                    {loading ? 'Processando...' : 'Processar'}
                  </button>
                </div>

                {jogadoresPreview.length > 0 && (
                  <div className="bg-gray-50 border rounded-lg p-4">
                    <h3 className="font-bold mb-4 flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      Preview: {jogadoresPreview.length} jogador(es)
                    </h3>
                    <div className="space-y-2 max-h-80 overflow-y-auto mb-4">
                      {jogadoresPreview.map((j, i) => (
                        <div key={i} className={`p-3 rounded-lg ${j.status === 'erro' ? 'bg-red-50' : 'bg-white'}`}>
                          <div className="flex justify-between items-center">
                            <div>
                              <div className="font-semibold">{j.nome}</div>
                              <div className="text-sm text-gray-600">
                                {j.categoria} • {j.genero}
                              </div>
                            </div>
                            {j.status === 'erro' ? (
                              <span className="text-red-600 text-sm flex items-center gap-1">
                                <AlertCircle className="w-4 h-4" />
                                {j.erro}
                              </span>
                            ) : (
                              <CheckCircle className="w-5 h-5 text-green-600" />
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-end gap-3">
                      <button
                        onClick={() => {
                          setJogadoresPreview([]);
                          setJogadoresTexto('');
                        }}
                        className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                      >
                        Cancelar
                      </button>
                      <button
                        onClick={importarJogadores}
                        disabled={importing}
                        className="flex items-center gap-2 px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-semibold disabled:opacity-50"
                      >
                        {importing ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Importando...
                          </>
                        ) : (
                          <>
                            <Upload className="w-4 h-4" />
                            Importar {jogadoresPreview.filter(j => j.status !== 'erro').length}
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB RESULTADOS */}
            {activeTab === 'resultados' && (
              <div className="p-6">
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
                  <div className="flex gap-3">
                    <Info className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-amber-900">
                      <h4 className="font-bold mb-2">🎯 Formato CSV (COM CATEGORIA):</h4>
                      <code className="bg-white px-2 py-1 rounded text-xs block mb-2">
                        nome_jogador,colocacao,categoria
                      </code>
                      <p className="font-bold">
                        ⚡ A categoria é definida AQUI, não no torneio!
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    🏆 Selecione o Torneio
                  </label>
                  <select
                    value={torneioSelecionado}
                    onChange={(e) => setTorneioSelecionado(e.target.value)}
                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="">Escolha...</option>
                    {torneios.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.nome} - {new Date(t.data).toLocaleDateString('pt-BR')}
                      </option>
                    ))}
                  </select>
                </div>

                {torneioSelecionado && (
                  <>
                    <button
                      onClick={downloadTemplateResultados}
                      className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 mb-6 font-semibold"
                    >
                      <Download className="w-4 h-4" />
                      Template CSV
                    </button>

                    <textarea
                      value={resultadosTexto}
                      onChange={(e) => setResultadosTexto(e.target.value)}
                      placeholder="nome_jogador,colocacao,categoria"
                      className="w-full h-40 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 font-mono text-sm mb-3"
                    />
                    <button
                      onClick={processarResultadosTexto}
                      disabled={!resultadosTexto.trim() || loading}
                      className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-semibold disabled:opacity-50"
                    >
                      {loading ? 'Processando...' : 'Processar'}
                    </button>

                    {resultadosPreview.length > 0 && (
                      <div className="bg-gray-50 border rounded-lg p-4 mt-6">
                        <h3 className="font-bold mb-4">Preview: {resultadosPreview.length} resultado(s)</h3>
                        <div className="space-y-2 max-h-80 overflow-y-auto mb-4">
                          {resultadosPreview.map((r, i) => (
                            <div key={i} className={`p-3 rounded-lg ${r.status === 'erro' ? 'bg-red-50' : 'bg-white'}`}>
                              <div className="flex justify-between">
                                <div>
                                  <div className="font-semibold">{r.nome_jogador}</div>
                                  <div className="text-sm text-gray-600">
                                    {r.colocacao} • Categoria {r.categoria} • {r.pontos} pts
                                  </div>
                                </div>
                                {r.status === 'erro' ? (
                                  <span className="text-red-600 text-sm">{r.erro}</span>
                                ) : (
                                  <CheckCircle className="w-5 h-5 text-green-600" />
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="flex justify-end gap-3">
                          <button
                            onClick={() => {
                              setResultadosPreview([]);
                              setResultadosTexto('');
                            }}
                            className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                          >
                            Cancelar
                          </button>
                          <button
                            onClick={importarResultados}
                            disabled={importing}
                            className="flex items-center gap-2 px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-semibold disabled:opacity-50"
                          >
                            {importing ? (
                              <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Importando...
                              </>
                            ) : (
                              <>
                                <Upload className="w-4 h-4" />
                                Importar {resultadosPreview.filter(r => r.status === 'ok').length}
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}