import { supabase } from './supabase';
import { Categoria, Genero } from '@/types/database';

/**
 * Subir de categoria (automático - sem aprovação)
 */
export async function subirCategoria(
  jogadorId: string,
  categoriaAtual: Categoria,
  novaCategoria: Categoria
): Promise<{ success: boolean; error?: string }> {
  try {
    // 1. Buscar dados atuais do jogador
    const { data: jogador, error: erroJogador } = await supabase
      .from('jogadores')
      .select('*')
      .eq('id', jogadorId)
      .single();

    if (erroJogador || !jogador) {
      return { success: false, error: 'Jogador não encontrado' };
    }

    // 2. Validar que é uma subida válida
    const hierarquia: Categoria[] = ['FUN', 'D', 'C', 'B', 'A'];
    const indexAtual = hierarquia.indexOf(categoriaAtual);
    const indexNova = hierarquia.indexOf(novaCategoria);

    if (indexNova <= indexAtual) {
      return { success: false, error: 'Só é permitido subir de categoria' };
    }

    // 3. Salvar histórico da categoria atual
    const { error: erroHistorico } = await supabase
      .from('historico_categorias_jogador')
      .update({
        data_saida: new Date().toISOString(),
        motivo_saida: 'subiu'
      })
      .eq('jogador_id', jogadorId)
      .eq('categoria', categoriaAtual)
      .is('data_saida', null);

    if (erroHistorico) {
      return { success: false, error: 'Erro ao salvar histórico' };
    }

    // 4. Criar nova entrada no histórico (categoria nova, pontos zerados)
    const { error: erroNovoHistorico } = await supabase
      .from('historico_categorias_jogador')
      .insert({
        jogador_id: jogadorId,
        categoria: novaCategoria,
        pontos_na_categoria: 0,
        data_entrada: new Date().toISOString(),
        motivo_saida: 'ativo'
      });

    if (erroNovoHistorico) {
      return { success: false, error: 'Erro ao criar novo histórico' };
    }

    // 5. Atualizar categoria e zerar pontos do jogador
    const { error: erroUpdate } = await supabase
      .from('jogadores')
      .update({
        categoria: novaCategoria,
        pontos: 0,
        updated_at: new Date().toISOString()
      })
      .eq('id', jogadorId);

    if (erroUpdate) {
      return { success: false, error: 'Erro ao atualizar jogador' };
    }

    return { success: true };
  } catch (error) {
    console.error('Erro ao subir categoria:', error);
    return { success: false, error: 'Erro inesperado' };
  }
}

/**
 * Solicitar descida de categoria (precisa aprovação do admin)
 */
export async function solicitarDescidaCategoria(
  jogadorId: string,
  categoriaAtual: Categoria,
  categoriaDesejada: Categoria,
  motivo: string
): Promise<{ success: boolean; error?: string }> {
  try {
    // 1. Validar que é uma descida válida
    const hierarquia: Categoria[] = ['FUN', 'D', 'C', 'B', 'A'];
    const indexAtual = hierarquia.indexOf(categoriaAtual);
    const indexDesejada = hierarquia.indexOf(categoriaDesejada);

    if (indexDesejada >= indexAtual) {
      return { success: false, error: 'Só é permitido solicitar descida de categoria' };
    }

    // 2. Verificar se já existe solicitação pendente
    const { data: solicitacaoExistente } = await supabase
      .from('solicitacoes_mudanca_categoria')
      .select('*')
      .eq('jogador_id', jogadorId)
      .eq('status', 'pendente')
      .single();

    if (solicitacaoExistente) {
      return { success: false, error: 'Você já tem uma solicitação pendente' };
    }

    // 3. Criar solicitação
    const { error } = await supabase
      .from('solicitacoes_mudanca_categoria')
      .insert({
        jogador_id: jogadorId,
        categoria_atual: categoriaAtual,
        categoria_solicitada: categoriaDesejada,
        tipo_mudanca: 'descida',
        motivo: motivo,
        status: 'pendente',
        data_solicitacao: new Date().toISOString()
      });

    if (error) {
      return { success: false, error: 'Erro ao criar solicitação' };
    }

    return { success: true };
  } catch (error) {
    console.error('Erro ao solicitar descida:', error);
    return { success: false, error: 'Erro inesperado' };
  }
}

/**
 * Aprovar solicitação de descida (ADMIN)
 */
