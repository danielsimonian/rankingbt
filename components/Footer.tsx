'use client';

import { useState } from 'react';
import { Trophy, Mail, MapPin, Calendar, ChevronDown, X, MessageCircle, Phone } from 'lucide-react';
import Link from 'next/link';
import { useTemporada } from '@/contexts/TemporadaContext';
import Image from 'next/image';


export default function Footer() {
  const { temporadaAtual, temporadas, selecionarTemporada } = useTemporada();
  const [modalAberto, setModalAberto] = useState(false);

  return (
    <>
      <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border-t border-gray-700 mt-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
          
          {/* Seletor de Temporada - DESTAQUE NO TOPO */}
          <div className="flex flex-col items-center justify-center mb-12 pb-12 border-b border-gray-700">
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

          {/* Grid de Conteúdo */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            
            {/* Brand */}
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-6 opacity-75">
                <Image src="/logo-branco.png" alt="Ranking BT" width={100} height={0} />
              </div>
              <p className="text-gray-400 text-sm leading-relaxed mb-6">
                Sistema oficial de ranking de Beach Tennis da Baixada Santista. 
                Acompanhe sua evolução, participe de torneios homologados e conquiste sua posição.
              </p>
              <div className="flex items-center gap-3 text-sm text-gray-400">
                <MapPin className="w-4 h-4 text-primary-400" />
                <span>Santos, SP</span>
              </div>
            </div>

            {/* Links Rápidos */}
            <div>
              <h3 className="font-bold text-white mb-6 text-lg">Links Rápidos</h3>
              <ul className="space-y-3">
                <li>
                  <Link href="/rankings" className="text-gray-400 hover:text-primary-400 text-sm transition-colors flex items-center gap-2 group">
                    <span className="w-1 h-1 bg-primary-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    Rankings
                  </Link>
                </li>
                <li>
                  <Link href="/como-funciona" className="text-gray-400 hover:text-primary-400 text-sm transition-colors flex items-center gap-2 group">
                    <span className="w-1 h-1 bg-primary-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    Como Funciona
                  </Link>
                </li>
                <li>
                  <Link href="/torneios" className="text-gray-400 hover:text-primary-400 text-sm transition-colors flex items-center gap-2 group">
                    <span className="w-1 h-1 bg-primary-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    Torneios
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contato */}
            <div>
              <h3 className="font-bold text-white mb-6 text-lg">Contato</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-gray-400 text-sm mb-3 leading-relaxed">
                    Para organizadores interessados em homologar torneios
                  </p>

                  {/* Container dos Links */}
                  <div className="flex flex-col items-start gap-3"> {/* flex-col garante o empilhamento */}

                    {/* WhatsApp */}
                    <a 
                      href="https://wa.me/5513997434878?text=Olá!%20Gostaria%20de%20informações%20sobre%20homologação%20de%20torneios%20no%20Ranking%20BT"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-green-400 hover:text-green-300 text-sm font-semibold transition-colors group"
                    >
                      <MessageCircle className="w-4 h-4 group-hover:scale-110 transition-transform" />
                      (13) 99743-4878
                    </a>

                    {/* Email */}
                    <a 
                      href="mailto:rankingbtbydama@gmail.com?subject=Homologação%20de%20Torneios" 
                      className="flex items-center gap-2 text-primary-400 hover:text-primary-300 text-sm font-semibold transition-colors group"
                    >
                      <Mail className="w-4 h-4 group-hover:scale-110 transition-transform" />
                      rankingbtbydama@gmail.com
                    </a>
                  </div>

                </div>
              </div>
            </div>
          </div>

          {/* Footer Bottom */}
          <div className="pt-8 border-t border-gray-700">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-gray-500 text-sm">
                © {new Date().getFullYear()} Ranking BT - Baixada Santista. Todos os direitos reservados.
              </p>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-gray-500">Sistema ativo</span>
              </div>
            </div>
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