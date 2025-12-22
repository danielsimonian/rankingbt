'use client';

import { Jogador } from '@/types/database';
import { Trophy, Medal, Award } from 'lucide-react';

interface RankingTableProps {
  jogadores: Jogador[];
  showCategoria?: boolean;
}

export default function RankingTable({ jogadores, showCategoria = false }: RankingTableProps) {
  const getPosicaoIcon = (posicao: number) => {
    if (posicao === 1) return <Trophy className="w-5 h-5 text-yellow-500" />;
    if (posicao === 2) return <Medal className="w-5 h-5 text-gray-400" />;
    if (posicao === 3) return <Award className="w-5 h-5 text-amber-600" />;
    return null;
  };

  const getCategoriaColor = (cat: string) => {
    const colors: Record<string, string> = {
      'A': 'bg-red-100 text-red-700',
      'B': 'bg-orange-100 text-orange-700',
      'C': 'bg-yellow-100 text-yellow-700',
      'D': 'bg-green-100 text-green-700',
      'FUN': 'bg-blue-100 text-blue-700',
    };
    return colors[cat] || 'bg-gray-100 text-gray-700';
  };

  if (jogadores.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p>Nenhum jogador encontrado nesta categoria.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Posição
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Jogador
            </th>
            {showCategoria && (
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Categoria
              </th>
            )}
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Pontos
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Torneios
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {jogadores.map((jogador, index) => (
            <tr key={jogador.id} className="hover:bg-gray-50 transition-colors">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center gap-2">
                  {getPosicaoIcon(jogador.posicao || index + 1)}
                  <span className="font-medium text-gray-900">
                    {jogador.posicao || index + 1}º
                  </span>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">{jogador.nome}</div>
                {jogador.cidade && (
                  <div className="text-xs text-gray-500">{jogador.cidade}</div>
                )}
              </td>
              {showCategoria && (
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getCategoriaColor(jogador.categoria)}`}>
                    {jogador.categoria}
                  </span>
                </td>
              )}
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-bold text-primary-600">{jogador.pontos}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-500">{jogador.torneios_disputados}</div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}