import { supabase } from './supabase';
import { ConfiguracaoPontuacao, PontuacaoCustom, Resultado } from '@/types/database';
/**
 * Buscar configuração de pontuação ativa do ano
 */
export async function getConfigPontuacaoAtiva(): Promise<ConfiguracaoPontuacao | null> {
  const anoAtual = new Date().getFullYear();
  
  const { data, error } = await supabase
    .from('config_pontuacao')
    .select('*')
    .eq('ano', anoAtual)
    .eq('ativo', true)
    .single();

  if (error) {
    console.error('Erro ao buscar configuração de pontuação:', error);
    return null;
  }

  return data;
}

/**
 * Calcular pontos com base na colocação
 */
export function calcularPontosPorColocacao(
  colocacao: string,
  configPadrao: ConfiguracaoPontuacao,
  pontuacaoCustom?: PontuacaoCustom
): number {
  const colocacaoLower = colocacao.toLowerCase();

  // Determinar valores a usar (custom tem prioridade)
  const campeao = pontuacaoCustom?.campeao ?? configPadrao.campeao;
  const vice = pontuacaoCustom?.vice ?? configPadrao.vice;
  const terceiro = pontuacaoCustom?.terceiro ?? configPadrao.terceiro;
  const quartas = pontuacaoCustom?.quartas ?? configPadrao.quartas;
  const oitavas = pontuacaoCustom?.oitavas ?? configPadrao.oitavas;
  const participacao = pontuacaoCustom?.participacao ?? configPadrao.participacao;

  // Mapeamento de colocações
  const mapa: Record<string, number> = {
    'campeao': campeao,
    'campeão': campeao,
    '1': campeao,
    '1º': campeao,
    'primeiro': campeao,
    
    'vice': vice,
    '2': vice,
    '2º': vice,
    'segundo': vice,
    
    'terceiro': terceiro,
    '3': terceiro,
    '3º': terceiro,
    
    'quartas': quartas,
    'quarta': quartas,
    'quartasfinal': quartas,
    'quartas de final': quartas,
    
    'oitavas': oitavas,
    'oitava': oitavas,
    'oitavasfinal': oitavas,
    'oitavas de final': oitavas,
    
    'participacao': participacao,
    'participação': participacao,
    'participou': participacao,
  };

  return mapa[colocacaoLower] || participacao;
}

/**
 * Calcular pontuação total do jogador (Top 10 resultados)
 */
export async function calcularPontuacaoJogador(
  jogadorId: string,
  categoria: string,
  genero: string
): Promise<{ pontos: number; resultados: Resultado[] }> {
  // Buscar resultados dos últimos 12 meses na categoria atual
  const dataLimite = new Date();
  dataLimite.setMonth(dataLimite.getMonth() - 12);

  const { data: resultados, error } = await supabase
    .from('resultados')
    .select(`
      *,
      torneios(data, pontuacao_custom)
    `)
    .eq('jogador_id', jogadorId)
    .eq('categoria_jogada', categoria)
    .gte('torneios.data', dataLimite.toISOString().split('T')[0])
    .order('pontos_ganhos', { ascending: false });

  if (error) {
    console.error('Erro ao calcular pontuação:', error);
    return { pontos: 0, resultados: [] };
  }

  if (!resultados || resultados.length === 0) {
    return { pontos: 0, resultados: [] };
  }

  // Pegar os TOP 10 melhores resultados
  const top10 = resultados.slice(0, 10);
  const pontos = top10.reduce((sum, r) => sum + r.pontos_ganhos, 0);

  return { pontos, resultados: top10 };
}

/**
 * Recalcular pontuação de todos os jogadores de uma categoria
 */
export async function recalcularPontuacaoCategoria(
  categoria: string,
  genero: string
): Promise<void> {
  // Buscar todos jogadores da categoria/gênero
  const { data: jogadores, error } = await supabase
    .from('jogadores')
    .select('id')
    .eq('categoria', categoria)
    .eq('genero', genero);

  if (error || !jogadores) {
    console.error('Erro ao buscar jogadores:', error);
    return;
  }

  // Recalcular pontuação de cada jogador
  for (const jogador of jogadores) {
    const { pontos } = await calcularPontuacaoJogador(jogador.id, categoria, genero);
    
    // Atualizar pontos no banco
    await supabase
      .from('jogadores')
      .update({ pontos })
      .eq('id', jogador.id);
  }
}