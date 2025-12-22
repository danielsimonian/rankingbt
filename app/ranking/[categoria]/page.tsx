import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Download } from 'lucide-react';
import { Categoria, getJogadoresPorCategoria } from '@/data/rankings';
import RankingTable from '@/components/RankingTable';

const categorias: Categoria[] = ['A', 'B', 'C', 'D', 'FUN'];

const categoriaNomes = {
  'a': 'A',
  'b': 'B',
  'c': 'C',
  'd': 'D',
  'fun': 'FUN',
};

const categoriaDescricoes = {
  'A': { nome: 'Elite', pontos: '1000+ pontos' },
  'B': { nome: 'Avançado', pontos: '601-1000 pontos' },
  'C': { nome: 'Intermediário', pontos: '301-600 pontos' },
  'D': { nome: 'Iniciante', pontos: '101-300 pontos' },
  'FUN': { nome: 'Recreativo', pontos: '0-100 pontos' },
};

export async function generateStaticParams() {
  return categorias.map((cat) => ({
    categoria: cat.toLowerCase(),
  }));
}

export default function CategoriaRankingPage({ 
  params 
}: { 
  params: { categoria: string } 
}) {
  const categoriaKey = params.categoria.toLowerCase() as keyof typeof categoriaNomes;
  const categoria = categoriaNomes[categoriaKey] as Categoria;

  if (!categoria || !categorias.includes(categoria)) {
    notFound();
  }

  const jogadores = getJogadoresPorCategoria(categoria);
  const info = categoriaDescricoes[categoria];

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Link 
          href="/rankings"
          className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 mb-6 font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar para categorias
        </Link>

        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                Categoria {categoria}
              </h1>
              <p className="text-lg text-gray-600 mb-1">{info.nome}</p>
              <p className="text-sm text-gray-500">{info.pontos}</p>
            </div>
            <div className="mt-6 md:mt-0">
              <button className="inline-flex items-center gap-2 bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors font-medium">
                <Download className="w-5 h-5" />
                Exportar PDF
              </button>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="text-sm text-gray-600 mb-1">Total de Jogadores</div>
            <div className="text-3xl font-bold text-gray-900">{jogadores.length}</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="text-sm text-gray-600 mb-1">Líder</div>
            <div className="text-xl font-bold text-gray-900">{jogadores[0]?.nome || '-'}</div>
            <div className="text-sm text-primary-600 font-medium">{jogadores[0]?.pontos || 0} pontos</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="text-sm text-gray-600 mb-1">Última Atualização</div>
            <div className="text-xl font-bold text-gray-900">
              {new Date().toLocaleDateString('pt-BR')}
            </div>
          </div>
        </div>

        {/* Ranking Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <h2 className="font-semibold text-gray-900">
              Ranking Completo - Categoria {categoria}
            </h2>
          </div>
          <RankingTable jogadores={jogadores} categoria={categoria} />
        </div>

        {/* Info */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="font-semibold text-blue-900 mb-2">
            ℹ️ Informação
          </h3>
          <p className="text-blue-800 text-sm">
            O ranking é atualizado após cada torneio homologado. Para mudar de categoria, 
            é necessário atingir a pontuação mínima e mantê-la por pelo menos 3 torneios consecutivos.
          </p>
        </div>
      </div>
    </div>
  );
}
