// lib/api/temporadas.ts

import { supabase } from '@/lib/supabase';
import { Temporada, RankingTemporada, TemporadaComEstatisticas } from '@/types/temporada';

/**
 * Buscar todas as temporadas
 */
export async function getTemporadas(): Promise<Temporada[]> {
  const { data, error } = await supabase
    .from('temporadas')
    .select('*')
    .order('ano', { ascending: false });

  if (error) {
    console.error('Erro ao buscar temporadas:', error);
    return [];
  }

  return data || [];
}

/**
 * Buscar temporada ativa
 */
export async function getTemporadaAtiva(): Promise<Temporada | null> {
  const { data, error } = await supabase
    .from('temporadas')
    .select('*')
    .eq('ativa', true)
    .single();

  if (error) {
    console.error('Erro ao buscar temporada ativa:', error);
    return null;
  }

  return data;
}

/**
 * Buscar temporada por ID
 */
export async function getTemporadaPorId(id: string): Promise<Temporada | null> {
  const { data, error } = await supabase
    .from('temporadas')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Erro ao buscar temporada:', error);
    return null;
  }

  return data;
}

/**
 * Buscar temporada por ano
 */
export async function getTemporadaPorAno(ano: number): Promise<Temporada | null> {
  const { data, error } = await supabase
    .from('temporadas')
    .select('*')
    .eq('ano', ano)
    .single();

  if (error) {
    console.error('Erro ao buscar temporada:', error);
    return null;
  }

  return data;
}

/**
 * Buscar temporadas com estatísticas
 */
export async function getTemporadasComEstatisticas(): Promise<TemporadaComEstatisticas[]> {
  const { data, error } = await supabase
    .rpc('get_temporadas_com_estatisticas');

  if (error) {
    console.error('Erro ao buscar temporadas com estatísticas:', error);
    
    // Fallback: buscar sem estatísticas
    const temporadas = await getTemporadas();
    return temporadas.map(t => ({
      ...t,
      total_jogadores: 0,
      total_torneios: 0,
      total_resultados: 0,
    }));
  }

  return data || [];
}

/**
 * Buscar ranking de uma temporada específica
 */
export async function getRankingTemporada(
  temporadaId: string,
  categoria?: string,
  genero?: string
): Promise<RankingTemporada[]> {
  let query = supabase
    .from('rankings_temporada')
    .select(`
      *,
      jogador:jogadores(nome, email, telefone, cidade)
    `)
    .eq('temporada_id', temporadaId);

  if (categoria) {
    query = query.eq('categoria', categoria);
  }

  if (genero) {
    query = query.eq('genero', genero);
  }

  const { data, error } = await query.order('posicao', { ascending: true });

  if (error) {
    console.error('Erro ao buscar ranking da temporada:', error);
    return [];
  }

  return data || [];
}

/**
 * Buscar histórico de um jogador em todas as temporadas
 */
export async function getHistoricoJogadorTemporadas(
  jogadorId: string
): Promise<RankingTemporada[]> {
  const { data, error } = await supabase
    .from('rankings_temporada')
    .select(`
      *,
      temporada:temporadas(ano, nome, ativa)
    `)
    .eq('jogador_id', jogadorId)
    .order('temporada_id', { ascending: false });

  if (error) {
    console.error('Erro ao buscar histórico do jogador:', error);
    return [];
  }

  return data || [];
}

/**
 * Criar nova temporada (ADMIN)
 */
export async function criarTemporada(dados: {
  ano: number;
  nome: string;
  data_inicio: string;
  descricao?: string;
  ativar?: boolean;
}): Promise<{ success: boolean; temporada?: Temporada; error?: string }> {
  try {
    const { data, error } = await supabase
      .from('temporadas')
      .insert({
        ano: dados.ano,
        nome: dados.nome,
        data_inicio: dados.data_inicio,
        descricao: dados.descricao,
        ativa: dados.ativar || false,
      })
      .select()
      .single();

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, temporada: data };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

/**
 * Ativar uma temporada e desativar as outras (ADMIN)
 */
export async function ativarTemporada(
  temporadaId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    // O trigger do banco já desativa as outras automaticamente
    const { error } = await supabase
      .from('temporadas')
      .update({ ativa: true })
      .eq('id', temporadaId);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

/**
 * Encerrar temporada e criar snapshot do ranking (ADMIN)
 */
export async function encerrarTemporada(
  temporadaId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    // 1. Criar snapshot do ranking
    const { error: snapshotError } = await supabase
      .rpc('criar_snapshot_ranking', { temporada_uuid: temporadaId });

    if (snapshotError) {
      return { success: false, error: snapshotError.message };
    }

    // 2. Desativar temporada
    const { error: updateError } = await supabase
      .from('temporadas')
      .update({ 
        ativa: false,
        data_fim: new Date().toISOString().split('T')[0]
      })
      .eq('id', temporadaId);

    if (updateError) {
      return { success: false, error: updateError.message };
    }

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

/**
 * Resetar pontos de todos os jogadores (ADMIN)
 * Use ao iniciar nova temporada
 */
export async function resetarPontosJogadores(): Promise<{ 
  success: boolean; 
  error?: string 
}> {
  try {
    const { error } = await supabase.rpc('resetar_pontos_jogadores');

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}