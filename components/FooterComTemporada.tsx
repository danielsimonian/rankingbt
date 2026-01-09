// components/FooterComTemporada.tsx
'use client';

import { useState } from 'react';
import { useTemporada } from '@/contexts/TemporadaContext';
import { Calendar, ChevronDown, X, Trophy } from 'lucide-react';

export default function FooterComTemporada() {
  const { temporadaAtual, temporadas, selecionarTemporada } = useTemporada();
  const [modalAberto, setModalAberto] = useState(false);

  return (
    <>
      <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white py-12 relative overflow-hidden">
        {/* Background decorativo */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-0 w-96 h-96 bg-primary-500 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Seletor de Temporada */}
          <div className="flex flex-col items-center justify-center mb-8">
            <button
              onClick={() => setModalAberto(true)}
              className="flex items-center gap-3 px-6 py-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-xl border border-white/20 transition-all group"
            >
              <Calendar className="w-5 h-5 text-primary-400" />
              <div className="text-left">
                <div className="text-xs text-gray-400 uppercase tracking-wide">
                  Temporada
                </div>
                <div className="font-bold text-white flex items-center gap-2">
                  {temporadaAtual?.nome || 'Carregando...'}
                  {temporadaAtual?.ativa && (
                    <span className="inline-flex items-center gap-1 text-xs bg-green-500 px-2 py-0.5 rounded-full">
                      <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></span>
                      Ativa
                    </span>
                  )}
                </div>
              </div>
              <ChevronDown className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors" />
            </button>
            <p className="text-xs text-gray-500 mt-2">
              Clique para ver outras temporadas
            </p>
          </div>

          {/* Divider */}
          <div className="w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent mb-8"></div>

          {/* Info do Sistema */}
          <div className="text-center space-y-2">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-primary-400 to-blue-400 bg-clip-text text-transparent">
              Ranking Beach Tennis
            </h3>
            <p className="text-gray-400 text-sm">
              Baixada Santista • Sistema RBT100
            </p>
            <p className="text-gray-500 text-xs">
              © {new Date().getFullYear()} - Todos os direitos reservados
            </p>
          </div>
        </div>
      </footer>

      {/* Modal de Seleção de Temporada */}
      {modalAberto && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setModalAberto(false)}
        >
          <div 
            className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header do Modal */}
            <div className="bg-gradient-to-r from-primary-500 to-primary-600 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Selecionar Temporada</h2>
                  <p className="text-sm text-primary-100">Escolha o ano para visualizar</p>
                </div>
              </div>
              <button
                onClick={() => setModalAberto(false)}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>

            {/* Lista de Temporadas */}
            <div className="p-6 space-y-3 max-h-[60vh] overflow-y-auto">
              {temporadas.map((temporada) => (
                <button
                  key={temporada.id}
                  onClick={() => {
                    selecionarTemporada(temporada.id);
                    setModalAberto(false);
                  }}
                  className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                    temporadaAtual?.id === temporada.id
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-200 hover:border-primary-200 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                        temporada.ativa 
                          ? 'bg-green-100 text-green-600' 
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        <Trophy className="w-6 h-6" />
                      </div>
                      <div>
                        <div className="font-bold text-gray-900 flex items-center gap-2">
                          {temporada.nome}
                          {temporada.ativa && (
                            <span className="inline-flex items-center gap-1 text-xs bg-green-500 text-white px-2 py-0.5 rounded-full">
                              <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></span>
                              Ativa
                            </span>
                          )}
                        </div>
                        <div className="text-sm text-gray-500">
                          {temporada.data_inicio ? new Date(temporada.data_inicio).getFullYear() : temporada.ano}
                          {temporada.data_fim && ` - ${new Date(temporada.data_fim).getFullYear()}`}
                        </div>
                        {temporada.descricao && (
                          <p className="text-xs text-gray-400 mt-1">{temporada.descricao}</p>
                        )}
                      </div>
                    </div>
                    
                    {temporadaAtual?.id === temporada.id && (
                      <div className="w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    )}
                  </div>
                </button>
              ))}

              {temporadas.length === 0 && (
                <div className="text-center py-12 text-gray-400">
                  <Calendar className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>Nenhuma temporada disponível</p>
                </div>
              )}
            </div>

            {/* Footer do Modal */}
            <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
              <p className="text-xs text-gray-500 text-center">
                💡 A temporada selecionada será mantida enquanto você navega pelo site
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}