export async function aprovarDescidaCategoria(
  solicitacaoId: string,
  adminId: string,
  respostaAdmin?: string
): Promise<{ success: boolean; error?: string }> {
  try {
    // 1. Buscar solicitação
    const { data: solicitacao, error: erroSolicitacao } = await supabase
      .from('solicitacoes_mudanca_categoria')
      .select('*')
      .eq('id', solicitacaoId)
      .single();

    if (erroSolicitacao || !solicitacao) {
      return { success: false, error: 'Solicitação não encontrada' };
    }

    if (solicitacao.status !== 'pendente') {
      return { success: false, error: 'Solicitação já foi processada' };
    }

    // 2. Buscar histórico da categoria solicitada (para recuperar pontos)
    const { data: historicoAntigo } = await supabase
      .from('historico_categorias_jogador')
      .select('*')
      .eq('jogador_id', solicitacao.jogador_id)
      .eq('categoria', solicitacao.categoria_solicitada)
      .order('data_saida', { ascending: false })
      .limit(1)
      .single();

    const pontosRecuperados = historicoAntigo?.pontos_na_categoria || 0;

    // 3. Salvar histórico da categoria atual
    const { error: erroHistorico } = await supabase
      .from('historico_categorias_jogador')
      .update({
        data_saida: new Date().toISOString(),
        motivo_saida: 'desceu'
      })
      .eq('jogador_id', solicitacao.jogador_id)
      .eq('categoria', solicitacao.categoria_atual)
      .is('data_saida', null);

    if (erroHistorico) {
      return { success: false, error: 'Erro ao salvar histórico' };
    }

    // 4. Criar nova entrada no histórico (com pontos recuperados)
    const { error: erroNovoHistorico } = await supabase
      .from('historico_categorias_jogador')
      .insert({
        jogador_id: solicitacao.jogador_id,
        categoria: solicitacao.categoria_solicitada,
        pontos_na_categoria: pontosRecuperados,
        data_entrada: new Date().toISOString(),
        motivo_saida: 'ativo'
      });

    if (erroNovoHistorico) {
      return { success: false, error: 'Erro ao criar novo histórico' };
    }

    // 5. Atualizar categoria e pontos do jogador
    const { error: erroUpdate } = await supabase
      .from('jogadores')
      .update({
        categoria: solicitacao.categoria_solicitada,
        pontos: pontosRecuperados,
        updated_at: new Date().toISOString()
      })
      .eq('id', solicitacao.jogador_id);

    if (erroUpdate) {
      return { success: false, error: 'Erro ao atualizar jogador' };
    }

    // 6. Atualizar status da solicitação
    const { error: erroSolicitacaoUpdate } = await supabase
      .from('solicitacoes_mudanca_categoria')
      .update({
        status: 'aprovada',
        data_resposta: new Date().toISOString(),
        resposta_admin: respostaAdmin,
        admin_id: adminId
      })
      .eq('id', solicitacaoId);

    if (erroSolicitacaoUpdate) {
      return { success: false, error: 'Erro ao atualizar solicitação' };
    }

    return { success: true };
  } catch (error) {
    console.error('Erro ao aprovar descida:', error);
    return { success: false, error: 'Erro inesperado' };
  }
}

/**
 * Rejeitar solicitação de descida (ADMIN)
 */
export async function rejeitarDescidaCategoria(
  solicitacaoId: string,
  adminId: string,
  respostaAdmin: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase
      .from('solicitacoes_mudanca_categoria')
      .update({
        status: 'rejeitada',
        data_resposta: new Date().toISOString(),
        resposta_admin: respostaAdmin,
        admin_id: adminId
      })
      .eq('id', solicitacaoId);

    if (error) {
      return { success: false, error: 'Erro ao rejeitar solicitação' };
    }

    return { success: true };
  } catch (error) {
    console.error('Erro ao rejeitar descida:', error);
    return { success: false, error: 'Erro inesperado' };
  }
}

/**
 * Buscar solicitações pendentes (ADMIN)
 */
export async function getSolicitacoesPendentes() {
  const { data, error } = await supabase
    .from('solicitacoes_mudanca_categoria')
    .select(`
      *,
      jogadores(nome, email, genero)
    `)
    .eq('status', 'pendente')
    .order('data_solicitacao', { ascending: false });

  if (error) {
    console.error('Erro ao buscar solicitações:', error);
    return [];
  }

  return data || [];
}

/**
 * Buscar histórico de categorias de um jogador
 */
export async function getHistoricoCategorias(jogadorId: string) {
  const { data, error } = await supabase
    .from('historico_categorias_jogador')
    .select('*')
    .eq('jogador_id', jogadorId)
    .order('data_entrada', { ascending: false });

  if (error) {
    console.error('Erro ao buscar histórico:', error);
    return [];
  }

  return data || [];
}