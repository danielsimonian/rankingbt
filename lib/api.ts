import { supabase } from './supabase';
import { Jogador, Torneio, Categoria, Genero } from '@/types/database';

// Buscar todos os jogadores
export async function getJogadores(): Promise<Jogador[]> {
  const { data, error } = await supabase
    .from('jogadores')
    .select('*')
    .order('pontos', { ascending: false });

  if (error) {
    console.error('Erro ao buscar jogadores:', error);
    return [];
  }

  return data || [];
}

// Buscar jogadores por categoria
export async function getJogadoresPorCategoria(categoria: Categoria): Promise<Jogador[]> {
  const { data, error } = await supabase
    .from('jogadores')
    .select('*')
    .eq('categoria', categoria)
    .order('pontos', { ascending: false });

  if (error) {
    console.error('Erro ao buscar jogadores:', error);
    return [];
  }

  return data || [];
}

// Buscar jogadores por categoria E gênero
export async function getJogadoresPorCategoriaEGenero(
  categoria: Categoria, 
  genero: Genero
): Promise<Jogador[]> {
  const { data, error } = await supabase
    .from('jogadores')
    .select('*')
    .eq('categoria', categoria)
    .eq('genero', genero)
    .order('pontos', { ascending: false });

  if (error) {
    console.error('Erro ao buscar jogadores:', error);
    return [];
  }

  return data || [];
}

// Buscar todos os torneios
export async function getTorneios(): Promise<Torneio[]> {
  const { data, error } = await supabase
    .from('torneios')
    .select('*')
    .order('data', { ascending: false });

  if (error) {
    console.error('Erro ao buscar torneios:', error);
    return [];
  }

  return data || [];
}

// Buscar jogador por nome
export async function buscarJogador(termo: string): Promise<Jogador[]> {
  const { data, error } = await supabase
    .from('jogadores')
    .select('*')
    .ilike('nome', `%${termo}%`)
    .order('pontos', { ascending: false });

  if (error) {
    console.error('Erro ao buscar jogadores:', error);
    return [];
  }

  return data || [];
}

// Buscar jogador por ID
export async function getJogadorPorId(id: string): Promise<Jogador | null> {
  const { data, error } = await supabase
    .from('jogadores')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Erro ao buscar jogador:', error);
    return null;
  }

  return data;
}

// Calcular posições no ranking (com critério de desempate)
export function calcularPosicoes(jogadores: Jogador[]): Jogador[] {
  // Primeiro, vamos buscar quantos títulos cada um tem (será implementado depois)
  // Por enquanto, só ordenamos por pontos
  
  const jogadoresOrdenados = [...jogadores].sort((a, b) => {
    // 1. Maior pontuação
    if (b.pontos !== a.pontos) {
      return b.pontos - a.pontos;
    }
    
    // 2. Desempate: mais torneios disputados (quem jogou mais tem prioridade)
    if (b.torneios_disputados !== a.torneios_disputados) {
      return b.torneios_disputados - a.torneios_disputados;
    }
    
    // 3. Desempate final: ordem alfabética
    return a.nome.localeCompare(b.nome);
  });

  return jogadoresOrdenados.map((jogador, index) => ({
    ...jogador,
    posicao: index + 1,
  }));
}

// Criar novo jogador
export async function criarJogador(jogador: {
  nome: string;
  email?: string;
  telefone?: string;
  cidade?: string;
  categoria: Categoria;
  genero: Genero;
}): Promise<{ success: boolean; error?: string; jogadorId?: string }> {
  try {
    // 1. Criar jogador
    const { data, error } = await supabase
      .from('jogadores')
      .insert({
        ...jogador,
        pontos: 0,
        torneios_disputados: 0,
      })
      .select()
      .single();

    if (error) {
      return { success: false, error: error.message };
    }

    // 2. Criar entrada no histórico
    await supabase
      .from('historico_categorias_jogador')
      .insert({
        jogador_id: data.id,
        categoria: jogador.categoria,
        pontos_na_categoria: 0,
        data_entrada: new Date().toISOString(),
        motivo_saida: 'ativo'
      });

    return { success: true, jogadorId: data.id };
  } catch (error) {
    console.error('Erro ao criar jogador:', error);
    return { success: false, error: 'Erro inesperado ao criar jogador' };
  }
}

// Atualizar jogador
export async function atualizarJogador(
  id: string,
  dados: Partial<Jogador>
): Promise<{ success: boolean; error?: string }> {
  const { error } = await supabase
    .from('jogadores')
    .update({
      ...dados,
      updated_at: new Date().toISOString()
    })
    .eq('id', id);

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true };
}

// Deletar jogador
export async function deletarJogador(id: string): Promise<{ success: boolean; error?: string }> {
  const { error } = await supabase
    .from('jogadores')
    .delete()
    .eq('id', id);

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true };
}