import { supabase } from './supabase';
import { ConfiguracaoPontuacao, PontuacaoCustom, Resultado } from '@/types/database';

/**
 * Buscar uma configuração de pontuação qualquer (fallback)
 * Usado apenas se o torneio não tiver pontuacao_custom
 */
export async function getConfigPontuacaoAtiva(): Promise<ConfiguracaoPontuacao | null> {
  // Busca qualquer configuração (pega a primeira)
  const { data, error } = await supabase
    .from('config_pontuacao')
    .select('*')
    .limit(1)
    .single();

  if (error) {
    console.error('Erro ao buscar configuração de pontuação:', error);
    return null;
  }

  return data;
}

/**
 * Calcular pontos com base na colocação
 * SEMPRE usa pontuacao_custom se disponível
 */
export function calcularPontosPorColocacao(
  colocacao: string,
  configPadrao: ConfiguracaoPontuacao | null,
  pontuacaoCustom?: PontuacaoCustom
): number {
  const colocacaoLower = colocacao.toLowerCase();

  // Se tem pontuacao_custom, usa ela (prioritário!)
  if (pontuacaoCustom) {
    const mapa: Record<string, keyof PontuacaoCustom> = {
      'campeao': 'campeao',
      'campeão': 'campeao',
      '1': 'campeao',
      '1º': 'campeao',
      'primeiro': 'campeao',
      
      'vice': 'vice',
      '2': 'vice',
      '2º': 'vice',
      'segundo': 'vice',
      
      'terceiro': 'terceiro',
      '3': 'terceiro',
      '3º': 'terceiro',
      '3º lugar': 'terceiro',
      
      'quartas': 'quartas',
      'quarta': 'quartas',
      'quartasfinal': 'quartas',
      'quartas de final': 'quartas',
      
      'oitavas': 'oitavas',
      'oitava': 'oitavas',
      'oitavasfinal': 'oitavas',
      'oitavas de final': 'oitavas',
      
      'participacao': 'participacao',
      'participação': 'participacao',
      'participou': 'participacao',
    };

    const chave = mapa[colocacaoLower];
    if (chave && pontuacaoCustom[chave] !== undefined) {
      return pontuacaoCustom[chave] as number;
    }
    
    // Fallback para participação se não encontrar
    return pontuacaoCustom.participacao || 0;
  }

  // Se não tem custom e não tem config padrão, retorna 0
  if (!configPadrao) {
    return 0;
  }

  // Usa config padrão como último recurso
  const mapa: Record<string, number> = {
    'campeao': configPadrao.campeao,
    'campeão': configPadrao.campeao,
    '1': configPadrao.campeao,
    '1º': configPadrao.campeao,
    'primeiro': configPadrao.campeao,
    
    'vice': configPadrao.vice,
    '2': configPadrao.vice,
    '2º': configPadrao.vice,
    'segundo': configPadrao.vice,
    
    'terceiro': configPadrao.terceiro,
    '3': configPadrao.terceiro,
    '3º': configPadrao.terceiro,
    '3º lugar': configPadrao.terceiro,
    
    'quartas': configPadrao.quartas,
    'quarta': configPadrao.quartas,
    'quartasfinal': configPadrao.quartas,
    'quartas de final': configPadrao.quartas,
    
    'oitavas': configPadrao.oitavas,
    'oitava': configPadrao.oitavas,
    'oitavasfinal': configPadrao.oitavas,
    'oitavas de final': configPadrao.oitavas,
    
    'participacao': configPadrao.participacao,
    'participação': configPadrao.participacao,
    'participou': configPadrao.participacao,
  };

  return mapa[colocacaoLower] || configPadrao.participacao;
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