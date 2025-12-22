export type Categoria = 'FUN' | 'D' | 'C' | 'B' | 'A';
export type Genero = 'Masculino' | 'Feminino';
export type StatusTorneio = 'confirmado' | 'realizado' | 'em_andamento';

export interface Jogador {
  id: string;
  nome: string;
  email?: string;
  telefone?: string;
  cidade?: string;
  categoria: Categoria;
  genero: Genero;
  pontos: number;
  torneios_disputados: number;
  created_at: string;
  updated_at: string;
  posicao?: number; // calculado no frontend
}

export interface Torneio {
  id: string;
  nome: string;
  data: string;
  local: string;
  cidade: string;
  status: StatusTorneio;
  created_at: string;
  updated_at: string;
}

export interface Resultado {
  id: string;
  jogador_id: string;
  torneio_id: string;
  colocacao: string;
  pontos_ganhos: number;
  created_at: string;
}