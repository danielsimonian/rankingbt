import { supabase } from './supabase';
import { aprovarDescidaCategoria, rejeitarDescidaCategoria } from './categorias';

/**
 * Buscar todas as solicitações (com dados do jogador)
 */
export async function getSolicitacoes(status?: string) {
  let query = supabase
    .from('solicitacoes_mudanca_categoria')
    .select(`
      *,
      jogadores:jogador_id (
        nome,
        email,
        genero,
        pontos,
        categoria
      )
    `)
    .order('data_solicitacao', { ascending: false });

  if (status) {
    query = query.eq('status', status);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Erro ao buscar solicitações:', error);
    return [];
  }

  return data || [];
}

/**
 * Aprovar solicitação
 */
export async function aprovarSolicitacao(
  solicitacaoId: string,
  adminId: string,
  resposta?: string
) {
  return await aprovarDescidaCategoria(solicitacaoId, adminId, resposta);
}

/**
 * Rejeitar solicitação
 */
export async function rejeitarSolicitacao(
  solicitacaoId: string,
  adminId: string,
  resposta: string
) {
  return await rejeitarDescidaCategoria(solicitacaoId, adminId, resposta);
}

/**
 * Estatísticas do admin
 */
export async function getAdminStats() {
  const [jogadores, torneios, solicitacoes] = await Promise.all([
    supabase.from('jogadores').select('categoria', { count: 'exact' }),
    supabase.from('torneios').select('*', { count: 'exact' }),
    supabase.from('solicitacoes_mudanca_categoria').select('*', { count: 'exact' }).eq('status', 'pendente'),
  ]);

  // Contar por categoria
  const porCategoria = { A: 0, B: 0, C: 0, D: 0, FUN: 0 };
  jogadores.data?.forEach((j: any) => {
    if (j.categoria in porCategoria) {
      porCategoria[j.categoria as keyof typeof porCategoria]++;
    }
  });

  return {
    totalJogadores: jogadores.count || 0,
    totalTorneios: torneios.count || 0,
    solicitacoesPendentes: solicitacoes.count || 0,
    jogadoresPorCategoria: porCategoria,
  };
}