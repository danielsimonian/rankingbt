import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Download } from 'lucide-react';
import { getJogadoresPorCategoriaEGenero, calcularPosicoes } from '@/lib/api';
import { Categoria, Genero } from '@/types/database';
import RankingTable from '@/components/RankingTable';

export const revalidate = 60;

const categorias: Categoria[] = ['A', 'B', 'C', 'D', 'FUN'];
const generos: Genero[] = ['Masculino', 'Feminino'];

const categoriaNomes: Record<string, Categoria> = {
  'a': 'A',
  'b': 'B',
  'c': 'C',
  'd': 'D',
  'fun': 'FUN',
};

const generoNomes: Record<string, Genero> = {
  'masculino': 'Masculino',
  'feminino': 'Feminino',
};

const categoriaDescricoes: Record<Categoria, { nome: string; pontos: string }> = {
  'A': { nome: 'Elite', pontos: '1000+ pontos' },
  'B': { nome: 'Avançado', pontos: '601-1000 pontos' },
  'C': { nome: 'Intermediário', pontos: '301-600 pontos' },
  'D': { nome: 'Iniciante', pontos: '101-300 pontos' },
  'FUN': { nome: 'Recreativo', pontos: '0-100 pontos' },
};

export async function generateStaticParams() {
  const params = [];
  for (const cat of categorias) {
    for (const gen of generos) {
      params.push({
        categoria: cat.toLowerCase(),
        genero: gen.toLowerCase(),
      });
    }
  }
  return params;
}

export default async function CategoriaGeneroRankingPage({ 
  params 
}: { 
  params: { categoria: string; genero: string } 
}) {
  const categoriaKey = params.categoria.toLowerCase();
  const generoKey = params.genero.toLowerCase();
  
  const categoria = categoriaNomes[categoriaKey];
  const genero = generoNomes[generoKey];

  if (!categoria || !categorias.includes(categoria) || !genero || !generos.includes(genero)) {
    notFound();
  }

  const jogadoresRaw = await getJogadoresPorCategoriaEGenero(categoria, genero);
  const jogadores = calcularPosicoes(jogadoresRaw);
  const info = categoriaDescricoes[categoria];

  const generoEmoji = genero === 'Masculino' ? '👨' : '👩';
  const generoLabel = genero === 'Masculino' ? 'Masculino' : 'Feminino';

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
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-4xl font-bold text-gray-900">
                  Categoria {categoria}
                </h1>
                <span className="text-4xl">{generoEmoji}</span>
              </div>
              <p className="text-lg text-gray-600 mb-1">{info.nome} · {generoLabel}</p>
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

        {/* Switch Gênero */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-8">
          <div className="flex items-center justify-center gap-4">
            <span className="text-sm font-medium text-gray-600">Filtrar por:</span>
            <div className="flex gap-2">
              <Link
                href={`/ranking/${params.categoria}/masculino`}
                className={`px-6 py-2 rounded-lg font-bold transition-all ${
                  genero === 'Masculino'
                    ? 'bg-primary-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                👨 Masculino
              </Link>
              <Link
                href={`/ranking/${params.categoria}/feminino`}
                className={`px-6 py-2 rounded-lg font-bold transition-all ${
                  genero === 'Feminino'
                    ? 'bg-primary-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                👩 Feminino
              </Link>
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
              Ranking Completo - Categoria {categoria} {generoEmoji} {generoLabel}
            </h2>
          </div>
          <RankingTable jogadores={jogadores} />
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