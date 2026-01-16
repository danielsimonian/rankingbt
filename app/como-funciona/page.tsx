'use client';

import Link from 'next/link';
import { 
  ArrowLeft, Trophy, TrendingUp, Users, Calendar, 
  Award, Target, Info, CheckCircle, AlertCircle
} from 'lucide-react';

export default function ComoFuncionaPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <Link
                href="/"
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </Link>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Como Funciona</h1>
                <p className="text-xs text-gray-500">Regras do Ranking</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Introdução */}
        <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-xl p-8 mb-8 text-white">
          <div className="flex items-center gap-3 mb-4">
            <Trophy className="w-8 h-8" />
            <h2 className="text-2xl font-bold">Ranking BT - Baixada Santista</h2>
          </div>
          <p className="text-primary-50 text-lg">
            Sistema oficial de pontuação para atletas de Beach Tennis da Baixada Santista
          </p>
        </div>

        {/* Seção: Categorias */}
        <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <Users className="w-6 h-6 text-primary-600" />
            <h3 className="text-2xl font-bold text-gray-900">Categorias</h3>
          </div>

          <div className="space-y-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-bold text-gray-900 mb-2">📊 Como funciona a categoria de cada jogador:</h4>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>Jogadores <strong>podem jogar em qualquer categoria</strong> (A, B, C, D, FUN)</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>Cada jogador <strong>aparece em apenas UM ranking</strong> por vez</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>O ranking mostrado é o da <strong>categoria onde mais jogou torneios</strong></span>
                </li>
              </ul>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex gap-3">
                <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-blue-900">
                  <p className="font-bold mb-2">Exemplo prático:</p>
                  <p className="mb-2">
                    <strong>João</strong> jogou 5 torneios na categoria <strong>B</strong> e 2 torneios na categoria <strong>A</strong>.
                  </p>
                  <p>
                    ✅ João aparecerá no <strong>Ranking B</strong> (onde jogou mais torneios)
                  </p>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-5 gap-4 mt-6">
              <div className="bg-yellow-50 border-2 border-yellow-400 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-yellow-700 mb-1">A</div>
                <div className="text-xs text-yellow-600">Elite</div>
              </div>
              <div className="bg-blue-50 border-2 border-blue-400 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-blue-700 mb-1">B</div>
                <div className="text-xs text-blue-600">Avançado</div>
              </div>
              <div className="bg-green-50 border-2 border-green-400 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-green-700 mb-1">C</div>
                <div className="text-xs text-green-600">Intermediário</div>
              </div>
              <div className="bg-purple-50 border-2 border-purple-400 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-purple-700 mb-1">D</div>
                <div className="text-xs text-purple-600">Iniciante</div>
              </div>
              <div className="bg-orange-50 border-2 border-orange-400 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-orange-700 mb-1">FUN</div>
                <div className="text-xs text-orange-600">Lazer</div>
              </div>
            </div>
          </div>
        </section>

        {/* Seção: Pontuação */}
        <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <TrendingUp className="w-6 h-6 text-primary-600" />
            <h3 className="text-2xl font-bold text-gray-900">Sistema de Pontuação</h3>
          </div>

          <div className="space-y-6">
            <div>
              <h4 className="font-bold text-gray-900 mb-3">🏆 Pontos por Colocação (exemplo RBT 100):</h4>
              <div className="grid md:grid-cols-2 gap-3">
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 flex justify-between items-center">
                  <span className="font-semibold text-gray-900">🥇 Campeão</span>
                  <span className="text-xl font-bold text-yellow-600">100 pts</span>
                </div>
                <div className="bg-gray-100 border border-gray-200 rounded-lg p-3 flex justify-between items-center">
                  <span className="font-semibold text-gray-900">🥈 Vice</span>
                  <span className="text-xl font-bold text-gray-600">60 pts</span>
                </div>
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 flex justify-between items-center">
                  <span className="font-semibold text-gray-900">🥉 3º Lugar</span>
                  <span className="text-xl font-bold text-orange-600">36 pts</span>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex justify-between items-center">
                  <span className="font-semibold text-gray-900">📊 Quartas</span>
                  <span className="text-xl font-bold text-blue-600">18 pts</span>
                </div>
                <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex justify-between items-center">
                  <span className="font-semibold text-gray-900">📉 Oitavas</span>
                  <span className="text-xl font-bold text-green-600">9 pts</span>
                </div>
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 flex justify-between items-center">
                  <span className="font-semibold text-gray-900">✅ Participação</span>
                  <span className="text-xl font-bold text-purple-600">4 pts</span>
                </div>
              </div>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h4 className="font-bold text-green-900 mb-2">📈 Como é calculado o ranking:</h4>
              <ul className="space-y-2 text-green-800 text-sm">
                <li className="flex items-start gap-2">
                  <Award className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <span>Soma dos <strong>10 melhores resultados</strong> dos últimos 12 meses</span>
                </li>
                <li className="flex items-start gap-2">
                  <Calendar className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <span>Apenas torneios da <strong>categoria onde mais jogou</strong> contam</span>
                </li>
                <li className="flex items-start gap-2">
                  <Target className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <span>Pontuação varia por torneio (RBT 10, RBT 50, RBT 100, RBT 200, RBT 400, até eventos especiais de 1000 pts)</span>
                </li>
              </ul>
            </div>

            <div className="bg-amber-50 border-2 border-amber-300 rounded-lg p-5">
              <div className="flex gap-3">
                <AlertCircle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-amber-900">
                  <p className="font-bold mb-2 text-base">⚠️ Importante: Pontuação por Torneio</p>
                  <p className="mb-4">
                    Cada torneio pode ter uma <strong>pontuação diferente </strong> 
                     baseada no número de participantes.
                  </p>
                  <div className="bg-amber-100 rounded-lg p-4 mt-3 border border-amber-300">
                    <p className="font-bold mb-3 text-amber-900">📊 Como é definida a pontuação do torneio:</p>
                    <p className="mb-4 font-semibold">
                      O número no nome do torneio representa a <strong>quantidade mínima de inscritos</strong>. 
                      Quanto mais atletas participam, maior a pontuação distribuída!
                    </p>
                    <div className="mt-4 space-y-2 text-sm bg-white rounded-lg p-4 border border-amber-200">
                      <p className="font-bold text-amber-900 mb-3">Níveis de Pontuação:</p>
                      
                      {/* Torneios Regulares */}
                      <div className="space-y-2.5 mb-4 pb-4 border-b border-amber-200">
                        <p className="font-bold text-sm text-amber-800 mb-3">TORNEIOS REGULARES:</p>
                        <div className="space-y-2">
                          <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                            <p className="font-bold text-orange-900">🎉 RBT 10</p>
                            <p className="text-xs text-orange-800 mt-1">Torneios-festa (churrascos, eventos sociais, etc)</p>
                          </div>
                          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                            <p className="font-bold text-green-900">🎾 RBT 50</p>
                            <p className="text-xs text-green-800 mt-1">Mínimo de 50 atletas inscritos</p>
                          </div>
                          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                            <p className="font-bold text-blue-900">🏆 RBT 100</p>
                            <p className="text-xs text-blue-800 mt-1">Mínimo de 100 atletas inscritos (padrão)</p>
                          </div>
                          <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                            <p className="font-bold text-purple-900">⭐ RBT 200</p>
                            <p className="text-xs text-purple-800 mt-1">Mínimo de 200 atletas inscritos (grande)</p>
                          </div>
                          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                            <p className="font-bold text-yellow-900">👑 RBT 400</p>
                            <p className="text-xs text-yellow-800 mt-1">Mínimo de 400 atletas inscritos (premium)</p>
                          </div>
                        </div>
                      </div>
                      
                      {/* Eventos Especiais */}
                      <div className="space-y-2 bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-lg border-2 border-purple-300">
                        <p className="font-bold text-sm text-purple-900 mb-3">🌟 EVENTOS ESPECIAIS:</p>
                        <div className="space-y-2">
                          <div className="bg-white border-2 border-purple-300 rounded-lg p-3">
                            <p className="font-bold text-purple-900">🏅 RSS CLASSIC</p>
                            <p className="text-xs text-purple-800 mt-1">Evento especial - <span className="font-black text-purple-700">1000 pontos</span> para o campeão</p>
                          </div>
                          <div className="bg-white border-2 border-pink-300 rounded-lg p-3">
                            <p className="font-bold text-pink-900">🏆 RSS FINALS</p>
                            <p className="text-xs text-pink-800 mt-1">Grande final do ano - Pontuação especial</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Seção: Exemplo Prático */}
        <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <Target className="w-6 h-6 text-primary-600" />
            <h3 className="text-2xl font-bold text-gray-900">Exemplo Prático Completo</h3>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-blue-200 rounded-lg p-6">
            <h4 className="font-bold text-gray-900 mb-4">🎾 Maria Silva - Trajetória no Ranking</h4>
            
            <div className="space-y-3 mb-6">
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <p className="text-sm text-gray-600 mb-2">📅 Últimos 12 meses:</p>
                <ul className="space-y-1 text-sm text-gray-700">
                  <li>• 6 torneios na categoria <strong>B</strong></li>
                  <li>• 3 torneios na categoria <strong>C</strong></li>
                  <li>• 1 torneio na categoria <strong>A</strong></li>
                </ul>
              </div>

              <div className="bg-white rounded-lg p-4 border border-blue-300">
                <p className="font-bold text-blue-900 mb-2">✅ Resultado:</p>
                <p className="text-sm text-gray-700">
                  Maria aparece no <strong className="text-blue-600">Ranking Categoria B</strong> 
                  (onde jogou mais torneios)
                </p>
              </div>

              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <p className="text-sm text-gray-600 mb-2">🏆 Pontuação (Top 10 resultados da categoria B):</p>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>1º lugar: 100 pts</div>
                  <div>3º lugar: 36 pts</div>
                  <div>Vice: 60 pts</div>
                  <div>Quartas: 18 pts</div>
                  <div>Vice: 60 pts</div>
                  <div>Quartas: 18 pts</div>
                </div>
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <p className="font-bold text-lg text-primary-600">
                    Total: 292 pontos no Ranking B
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-4">
              <p className="text-sm text-yellow-900">
                <strong>💡 Dica:</strong> Os 3 torneios que ela jogou na categoria C 
                não contam para sua pontuação, pois ela aparece no ranking B.
              </p>
            </div>
          </div>
        </section>

        {/* Seção: Perguntas Frequentes */}
        <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <div className="flex items-center gap-3 mb-6">
            <Info className="w-6 h-6 text-primary-600" />
            <h3 className="text-2xl font-bold text-gray-900">Perguntas Frequentes</h3>
          </div>

          <div className="space-y-4">
            <details className="bg-gray-50 rounded-lg p-4 cursor-pointer">
              <summary className="font-bold text-gray-900 cursor-pointer">
                ❓ Posso jogar em categorias diferentes?
              </summary>
              <p className="mt-2 text-gray-700 text-sm">
                <strong>Sim!</strong> Você pode jogar em qualquer categoria (A, B, C, D, FUN). 
                O sistema automaticamente te coloca no ranking da categoria onde você mais jogou torneios.
              </p>
            </details>

            <details className="bg-gray-50 rounded-lg p-4 cursor-pointer">
              <summary className="font-bold text-gray-900 cursor-pointer">
                ❓ Posso aparecer em dois rankings ao mesmo tempo?
              </summary>
              <p className="mt-2 text-gray-700 text-sm">
                <strong>Não.</strong> Cada jogador aparece em apenas um ranking - 
                o da categoria onde jogou mais torneios nos últimos 12 meses.
              </p>
            </details>

            <details className="bg-gray-50 rounded-lg p-4 cursor-pointer">
              <summary className="font-bold text-gray-900 cursor-pointer">
                ❓ E se eu jogar a mesma quantidade de torneios em duas categorias?
              </summary>
              <p className="mt-2 text-gray-700 text-sm">
                O sistema escolhe a <strong>categoria mais alta</strong>. 
                Exemplo: se você jogou 3 torneios na B e 3 na C, aparecerá no Ranking B.
              </p>
            </details>

            <details className="bg-gray-50 rounded-lg p-4 cursor-pointer">
              <summary className="font-bold text-gray-900 cursor-pointer">
                ❓ Como faço para mudar de categoria?
              </summary>
              <p className="mt-2 text-gray-700 text-sm">
                Sua categoria muda <strong>automaticamente</strong> conforme você joga torneios. 
                Basta jogar mais torneios na categoria desejada que o sistema te move para lá.
              </p>
            </details>

            <details className="bg-gray-50 rounded-lg p-4 cursor-pointer">
              <summary className="font-bold text-gray-900 cursor-pointer">
                ❓ Por quanto tempo os pontos valem?
              </summary>
              <p className="mt-2 text-gray-700 text-sm">
                Os pontos valem por <strong>12 meses</strong> a partir da data do torneio. 
                Após esse período, eles são removidos automaticamente do cálculo.
              </p>
            </details>

            <details className="bg-gray-50 rounded-lg p-4 cursor-pointer">
              <summary className="font-bold text-gray-900 cursor-pointer">
                ❓ Todos os meus resultados contam para o ranking?
              </summary>
              <p className="mt-2 text-gray-700 text-sm">
                Apenas os <strong>10 melhores resultados</strong> dos últimos 12 meses 
                na sua categoria principal são contabilizados.
              </p>
            </details>

            <details className="bg-gray-50 rounded-lg p-4 cursor-pointer">
              <summary className="font-bold text-gray-900 cursor-pointer">
                ❓ Como é definida a pontuação de cada torneio (RBT 10, RBT 100, RBT 200, etc)?
              </summary>
              <div className="mt-3 text-gray-700 text-sm space-y-3">
                <p className="font-semibold">
                  O número representa a <strong>quantidade mínima de atletas inscritos</strong>. 
                  Quanto mais participantes, maior a pontuação distribuída!
                </p>
                <div className="bg-white rounded-lg p-3 border border-gray-200">
                  <p className="font-bold mb-2">Torneios regulares:</p>
                  <ul className="space-y-1 text-xs">
                    <li>• <strong>RBT 10:</strong> Torneios-festa (churrascos, eventos sociais)</li>
                    <li>• <strong>RBT 50:</strong> Mínimo de 50 atletas</li>
                    <li>• <strong>RBT 100:</strong> Mínimo de 100 atletas (padrão)</li>
                    <li>• <strong>RBT 200:</strong> Mínimo de 200 atletas</li>
                    <li>• <strong>RBT 400:</strong> Mínimo de 400 atletas</li>
                  </ul>
                </div>
                <div className="bg-purple-50 rounded-lg p-3 border border-purple-200">
                  <p className="font-bold mb-2 text-purple-900">🌟 Eventos Especiais:</p>
                  <ul className="space-y-1 text-xs text-purple-900">
                    <li>• <strong>RSS CLASSIC:</strong> 1000 pontos para o campeão</li>
                    <li>• <strong>RSS FINALS:</strong> Grande final do ano</li>
                  </ul>
                </div>
              </div>
            </details>
          </div>
        </section>

        {/* Call to Action */}
        <div className="mt-12 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-8 py-4 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-bold text-lg shadow-lg"
          >
            <Trophy className="w-5 h-5" />
            Ver Rankings
          </Link>
        </div>

      </main>
    </div>
  );
}