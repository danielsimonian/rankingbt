'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft, Upload, Download, FileSpreadsheet, Users, Trophy,
  CheckCircle, AlertCircle, Info, Loader2, FileText, Copy
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
  jogador_id?: string;
  pontos?: number;
  status?: 'ok' | 'erro';
  erro?: string;
}

export default function ImportarPage() {
  const [activeTab, setActiveTab] = useState<'jogadores' | 'resultados'>('jogadores');
  const [loading, setLoading] = useState(false);
  const [importing, setImporting] = useState(false);
  
  // Jogadores
  const [jogadoresPreview, setJogadoresPreview] = useState<JogadorImport[]>([]);
  const [jogadoresTexto, setJogadoresTexto] = useState('');
  
  // Resultados
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

    // Buscar torneios
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

    // Detectar se tem header
    const hasHeader = lines[0].toLowerCase().includes('nome') || lines[0].toLowerCase().includes('jogador');
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

        // Validar
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
      
      for (const jogador of jogadoresValidos) {
        // Verificar se já existe
        const { data: existente } = await supabase
          .from('jogadores')
          .select('id')
          .eq('nome', jogador.nome)
          .single();

        if (existente) {
          // Atualizar
          await supabase
            .from('jogadores')
            .update({
              email: jogador.email,
              telefone: jogador.telefone,
              cidade: jogador.cidade,
              categoria: jogador.categoria,
              genero: jogador.genero,
            })
            .eq('id', existente.id);
        } else {
          // Criar novo
          await supabase
            .from('jogadores')
            .insert({
              nome: jogador.nome,
              email: jogador.email,
              telefone: jogador.telefone,
              cidade: jogador.cidade,
              categoria: jogador.categoria,
              genero: jogador.genero,
              pontos: 0,
              torneios_disputados: 0,
            });
        }
      }

      alert(`✅ ${jogadoresValidos.length} jogador(es) importado(s) com sucesso!`);
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

    const lines = resultadosTexto.trim().split('\n');
    const resultados: ResultadoImport[] = [];

    // Buscar todos os jogadores
    const { data: jogadores } = await supabase
      .from('jogadores')
      .select('id, nome');

    const hasHeader = lines[0].toLowerCase().includes('nome') || lines[0].toLowerCase().includes('jogador');
    const startIndex = hasHeader ? 1 : 0;

    for (let i = startIndex; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      const parts = line.split(',').map(p => p.trim());
      
      if (parts.length >= 2) {
        const nomeJogador = parts[0];
        const colocacao = parts[1];

        // Buscar jogador
        const jogador = jogadores?.find(j => 
          j.nome.toLowerCase() === nomeJogador.toLowerCase()
        );

        const resultado: ResultadoImport = {
          nome_jogador: nomeJogador,
          colocacao: colocacao,
          jogador_id: jogador?.id,
        };

        if (!jogador) {
          resultado.status = 'erro';
          resultado.erro = 'Jogador não cadastrado';
        } else {
          resultado.status = 'ok';
          // Calcular pontos baseado na colocação
          resultado.pontos = calcularPontos(colocacao);
        }

        resultados.push(resultado);
      }
    }

    setResultadosPreview(resultados);
    setLoading(false);
  };

  const calcularPontos = (colocacao: string): number => {
    const pontos: Record<string, number> = {
      'Campeão': 100,
      'Vice': 75,
      '3º Lugar': 50,
      'Quartas de Final': 25,
      'Oitavas de Final': 10,
      'Participação': 5,
    };

    return pontos[colocacao] || 0;
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
        // Inserir resultado
        await supabase
          .from('resultados')
          .insert({
            torneio_id: torneioSelecionado,
            jogador_id: resultado.jogador_id,
            colocacao: resultado.colocacao,
            pontos_ganhos: resultado.pontos,
          });

        // Atualizar pontos do jogador
        const { data: jogador } = await supabase
          .from('jogadores')
          .select('pontos, torneios_disputados')
          .eq('id', resultado.jogador_id)
          .single();

        if (jogador) {
          await supabase
            .from('jogadores')
            .update({
              pontos: jogador.pontos + (resultado.pontos || 0),
              torneios_disputados: jogador.torneios_disputados + 1,
            })
            .eq('id', resultado.jogador_id);
        }
      }

      alert(`✅ ${resultadosValidos.length} resultado(s) importado(s) com sucesso!`);
      setResultadosPreview([]);
      setResultadosTexto('');
      
    } catch (error: any) {
      alert(`Erro ao importar: ${error.message}`);
    }

    setImporting(false);
  };

  const downloadTemplateJogadores = () => {
    const csv = `nome,email,telefone,cidade,categoria,genero
Daniel Simonian,daniel@email.com,(13)99743-4878,Santos,A,Masculino
Fernanda Lima,fernanda@email.com,(13)98765-4321,Guarujá,B,Feminino
Carlos Silva,carlos@email.com,(13)97654-3210,São Vicente,A,Masculino`;

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'template-jogadores.csv';
    a.click();
  };

  const downloadTemplateResultados = () => {
    const csv = `nome_jogador,colocacao
Daniel Simonian,Campeão
Fernanda Lima,Vice
Carlos Silva,3º Lugar
Juliana Costa,Quartas de Final`;

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
                  <h1 className="text-xl font-bold text-gray-900">Importar Dados</h1>
                  <p className="text-xs text-gray-500">Sistema Premium de Importação</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Tabs */}
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

            {/* Content Jogadores */}
            {activeTab === 'jogadores' && (
              <div className="p-6">
                {/* Tutorial */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <div className="flex gap-3">
                    <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-blue-900">
                      <h4 className="font-bold mb-2">📋 Como importar jogadores:</h4>
                      <ol className="list-decimal list-inside space-y-1 mb-3">
                        <li>Baixe o template CSV clicando no botão abaixo</li>
                        <li>Preencha com os dados dos jogadores</li>
                        <li>Faça upload do arquivo OU cole o conteúdo na caixa de texto</li>
                        <li>Confira o preview e clique em &quot;Importar&quot;</li>
                      </ol>
                      <div className="bg-white border border-blue-200 rounded p-3 font-mono text-xs mb-2">
                        <div className="font-bold text-blue-800 mb-1">Exemplo de formato correto:</div>
                        <div className="text-gray-700">
                          nome,email,telefone,cidade,categoria,genero<br/>
                          Daniel Simonian,daniel@email.com,(13)99743-4878,Santos,A,Masculino<br/>
                          Fernanda Lima,fernanda@email.com,(13)98765-4321,Guarujá,B,Feminino
                        </div>
                      </div>
                      <p className="font-semibold text-blue-800">
                        ⚠️ Ordem obrigatória: nome, email, telefone, cidade, categoria, genero
                      </p>
                      <p className="mt-2 font-semibold">
                        ✨ O sistema detecta automaticamente se o jogador já existe e atualiza os dados!
                      </p>
                    </div>
                  </div>
                </div>

                {/* Download Template */}
                <div className="flex gap-4 mb-6">
                  <button
                    onClick={downloadTemplateJogadores}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold"
                  >
                    <Download className="w-4 h-4" />
                    Baixar Template CSV
                  </button>
                </div>

                {/* Upload File */}
                <div className="mb-6">
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    📁 Opção 1: Upload de arquivo CSV
                  </label>
                  <input
                    type="file"
                    accept=".csv,.txt"
                    onChange={handleJogadoresFileUpload}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
                  />
                </div>

                {/* Texto */}
                <div className="mb-6">
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    📝 Opção 2: Colar dados (CSV)
                  </label>
                  <textarea
                    value={jogadoresTexto}
                    onChange={(e) => setJogadoresTexto(e.target.value)}
                    placeholder="Cole aqui os dados dos jogadores no formato CSV..."
                    className="w-full h-40 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent font-mono text-sm"
                  />
                  <button
                    onClick={processarJogadoresTexto}
                    disabled={!jogadoresTexto.trim() || loading}
                    className="mt-3 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-semibold disabled:opacity-50"
                  >
                    {loading ? 'Processando...' : 'Processar Dados'}
                  </button>
                </div>

                {/* Preview */}
                {jogadoresPreview.length > 0 && (
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      Preview: {jogadoresPreview.length} jogador(es) encontrado(s)
                    </h3>

                    <div className="space-y-2 max-h-80 overflow-y-auto mb-4">
                      {jogadoresPreview.map((jogador, index) => (
                        <div
                          key={index}
                          className={`p-3 rounded-lg ${
                            jogador.status === 'erro'
                              ? 'bg-red-50 border border-red-200'
                              : 'bg-white border border-gray-200'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="font-semibold text-gray-900">
                                {jogador.nome}
                              </div>
                              <div className="text-sm text-gray-600">
                                {jogador.email || 'Sem email'} • {jogador.cidade || 'Sem cidade'} • 
                                Cat. {jogador.categoria} • {jogador.genero}
                              </div>
                            </div>
                            <div>
                              {jogador.status === 'erro' ? (
                                <span className="text-red-600 text-sm font-semibold flex items-center gap-1">
                                  <AlertCircle className="w-4 h-4" />
                                  {jogador.erro}
                                </span>
                              ) : (
                                <span className="text-green-600 text-sm font-semibold flex items-center gap-1">
                                  <CheckCircle className="w-4 h-4" />
                                  OK
                                </span>
                              )}
                            </div>
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
                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
                      >
                        Cancelar
                      </button>
                      <button
                        onClick={importarJogadores}
                        disabled={importing || jogadoresPreview.every(j => j.status === 'erro')}
                        className="flex items-center gap-2 px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-semibold disabled:opacity-50"
                      >
                        {importing ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Importando...
                          </>
                        ) : (
                          <>
                            <Upload className="w-4 h-4" />
                            Importar {jogadoresPreview.filter(j => j.status !== 'erro').length} Jogador(es)
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Content Resultados */}
            {activeTab === 'resultados' && (
              <div className="p-6">
                {/* Tutorial */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <div className="flex gap-3">
                    <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-blue-900">
                      <h4 className="font-bold mb-2">🏆 Como importar resultados:</h4>
                      <ol className="list-decimal list-inside space-y-1 mb-3">
                        <li>Selecione o torneio abaixo</li>
                        <li>Baixe o template CSV ou cole os dados</li>
                        <li>Use o formato: nome_jogador,colocacao</li>
                        <li>Confira o preview e clique em &quot;Importar&quot;</li>
                      </ol>
                      <div className="bg-white border border-blue-200 rounded p-3 font-mono text-xs mb-2">
                        <div className="font-bold text-blue-800 mb-1">Exemplo de formato correto:</div>
                        <div className="text-gray-700">
                          nome_jogador,colocacao<br/>
                          Daniel Simonian,Campeão<br/>
                          Fernanda Lima,Vice<br/>
                          Carlos Silva,3º Lugar<br/>
                          Juliana Costa,Quartas de Final
                        </div>
                      </div>
                      <p className="font-semibold text-blue-800">
                        💡 Colocações válidas: Campeão, Vice, 3º Lugar, Quartas de Final, Oitavas de Final, Participação
                      </p>
                      <p className="mt-2 font-semibold text-red-700">
                        ⚠️ Os jogadores devem estar cadastrados no sistema antes de importar resultados!
                      </p>
                    </div>
                  </div>
                </div>

                {/* Selecionar Torneio */}
                <div className="mb-6">
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    🏆 Selecione o Torneio
                  </label>
                  <select
                    value={torneioSelecionado}
                    onChange={(e) => setTorneioSelecionado(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="">Escolha um torneio...</option>
                    {torneios.map((torneio) => (
                      <option key={torneio.id} value={torneio.id}>
                        {torneio.nome} - {new Date(torneio.data).toLocaleDateString('pt-BR')}
                      </option>
                    ))}
                  </select>
                </div>

                {torneioSelecionado && (
                  <>
                    {/* Download Template */}
                    <div className="flex gap-4 mb-6">
                      <button
                        onClick={downloadTemplateResultados}
                        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold"
                      >
                        <Download className="w-4 h-4" />
                        Baixar Template CSV
                      </button>
                    </div>

                    {/* Texto */}
                    <div className="mb-6">
                      <label className="block text-sm font-bold text-gray-700 mb-2">
                        📝 Cole os resultados (CSV)
                      </label>
                      <textarea
                        value={resultadosTexto}
                        onChange={(e) => setResultadosTexto(e.target.value)}
                        placeholder="Cole aqui os resultados no formato CSV..."
                        className="w-full h-40 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent font-mono text-sm"
                      />
                      <button
                        onClick={processarResultadosTexto}
                        disabled={!resultadosTexto.trim() || loading}
                        className="mt-3 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-semibold disabled:opacity-50"
                      >
                        {loading ? 'Processando...' : 'Processar Dados'}
                      </button>
                    </div>

                    {/* Preview */}
                    {resultadosPreview.length > 0 && (
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                        <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                          <CheckCircle className="w-5 h-5 text-green-600" />
                          Preview: {resultadosPreview.length} resultado(s) encontrado(s)
                        </h3>

                        <div className="space-y-2 max-h-80 overflow-y-auto mb-4">
                          {resultadosPreview.map((resultado, index) => (
                            <div
                              key={index}
                              className={`p-3 rounded-lg ${
                                resultado.status === 'erro'
                                  ? 'bg-red-50 border border-red-200'
                                  : 'bg-white border border-gray-200'
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex-1">
                                  <div className="font-semibold text-gray-900">
                                    {resultado.nome_jogador}
                                  </div>
                                  <div className="text-sm text-gray-600">
                                    {resultado.colocacao} • {resultado.pontos} pontos
                                  </div>
                                </div>
                                <div>
                                  {resultado.status === 'erro' ? (
                                    <span className="text-red-600 text-sm font-semibold flex items-center gap-1">
                                      <AlertCircle className="w-4 h-4" />
                                      {resultado.erro}
                                    </span>
                                  ) : (
                                    <span className="text-green-600 text-sm font-semibold flex items-center gap-1">
                                      <CheckCircle className="w-4 h-4" />
                                      OK
                                    </span>
                                  )}
                                </div>
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
                            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
                          >
                            Cancelar
                          </button>
                          <button
                            onClick={importarResultados}
                            disabled={importing || resultadosPreview.every(r => r.status === 'erro')}
                            className="flex items-center gap-2 px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-semibold disabled:opacity-50"
                          >
                            {importing ? (
                              <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Importando...
                              </>
                            ) : (
                              <>
                                <Upload className="w-4 h-4" />
                                Importar {resultadosPreview.filter(r => r.status === 'ok').length} Resultado(s)
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