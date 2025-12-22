'use client';

import { useState } from 'react';
import { Search } from 'lucide-react';
import { buscarJogador } from '@/data/rankings';
import RankingTable from './RankingTable';

export default function PlayerSearch() {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<ReturnType<typeof buscarJogador>>([]);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      const jogadores = buscarJogador(searchTerm);
      setResults(jogadores);
      setHasSearched(true);
    }
  };

  return (
    <div className="w-full">
      <form onSubmit={handleSearch} className="mb-6">
        <div className="relative max-w-2xl mx-auto">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Digite o nome do jogador..."
            className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
          />
          <Search className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
          <button
            type="submit"
            className="absolute right-2 top-2 bg-primary-600 text-white px-6 py-2 rounded-md hover:bg-primary-700 transition-colors font-medium"
          >
            Buscar
          </button>
        </div>
      </form>

      {hasSearched && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {results.length > 0 ? (
            <>
              <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                <h3 className="font-semibold text-gray-900">
                  {results.length} {results.length === 1 ? 'resultado encontrado' : 'resultados encontrados'}
                </h3>
              </div>
              <RankingTable jogadores={results} showCategoria={true} />
            </>
          ) : (
            <div className="px-6 py-12 text-center text-gray-500">
              <p>Nenhum jogador encontrado com o nome &quot;{searchTerm}&quot;</p>
              <p className="text-sm mt-2">Tente buscar com um nome diferente ou verifique a ortografia.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
