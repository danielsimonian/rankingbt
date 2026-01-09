// types/temporada.ts

export interface Temporada {
  id: string;
  ano: number;
  nome: string;
  data_inicio: string;
  data_fim: string | null;
  ativa: boolean;
  descricao: string | null;
  created_at: string;
  updated_at: string;
}

export interface RankingTemporada {
  id: string;
  temporada_id: string;
  jogador_id: string;
  categoria: string;
  genero: string;
  pontos: number;
  torneios_disputados: number;
  posicao: number;
  melhor_resultado: string | null;
  created_at: string;
  
  // Dados do jogador (quando fazer JOIN)
  jogador?: {
    nome: string;
    email: string | null;
    telefone: string | null;
    cidade: string | null;
  };
}

export interface TemporadaComEstatisticas extends Temporada {
  total_jogadores: number;
  total_torneios: number;
  total_resultados: number;
}

export interface TemporadaContextType {
  temporadaAtual: Temporada | null;
  temporadas: Temporada[];
  isLoading: boolean;
  selecionarTemporada: (id: string) => void;
  recarregar: () => Promise<void>;
}