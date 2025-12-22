import Link from 'next/link';
import { Trophy } from 'lucide-react';

type Categoria = 'A' | 'B' | 'C' | 'D' | 'FUN';

const categorias: { 
  nome: Categoria; 
  descricao: string; 
}[] = [
  { nome: 'A', descricao: 'Elite - Nível Avançado' },
  { nome: 'B', descricao: 'Avançado - Alto Nível Técnico' },
  { nome: 'C', descricao: 'Intermediário - Em Desenvolvimento' },
  { nome: 'D', descricao: 'Iniciante - Aprendizado' },
  { nome: 'FUN', descricao: 'Recreativo - Diversão' },
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
            Selecione uma categoria e gênero para visualizar o ranking completo. 
            A pontuação é calculada com base nos <strong>10 melhores resultados</strong> dos últimos 12 meses.
          </p>
        </div>

        {/* Categorias Grid */}
        {categorias.map((categoria) => (
          <div key={categoria.nome} className="mb-12">
            <div className="flex items-center gap-4 mb-6">
              <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${getCategoriaColor(categoria.nome)} shadow-lg`}>
                <Trophy className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className={`text-3xl font-bold ${getCategoriaTextColor(categoria.nome)}`}>
                  Categoria {categoria.nome}
                </h2>
                <p className="text-gray-600">{categoria.descricao}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Masculino */}
              <Link
                href={`/ranking/${categoria.nome.toLowerCase()}/masculino`}
                className="group"
              >
                <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-8 hover:shadow-2xl hover:border-primary-200 transition-all duration-300 hover:-translate-y-1">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-1">
                        Masculino
                      </h3>
                      <p className="text-gray-600">Ranking masculino</p>
                    </div>
                    <div className="text-4xl">👨</div>
                  </div>
                  <div className="text-primary-600 font-bold group-hover:text-primary-700 inline-flex items-center gap-2 mt-4">
                    Ver ranking completo
                    <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </Link>

              {/* Feminino */}
              <Link
                href={`/ranking/${categoria.nome.toLowerCase()}/feminino`}
                className="group"
              >
                <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-8 hover:shadow-2xl hover:border-primary-200 transition-all duration-300 hover:-translate-y-1">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-1">
                        Feminino
                      </h3>
                      <p className="text-gray-600">Ranking feminino</p>
                    </div>
                    <div className="text-4xl">👩</div>
                  </div>
                  <div className="text-primary-600 font-bold group-hover:text-primary-700 inline-flex items-center gap-2 mt-4">
                    Ver ranking completo
                    <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        ))}

        {/* Info Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mt-12">
          <h3 className="text-xl font-bold text-gray-900 mb-4">
            Como funciona a pontuação?
          </h3>
          <div className="space-y-3 text-gray-600">
            <p>
              • <strong>Sistema Top 10 (Padrão ITF):</strong> São computados os 10 melhores resultados do atleta no período de 12 meses
            </p>
            <p>
              • <strong>Pontuação por colocação:</strong> Campeão (100pts), Vice (75pts), 3º lugar (50pts), Quartas (25pts), Oitavas (10pts), Participação (5pts)
            </p>
            <p>
              • <strong>Escolha da categoria:</strong> O jogador escolhe em qual categoria deseja competir
            </p>
            <p>
              • <strong>Mudança de categoria:</strong> Pode subir quando quiser (pontuação zera). Para descer, precisa solicitar aprovação do admin
            </p>
            <p>
              • <strong>Rankings separados:</strong> Por categoria e gênero (Masculino e Feminino)
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