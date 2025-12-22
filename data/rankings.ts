export type Categoria = 'FUN' | 'D' | 'C' | 'B' | 'A';

export interface Jogador {
  id: string;
  nome: string;
  categoria: Categoria;
  pontos: number;
  torneiosDispputados: number;
  posicao?: number;
  ultimaAtualizacao?: string;
}

export interface Torneio {
  id: string;
  nome: string;
  data: string;
  local: string;
  status: 'confirmado' | 'realizado' | 'em_andamento';
  cidade: string;
}

// Dados de exemplo - você substituirá por dados reais
export const jogadores: Jogador[] = [
  // Categoria A
  { id: '1', nome: 'Carlos Silva', categoria: 'A', pontos: 1250, torneiosDispputados: 12 },
  { id: '2', nome: 'Roberto Santos', categoria: 'A', pontos: 1180, torneiosDispputados: 11 },
  { id: '3', nome: 'Fernando Costa', categoria: 'A', pontos: 1120, torneiosDispputados: 10 },
  
  // Categoria B
  { id: '4', nome: 'Lucas Oliveira', categoria: 'B', pontos: 920, torneiosDispputados: 9 },
  { id: '5', nome: 'Rafael Almeida', categoria: 'B', pontos: 880, torneiosDispputados: 10 },
  { id: '6', nome: 'Gustavo Pereira', categoria: 'B', pontos: 825, torneiosDispputados: 8 },
  { id: '7', nome: 'Thiago Rodrigues', categoria: 'B', pontos: 790, torneiosDispputados: 9 },
  { id: '8', nome: 'Bruno Martins', categoria: 'B', pontos: 750, torneiosDispputados: 7 },
  
  // Categoria C
  { id: '9', nome: 'André Fernandes', categoria: 'C', pontos: 580, torneiosDispputados: 8 },
  { id: '10', nome: 'Marcelo Lima', categoria: 'C', pontos: 545, torneiosDispputados: 7 },
  { id: '11', nome: 'Paulo Souza', categoria: 'C', pontos: 510, torneiosDispputados: 6 },
  { id: '12', nome: 'Diego Barbosa', categoria: 'C', pontos: 475, torneiosDispputados: 7 },
  { id: '13', nome: 'Rodrigo Gomes', categoria: 'C', pontos: 440, torneiosDispputados: 6 },
  { id: '14', nome: 'Vinicius Castro', categoria: 'C', pontos: 410, torneiosDispputados: 5 },
  
  // Categoria D
  { id: '15', nome: 'João Ribeiro', categoria: 'D', pontos: 285, torneiosDispputados: 6 },
  { id: '16', nome: 'Pedro Carvalho', categoria: 'D', pontos: 250, torneiosDispputados: 5 },
  { id: '17', nome: 'Mateus Araújo', categoria: 'D', pontos: 220, torneiosDispputados: 5 },
  { id: '18', nome: 'Gabriel Moreira', categoria: 'D', pontos: 195, torneiosDispputados: 4 },
  { id: '19', nome: 'Leonardo Dias', categoria: 'D', pontos: 170, torneiosDispputados: 4 },
  { id: '20', nome: 'Felipe Mendes', categoria: 'D', pontos: 145, torneiosDispputados: 3 },
  
  // Categoria FUN
  { id: '21', nome: 'Igor Batista', categoria: 'FUN', pontos: 85, torneiosDispputados: 3 },
  { id: '22', nome: 'Caio Freitas', categoria: 'FUN', pontos: 70, torneiosDispputados: 3 },
  { id: '23', nome: 'Eduardo Pinto', categoria: 'FUN', pontos: 55, torneiosDispputados: 2 },
  { id: '24', nome: 'Henrique Lopes', categoria: 'FUN', pontos: 40, torneiosDispputados: 2 },
  { id: '25', nome: 'Alexandre Rocha', categoria: 'FUN', pontos: 25, torneiosDispputados: 1 },
];

export const torneios: Torneio[] = [
  {
    id: '1',
    nome: 'Open Beach Tennis Santos',
    data: '2024-01-15',
    local: 'Arena Beach Santos',
    status: 'realizado',
    cidade: 'Santos'
  },
  {
    id: '2',
    nome: 'Circuito Guarujá BT',
    data: '2024-01-28',
    local: 'Beach Club Guarujá',
    status: 'realizado',
    cidade: 'Guarujá'
  },
  {
    id: '3',
    nome: 'Torneio Praia Grande Open',
    data: '2024-02-10',
    local: 'Complexo Esportivo PG',
    status: 'realizado',
    cidade: 'Praia Grande'
  },
  {
    id: '4',
    nome: 'Santos Beach Tennis Cup',
    data: '2024-12-28',
    local: 'Arena Beach Santos',
    status: 'confirmado',
    cidade: 'Santos'
  },
  {
    id: '5',
    nome: 'Verão Beach Tennis 2025',
    data: '2025-01-11',
    local: 'Beach Club Guarujá',
    status: 'confirmado',
    cidade: 'Guarujá'
  },
];

// Função auxiliar para calcular posições
export function calcularPosicoes(jogadores: Jogador[]): Jogador[] {
  const jogadoresOrdenados = [...jogadores].sort((a, b) => b.pontos - a.pontos);
  return jogadoresOrdenados.map((jogador, index) => ({
    ...jogador,
    posicao: index + 1,
  }));
}

// Função para obter jogadores por categoria
export function getJogadoresPorCategoria(categoria: Categoria): Jogador[] {
  const jogadoresDaCategoria = jogadores.filter(j => j.categoria === categoria);
  return calcularPosicoes(jogadoresDaCategoria);
}

// Função para buscar jogador por nome
export function buscarJogador(termo: string): Jogador[] {
  const termoLower = termo.toLowerCase();
  return calcularPosicoes(
    jogadores.filter(j => j.nome.toLowerCase().includes(termoLower))
  );
}
