export type Categoria = 'FUN' | 'D' | 'C' | 'B' | 'A';
export type Genero = 'Masculino' | 'Feminino';
export type StatusTorneio = 'confirmado' | 'realizado' | 'em_andamento';
export type StatusSolicitacao = 'pendente' | 'aprovada' | 'rejeitada';
export type TipoMudanca = 'subida' | 'descida';
export type MotivoSaida = 'subiu' | 'desceu' | 'admin' | 'ativo';

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
  pontuacao_custom?: PontuacaoCustom;
  created_at: string;
  updated_at: string;
}

export interface Resultado {
  id: string;
  jogador_id: string;
  torneio_id: string;
  colocacao: string;
  pontos_ganhos: number;
  categoria_jogada?: Categoria;
  created_at: string;
}

export interface ConfigPontuacao {
  id: string;
  ano: number;
  campeao: number;
  vice: number;
  terceiro: number;
  quartas: number;
  oitavas: number;
  participacao: number;
  ativo: boolean;
  created_at: string;
  updated_at: string;
}

export interface PontuacaoCustom {
  campeao?: number;
  vice?: number;
  terceiro?: number;
  quartas?: number;
  oitavas?: number;
  participacao?: number;
}

export interface HistoricoCategoriaJogador {
  id: string;
  jogador_id: string;
  categoria: Categoria;
  pontos_na_categoria: number;
  data_entrada: string;
  data_saida?: string;
  motivo_saida: MotivoSaida;
  created_at: string;
}

export interface SolicitacaoMudancaCategoria {
  id: string;
  jogador_id: string;
  categoria_atual: Categoria;
  categoria_solicitada: Categoria;
  tipo_mudanca: TipoMudanca;
  motivo?: string;
  status: StatusSolicitacao;
  data_solicitacao: string;
  data_resposta?: string;
  resposta_admin?: string;
  admin_id?: string;
  created_at: string;
}

// Helper types
export interface JogadorComHistorico extends Jogador {
  historico?: HistoricoCategoriaJogador[];
  solicitacoes?: SolicitacaoMudancaCategoria[];
}

export interface ResultadoComDetalhes extends Resultado {
  jogador?: Jogador;
  torneio?: Torneio;
}