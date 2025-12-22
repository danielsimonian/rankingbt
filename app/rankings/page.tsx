import Link from 'next/link';
import { Trophy } from 'lucide-react';
import { Categoria } from '@/data/rankings';

const categorias: { nome: Categoria; descricao: string; pontosMin: number; pontosMax: number | null }[] = [
  { nome: 'A', descricao: 'Elite', pontosMin: 1000, pontosMax: null },
  { nome: 'B', descricao: 'Avançado', pontosMin: 601, pontosMax: 1000 },
  { nome: 'C', descricao: 'Intermediário', pontosMin: 301, pontosMax: 600 },
  { nome: 'D', descricao: 'Iniciante', pontosMin: 101, pontosMax: 300 },
  { nome: 'FUN', descricao: 'Recreativo', pontosMin: 0, pontosMax: 100 },
];

const getCategoriaColor = (cat: Categoria) => {
  const colors = {
    'A': 'from-red-500 to-red-600',
    'B': 'from-orange-500 to-orange-600',
    'C': 'from-yellow-500 to-yellow-600',
    'D': 'from-green-500 to-green-600',
    'FUN': 'from-blue-500 to-blue-600',
  };
  return colors[cat];
};

const getCategoriaTextColor = (cat: Categoria) => {
  const colors = {
    'A': 'text-red-600',
    'B': 'text-orange-600',
    'C': 'text-yellow-600',
    'D': 'text-green-600',
    'FUN': 'text-blue-600',
  };
  return colors[cat];
};

export default function RankingsPage() {
  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Rankings por Categoria
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Selecione uma categoria para visualizar o ranking completo. 
            Os jogadores são classificados de acordo com sua pontuação acumulada nos últimos 12 meses.
          </p>
        </div>

        {/* Categorias Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {categorias.map((categoria) => (
            <Link
              key={categoria.nome}
              href={`/ranking/${categoria.nome.toLowerCase()}`}
              className="group"
            >
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br ${getCategoriaColor(categoria.nome)} mb-4`}>
                  <Trophy className="w-8 h-8 text-white" />
                </div>
                <h2 className={`text-2xl font-bold mb-2 ${getCategoriaTextColor(categoria.nome)}`}>
                  Categoria {categoria.nome}
                </h2>
                <p className="text-gray-600 mb-4">{categoria.descricao}</p>
                <div className="text-sm text-gray-500">
                  {categoria.pontosMax 
                    ? `${categoria.pontosMin} - ${categoria.pontosMax} pontos`
                    : `${categoria.pontosMin}+ pontos`
                  }
                </div>
                <div className="mt-4 text-primary-600 font-medium group-hover:text-primary-700 inline-flex items-center gap-2">
                  Ver ranking completo
                  <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Info Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <h3 className="text-xl font-bold text-gray-900 mb-4">
            Como funciona a pontuação?
          </h3>
          <div className="space-y-3 text-gray-600">
            <p>
              • A pontuação é acumulada com base nos resultados nos torneios homologados
            </p>
            <p>
              • São considerados os últimos 12 meses de competições
            </p>
            <p>
              • É necessário disputar no mínimo 3 torneios para aparecer no ranking
            </p>
            <p>
              • A mudança de categoria é automática ao atingir a pontuação necessária
            </p>
          </div>
          <div className="mt-6">
            <Link 
              href="/como-funciona"
              className="text-primary-600 hover:text-primary-700 font-medium inline-flex items-center gap-2"
            >
              Saiba mais sobre o sistema de pontuação
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
