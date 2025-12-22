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

// Calcular posições no ranking
export function calcularPosicoes(jogadores: Jogador[]): Jogador[] {
  return jogadores.map((jogador, index) => ({
    ...jogador,
    posicao: index + 1,
  }));
}