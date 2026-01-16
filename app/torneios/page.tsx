import { supabase } from '@/lib/supabase';
import FormularioOrganizador from '@/components/FormularioOrganizador';
import { Trophy, Calendar, MapPin, CheckCircle, Clock, ExternalLink, MessageCircle, Award } from 'lucide-react';
import TorneioLogo from '@/components/TorneioLogo';

export const revalidate = 60;

export default async function TorneiosPage() {
  // Buscar torneios do banco de dados
  const { data: torneios } = await supabase
    .from('torneios')
    .select('*')
    .order('data', { ascending: true });

  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);

  const proximosTorneios = torneios?.filter(t => {
    const dataFim = new Date(t.data_fim || t.data);
    return dataFim >= hoje && t.status === 'confirmado';
  }) || [];

  const torneiosRealizados = torneios?.filter(t => {
    const dataFim = new Date(t.data_fim || t.data);
    return dataFim < hoje || t.status === 'realizado';
  }).reverse() || [];

  // Função para determinar o tipo de pontuação
  const getTipoPontuacao = (torneio: any) => {
    if (!torneio.pontuacao_custom) return 'RBT100';
    
    const pontos = torneio.pontuacao_custom;
    const campeao = pontos.campeao || 0;
    
    // Lógica para determinar o tipo baseado nos pontos do campeão
    if (campeao >= 200) return 'RBT200';
    if (campeao >= 150) return 'RBT150';
    if (campeao >= 100) return 'RBT100';
    if (campeao >= 50) return 'RBT50';
    return 'CUSTOM';
  };

  // Função para cor do badge de pontuação
  const getCorPontuacao = (tipo: string) => {
    const cores = {
      'RBT200': 'bg-gradient-to-r from-purple-500 to-purple-600 text-white',
      'RBT150': 'bg-gradient-to-r from-blue-500 to-blue-600 text-white',
      'RBT100': 'bg-gradient-to-r from-primary-500 to-primary-600 text-white',
      'RBT50': 'bg-gradient-to-r from-green-500 to-green-600 text-white',
      'CUSTOM': 'bg-gradient-to-r from-gray-500 to-gray-600 text-white',
    };
    return cores[tipo as keyof typeof cores] || cores.CUSTOM;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-primary-500 to-primary-600 text-white px-5 py-2.5 rounded-full mb-6 font-black text-sm shadow-xl shadow-primary-500/30">
            <Trophy className="w-4 h-4" />
            Calendário Oficial
          </div>
          <h1 className="text-4xl sm:text-5xl font-black mb-4">
            <span className="bg-gradient-to-r from-gray-900 via-royal-900 to-gray-900 bg-clip-text text-transparent">
              Torneios Homologados
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto font-medium">
            Confira o calendário completo de torneios homologados pelo Ranking BT. Participe e acumule pontos no ranking oficial!
          </p>
        </div>

        {/* Próximos Torneios */}
        {proximosTorneios.length > 0 && (
          <div className="mb-16">
            <h2 className="text-3xl font-black text-gray-900 mb-8 flex items-center gap-3">
              <Clock className="w-8 h-8 text-primary-600" />
              Próximos Torneios
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {proximosTorneios.map((torneio, index) => {
                const tipoPontuacao = getTipoPontuacao(torneio);
                const corPontuacao = getCorPontuacao(tipoPontuacao);

                return (
                  <div
                    key={torneio.id}
                    className="group bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden border-2 border-gray-100 hover:border-primary-200 hover:scale-105"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    {/* Status Badge */}
                    <div className="bg-gradient-to-r from-emerald-500 to-teal-600 px-6 py-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-white">
                          <CheckCircle className="w-5 h-5" />
                          <span className="font-black text-sm uppercase">Confirmado</span>
                        </div>
                        {/* Badge de Pontuação */}
                        <div className={`${corPontuacao} px-3 py-1 rounded-full text-xs font-black shadow-lg flex items-center gap-1`}>
                          <Award className="w-3 h-3" />
                          {tipoPontuacao}
                        </div>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      {/* LOGO DO TORNEIO */}
                      <div className="flex items-center justify-center mb-4">
                        <TorneioLogo 
                          logoUrl={torneio.logo_url}
                          nome={torneio.nome}
                          size="large"
                        />
                      </div>

                      {/* TÍTULO COM 2 LINHAS FIXAS - CARDS UNIFORMES */}
                      <h3 
                        className="font-black text-gray-900 mb-4 group-hover:text-primary-600 transition-colors text-center text-xl leading-tight line-clamp-2 px-2"
                        style={{ minHeight: '3.5rem' }}
                        title={torneio.nome}
                      >
                        {torneio.nome}
                      </h3>

                      <div className="space-y-3 mb-6">
                        <div className="flex items-center gap-3 text-gray-700">
                          <div className="flex items-center justify-center w-10 h-10 bg-primary-100 rounded-lg">
                            <Calendar className="w-5 h-5 text-primary-600" />
                          </div>
                          <div className="flex-1">
                            <span className="font-semibold block">
                              {(() => {
                                const dataInicio = new Date(torneio.data + 'T00:00:00');
                                const dataFim = new Date((torneio.data_fim || torneio.data) + 'T00:00:00');
                                const diasDuracao = Math.ceil((dataFim.getTime() - dataInicio.getTime()) / (1000 * 60 * 60 * 24)) + 1;
                                
                                if (torneio.data === torneio.data_fim || !torneio.data_fim) {
                                  return dataInicio.toLocaleDateString('pt-BR', {
                                    day: 'numeric',
                                    month: 'long',
                                    year: 'numeric',
                                  });
                                } else {
                                  const mesmoMes = dataInicio.getMonth() === dataFim.getMonth();
                                  if (mesmoMes) {
                                    return `${dataInicio.getDate()} a ${dataFim.toLocaleDateString('pt-BR', {
                                      day: 'numeric',
                                      month: 'long',
                                      year: 'numeric',
                                    })}`;
                                  } else {
                                    return `${dataInicio.toLocaleDateString('pt-BR', {
                                      day: 'numeric',
                                      month: 'short',
                                    })} a ${dataFim.toLocaleDateString('pt-BR', {
                                      day: 'numeric',
                                      month: 'long',
                                      year: 'numeric',
                                    })}`;
                                  }
                                }
                              })()}
                            </span>
                            {(() => {
                              const dataInicio = new Date(torneio.data + 'T00:00:00');
                              const dataFim = new Date((torneio.data_fim || torneio.data) + 'T00:00:00');
                              const diasDuracao = Math.ceil((dataFim.getTime() - dataInicio.getTime()) / (1000 * 60 * 60 * 24)) + 1;
                              
                              if (diasDuracao > 1) {
                                return (
                                  <span className="text-xs text-gray-500">
                                    ({diasDuracao} dias)
                                  </span>
                                );
                              }
                              return null;
                            })()}
                          </div>
                        </div>

                        <div className="flex items-center gap-3 text-gray-700">
                          <div className="flex items-center justify-center w-10 h-10 bg-royal-100 rounded-lg">
                            <MapPin className="w-5 h-5 text-royal-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-semibold truncate">{torneio.local}</div>
                            <div className="text-sm text-gray-500 truncate">{torneio.cidade}</div>
                          </div>
                        </div>
                      </div>

                      {/* Botão LetzPlay */}
                      {torneio.link_letzplay && (
                        <a
                          href={torneio.link_letzplay}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-lg hover:from-primary-600 hover:to-primary-700 transition-all font-bold shadow-lg hover:shadow-xl group/btn"
                        >
                          <ExternalLink className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
                          Ver no LetzPlay
                        </a>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Torneios Realizados */}
        {torneiosRealizados.length > 0 && (
          <div>
            <h2 className="text-3xl font-black text-gray-900 mb-8 flex items-center gap-3">
              <Trophy className="w-8 h-8 text-gray-600" />
              Torneios Realizados
            </h2>
            <div className="bg-white rounded-2xl shadow-xl border-2 border-gray-100 overflow-hidden">
              <div className="divide-y divide-gray-100">
                {torneiosRealizados.map((torneio) => {
                  const tipoPontuacao = getTipoPontuacao(torneio);
                  const corPontuacao = getCorPontuacao(tipoPontuacao);

                  return (
                    <div
                      key={torneio.id}
                      className="p-6 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-start justify-between gap-4">
                        {/* LOGO PEQUENO */}
                        <TorneioLogo 
                          logoUrl={torneio.logo_url}
                          nome={torneio.nome}
                          size="small"
                          className="flex-shrink-0"
                        />
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-2 flex-wrap">
                            <h3 className="text-xl font-bold text-gray-900 truncate">
                              {torneio.nome}
                            </h3>
                            <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-bold rounded-full uppercase flex-shrink-0">
                              Realizado
                            </span>
                            {/* Badge de Pontuação */}
                            <div className={`${corPontuacao} px-3 py-1 rounded-full text-xs font-black shadow-md flex items-center gap-1 flex-shrink-0`}>
                              <Award className="w-3 h-3" />
                              {tipoPontuacao}
                            </div>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-600 flex-wrap">
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4" />
                              {(() => {
                                const dataInicio = new Date(torneio.data + 'T00:00:00');
                                const dataFim = new Date((torneio.data_fim || torneio.data) + 'T00:00:00');
                                const diasDuracao = Math.ceil((dataFim.getTime() - dataInicio.getTime()) / (1000 * 60 * 60 * 24)) + 1;
                                
                                if (torneio.data === torneio.data_fim || !torneio.data_fim) {
                                  return dataInicio.toLocaleDateString('pt-BR', {
                                    day: 'numeric',
                                    month: 'long',
                                    year: 'numeric',
                                  });
                                } else {
                                  const mesmoMes = dataInicio.getMonth() === dataFim.getMonth();
                                  if (mesmoMes) {
                                    return `${dataInicio.getDate()} a ${dataFim.toLocaleDateString('pt-BR', {
                                      day: 'numeric',
                                      month: 'long',
                                      year: 'numeric',
                                    })} (${diasDuracao} dias)`;
                                  } else {
                                    return `${dataInicio.toLocaleDateString('pt-BR', {
                                      day: 'numeric',
                                      month: 'short',
                                    })} a ${dataFim.toLocaleDateString('pt-BR', {
                                      day: 'numeric',
                                      month: 'long',
                                      year: 'numeric',
                                    })} (${diasDuracao} dias)`;
                                  }
                                }
                              })()}
                            </div>
                            <div className="flex items-center gap-2">
                              <MapPin className="w-4 h-4" />
                              {torneio.local} - {torneio.cidade}
                            </div>
                          </div>
                        </div>

                        {/* Botão LetzPlay */}
                        {torneio.link_letzplay && (
                          <a
                            href={torneio.link_letzplay}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-primary-100 text-gray-700 hover:text-primary-700 rounded-lg transition-all font-semibold text-sm group/btn whitespace-nowrap flex-shrink-0"
                          >
                            <ExternalLink className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
                            LetzPlay
                          </a>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Nenhum torneio */}
        {(!torneios || torneios.length === 0) && (
          <div className="bg-white rounded-2xl shadow-xl border-2 border-gray-100 p-12 text-center">
            <Trophy className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Nenhum torneio cadastrado
            </h3>
            <p className="text-gray-600 mb-8">
              Em breve teremos torneios homologados disponíveis!
            </p>
          </div>
        )}

        {/* CTA para Organizadores */}
        <div className="mt-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-3xl shadow-2xl p-8 md:p-12 text-white">
          <Trophy className="w-16 h-16 mx-auto mb-6 text-primary-200" />
          <h2 className="text-3xl font-black mb-4 text-center">É organizador de torneios?</h2>
          <p className="text-lg text-primary-100 mb-8 max-w-2xl mx-auto text-center">
            Homologue seus torneios no Ranking BT e faça parte do circuito oficial da Baixada Santista.
            Preencha o formulário ou entre em contato via WhatsApp.
          </p>
          
          {/* Formulário */}
          <div className="max-w-3xl mx-auto mb-8">
            <FormularioOrganizador />
          </div>

          {/* WhatsApp alternativo */}
          <div className="text-center">
            <p className="text-primary-100 mb-4">Prefere WhatsApp?</p>
            <a
              href="https://wa.me/5513997434878?text=Olá!%20Gostaria%20de%20informações%20sobre%20homologação%20de%20torneios%20no%20Ranking%20BT"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-xl font-black text-lg transition-all shadow-xl hover:shadow-2xl hover:scale-105"
            >
              <MessageCircle className="w-5 h-5" />
              Falar no WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}