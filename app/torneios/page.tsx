import { supabase } from '@/lib/supabase';
import { Trophy, Calendar, MapPin, CheckCircle, Clock } from 'lucide-react';

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
    const dataTorneio = new Date(t.data);
    return dataTorneio >= hoje && t.status === 'confirmado';
  }) || [];

  const torneiosRealizados = torneios?.filter(t => {
    const dataTorneio = new Date(t.data);
    return dataTorneio < hoje || t.status === 'realizado';
  }).reverse() || [];

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
              {proximosTorneios.map((torneio, index) => (
                <div
                  key={torneio.id}
                  className="group bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden border-2 border-gray-100 hover:border-primary-200 hover:scale-105"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {/* Status Badge */}
                  <div className="bg-gradient-to-r from-emerald-500 to-teal-600 px-6 py-3">
                    <div className="flex items-center gap-2 text-white">
                      <CheckCircle className="w-5 h-5" />
                      <span className="font-black text-sm uppercase">Confirmado</span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <h3 className="text-2xl font-black text-gray-900 mb-4 group-hover:text-primary-600 transition-colors">
                      {torneio.nome}
                    </h3>

                    <div className="space-y-3 mb-6">
                      <div className="flex items-center gap-3 text-gray-700">
                        <div className="flex items-center justify-center w-10 h-10 bg-primary-100 rounded-lg">
                          <Calendar className="w-5 h-5 text-primary-600" />
                        </div>
                        <span className="font-semibold">
                          {new Date(torneio.data).toLocaleDateString('pt-BR', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                          })}
                        </span>
                      </div>

                      <div className="flex items-center gap-3 text-gray-700">
                        <div className="flex items-center justify-center w-10 h-10 bg-royal-100 rounded-lg">
                          <MapPin className="w-5 h-5 text-royal-600" />
                        </div>
                        <div>
                          <div className="font-semibold">{torneio.local}</div>
                          <div className="text-sm text-gray-500">{torneio.cidade}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
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
                {torneiosRealizados.map((torneio) => (
                  <div
                    key={torneio.id}
                    className="p-6 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-bold text-gray-900">
                            {torneio.nome}
                          </h3>
                          <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-bold rounded-full uppercase">
                            Realizado
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            {new Date(torneio.data).toLocaleDateString('pt-BR', {
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric',
                            })}
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4" />
                            {torneio.local} - {torneio.cidade}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
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
        <div className="mt-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-3xl shadow-2xl p-8 md:p-12 text-white text-center">
          <Trophy className="w-16 h-16 mx-auto mb-6 text-primary-200" />
          <h2 className="text-3xl font-black mb-4">É organizador de torneios?</h2>
          <p className="text-lg text-primary-100 mb-8 max-w-2xl mx-auto">
            Homologue seus torneios no Ranking BT e faça parte do circuito oficial da Baixada Santista.
            Entre em contato conosco para saber mais sobre o processo de homologação.
          </p>
          <a
            href="mailto:contato@rankingbt.com.br"
            className="inline-block bg-white text-primary-600 px-8 py-4 rounded-xl font-black text-lg hover:bg-primary-50 transition-colors shadow-xl"
          >
            Entrar em Contato
          </a>
        </div>
      </div>
    </div>
  );
}