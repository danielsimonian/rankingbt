import { supabase } from './supabase';

/**
 * Calcula a categoria principal do jogador
 * (categoria onde ele mais jogou torneios)
 */
export async function calcularCategoriaPrincipal(
  jogadorId: string
): Promise<string> {
  // Buscar todos os resultados do jogador com categoria do torneio
  const { data: resultados, error } = await supabase
    .from('resultados')
    .select(`
      id,
      torneios (
        categoria
      )
    `)
    .eq('jogador_id', jogadorId);

  if (error || !resultados || resultados.length === 0) {
    return 'FUN'; // Categoria padrão se não tiver resultados
  }

  // Contar quantos torneios jogou em cada categoria
  const contagem: Record<string, number> = {};

  resultados.forEach((resultado: any) => {
    const categoria = resultado.torneios?.categoria || 'FUN';
    contagem[categoria] = (contagem[categoria] || 0) + 1;
  });

  // Encontrar a categoria com mais torneios
  let categoriaMaisJogada = 'FUN';
  let maxTorneios = 0;

  Object.entries(contagem).forEach(([categoria, quantidade]) => {
    if (quantidade > maxTorneios) {
      maxTorneios = quantidade;
      categoriaMaisJogada = categoria;
    }
  });

  return categoriaMaisJogada;
}

/**
 * Atualizar a categoria do jogador baseado em onde ele mais jogou
 */
export async function atualizarCategoriaPorResultados(
  jogadorId: string
): Promise<void> {
  const categoriaPrincipal = await calcularCategoriaPrincipal(jogadorId);

  await supabase
    .from('jogadores')
    .update({ categoria: categoriaPrincipal })
    .eq('id', jogadorId);
}

/**
 * Recalcular categorias de todos os jogadores
 */
export async function recalcularTodasCategorias(): Promise<void> {
  const { data: jogadores } = await supabase
    .from('jogadores')
    .select('id');

  if (!jogadores) return;

  for (const jogador of jogadores) {
    await atualizarCategoriaPorResultados(jogador.id);
  }

  console.log(`✅ ${jogadores.length} categorias recalculadas!`);
}

/**
 * Recalcular categoria de múltiplos jogadores
 */
export async function recalcularCategoriasEmLote(
  jogadoresIds: Set<string>
): Promise<void> {
  console.log(`Recalculando categorias de ${jogadoresIds.size} jogadores...`);
  
  for (const jogadorId of Array.from(jogadoresIds)) {
    await atualizarCategoriaPorResultados(jogadorId);
  }
  
  console.log(`✅ ${jogadoresIds.size} categorias recalculadas!`);
}