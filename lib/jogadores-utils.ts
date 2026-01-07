import { supabase } from './supabase';

/**
 * Normaliza um nome para comparação
 * Remove acentos, espaços extras, converte para minúsculo
 */
export function normalizarNome(nome: string): string {
  return nome
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove acentos
    .replace(/\s+/g, ' '); // Múltiplos espaços → um espaço
}

/**
 * Verifica se já existe um jogador com o mesmo nome (case-insensitive, sem acentos)
 * @param nome Nome do jogador a verificar
 * @param idExcluir ID para excluir da busca (usado ao editar)
 * @returns Jogador existente ou null
 */
export async function verificarJogadorDuplicado(
  nome: string,
  idExcluir?: string
): Promise<{ id: string; nome: string } | null> {
  // Buscar todos os jogadores
  const { data: jogadores } = await supabase
    .from('jogadores')
    .select('id, nome');

  if (!jogadores || jogadores.length === 0) {
    return null;
  }

  const nomeNormalizado = normalizarNome(nome);

  // Buscar manualmente
  const duplicado = jogadores.find(j => {
    // Se é o mesmo ID, ignora (usado ao editar)
    if (idExcluir && j.id === idExcluir) {
      return false;
    }

    const nomeDBNormalizado = normalizarNome(j.nome);
    return nomeDBNormalizado === nomeNormalizado;
  });

  return duplicado || null;
}

/**
 * Cria ou atualiza um jogador, verificando duplicatas antes
 * @returns { success: boolean, jogadorId?: string, error?: string }
 */
export async function criarOuAtualizarJogador(dados: {
  nome: string;
  email?: string;
  telefone?: string;
  cidade?: string;
  categoria: string;
  genero: string;
  idExistente?: string; // Se for edição
}) {
  try {
    // Verificar duplicata
    const duplicado = await verificarJogadorDuplicado(
      dados.nome,
      dados.idExistente
    );

    if (duplicado && !dados.idExistente) {
      // É um novo jogador mas já existe
      return {
        success: false,
        error: `Jogador "${duplicado.nome}" já existe no sistema!`,
        jogadorExistenteId: duplicado.id,
      };
    }

    if (dados.idExistente) {
      // EDITAR jogador existente
      const { error } = await supabase
        .from('jogadores')
        .update({
          nome: dados.nome.trim(),
          email: dados.email || null,
          telefone: dados.telefone || null,
          cidade: dados.cidade || null,
          categoria: dados.categoria,
          genero: dados.genero,
        })
        .eq('id', dados.idExistente);

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, jogadorId: dados.idExistente };
    } else {
      // CRIAR novo jogador
      const { data, error } = await supabase
        .from('jogadores')
        .insert({
          nome: dados.nome.trim(),
          email: dados.email,
          telefone: dados.telefone,
          cidade: dados.cidade,
          categoria: dados.categoria,
          genero: dados.genero,
          pontos: 0,
          torneios_disputados: 0,
        })
        .select('id')
        .single();

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, jogadorId: data.id };
    }
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}