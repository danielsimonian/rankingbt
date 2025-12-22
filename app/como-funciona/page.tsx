import { Trophy, TrendingUp, Target, Award, Calendar, Users, ArrowRight, CheckCircle } from 'lucide-react';
import Link from 'next/link';

export default function ComoFuncionaPage() {
  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 to-royal-700 text-white py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl font-bold mb-6">
              Como Funciona o Ranking
            </h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Sistema oficial de classificação baseado no padrão ITF (International Tennis Federation), 
              adaptado para o Beach Tennis da Baixada Santista
            </p>
          </div>
        </div>
      </section>

      {/* Sistema de Pontuação */}
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-primary-100 text-primary-700 px-4 py-2 rounded-full mb-4 font-semibold">
              <Trophy className="w-5 h-5" />
              Sistema de Pontuação
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Pontuação por Colocação
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Todos os jogadores, independente da categoria, seguem a mesma tabela de pontuação
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-12">
            {[
              { colocacao: 'Campeão', pontos: 100, color: 'from-yellow-400 to-yellow-600', icon: '🏆' },
              { colocacao: 'Vice', pontos: 75, color: 'from-gray-300 to-gray-400', icon: '🥈' },
              { colocacao: '3º Lugar', pontos: 50, color: 'from-amber-600 to-amber-700', icon: '🥉' },
              { colocacao: 'Quartas', pontos: 25, color: 'from-blue-400 to-blue-500', icon: '📊' },
              { colocacao: 'Oitavas', pontos: 10, color: 'from-green-400 to-green-500', icon: '📈' },
              { colocacao: 'Participação', pontos: 5, color: 'from-purple-400 to-purple-500', icon: '✓' },
            ].map((item) => (
              <div key={item.colocacao} className="bg-white rounded-xl shadow-lg border-2 border-gray-100 p-6 text-center hover:shadow-xl transition-all hover:scale-105">
                <div className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br ${item.color} flex items-center justify-center text-3xl shadow-lg`}>
                  {item.icon}
                </div>
                <div className="text-sm font-semibold text-gray-600 mb-2">{item.colocacao}</div>
                <div className="text-3xl font-black text-primary-600">{item.pontos}</div>
                <div className="text-xs text-gray-500 mt-1">pontos</div>
              </div>
            ))}
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-primary-50 rounded-2xl p-8 border-2 border-primary-100">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-primary-600 rounded-xl flex items-center justify-center">
                <Award className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Torneios Especiais
                </h3>
                <p className="text-gray-700">
                  Em torneios de maior relevância (finais de temporada, campeonatos regionais), o administrador pode definir uma 
                  <strong> pontuação especial</strong> com valores aumentados. Você será informado antes do início do torneio.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sistema Top 10 (ITF) */}
      <section className="py-16 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-700 px-4 py-2 rounded-full mb-4 font-semibold">
              <TrendingUp className="w-5 h-5" />
              Padrão ITF
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Sistema Top 10 Resultados
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Seguimos o padrão internacional da ITF (International Tennis Federation)
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <div className="bg-white rounded-2xl shadow-lg p-8 border-2 border-gray-100">
              <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                <Calendar className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Como funciona?</h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span>São computados os <strong>10 melhores resultados</strong> dos últimos 12 meses</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span>Se você jogou 15 torneios, contam os 10 melhores</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span>Se você jogou 7 torneios, contam os 7</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span>Resultados de mais de 12 meses são automaticamente descartados</span>
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-8 border-2 border-gray-100">
              <div className="w-16 h-16 bg-gradient-to-br from-royal-500 to-royal-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                <Target className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Exemplo Prático</h3>
              <div className="space-y-4 text-gray-700">
                <div className="bg-gray-50 rounded-lg p-4 border-2 border-gray-200">
                  <div className="font-bold text-gray-900 mb-2">João - Categoria B</div>
                  <div className="text-sm space-y-1">
                    <div>Jogou 12 torneios no ano</div>
                    <div className="font-mono text-xs">100, 100, 75, 75, 50, 50, 25, 25, 10, 10, 5, 5</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <ArrowRight className="w-5 h-5 text-primary-600" />
                  <div>
                    <div className="font-bold text-gray-900">Pontuação Final: 520 pontos</div>
                    <div className="text-sm text-gray-600">(soma dos 10 melhores, descarta 5 + 5)</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categorias */}
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-700 px-4 py-2 rounded-full mb-4 font-semibold">
              <Users className="w-5 h-5" />
              Categorias
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Sistema de Categorias
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Você escolhe em qual categoria quer competir
            </p>
          </div>

          <div className="grid gap-6 max-w-4xl mx-auto mb-12">
            {[
              { cat: 'A', nome: 'Elite', desc: 'Nível avançado, jogadores experientes e técnicos', color: 'red' },
              { cat: 'B', nome: 'Avançado', desc: 'Alto nível técnico, bom domínio do jogo', color: 'orange' },
              { cat: 'C', nome: 'Intermediário', desc: 'Em desenvolvimento, aprimorando técnicas', color: 'yellow' },
              { cat: 'D', nome: 'Iniciante', desc: 'Aprendizado, primeiros torneios', color: 'green' },
              { cat: 'FUN', nome: 'Recreativo', desc: 'Diversão e lazer, sem competitividade intensa', color: 'blue' },
            ].map((categoria) => (
              <div key={categoria.cat} className={`bg-gradient-to-r from-${categoria.color}-50 to-white rounded-xl p-6 border-2 border-${categoria.color}-200 hover:shadow-lg transition-all`}>
                <div className="flex items-center gap-4">
                  <div className={`w-16 h-16 bg-gradient-to-br from-${categoria.color}-500 to-${categoria.color}-600 rounded-xl flex items-center justify-center text-white font-black text-2xl shadow-lg`}>
                    {categoria.cat}
                  </div>
                  <div className="flex-1">
                    <h3 className={`text-xl font-bold text-${categoria.color}-900 mb-1`}>{categoria.nome}</h3>
                    <p className="text-gray-700">{categoria.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Mudança de Categoria */}
          <div className="bg-gradient-to-br from-primary-50 to-royal-50 rounded-2xl p-8 border-2 border-primary-200">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <TrendingUp className="w-8 h-8 text-primary-600" />
              Mudança de Categoria
            </h3>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl p-6 border-2 border-green-200">
                <div className="text-4xl mb-3">⬆️</div>
                <h4 className="text-lg font-bold text-gray-900 mb-3">Subir de Categoria</h4>
                <ul className="space-y-2 text-gray-700 text-sm">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>Você pode subir <strong>quando quiser</strong></span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>Não precisa de aprovação</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>Sua pontuação <strong>zera</strong> na nova categoria</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>Você <strong>não pode mais jogar</strong> a categoria anterior</span>
                  </li>
                </ul>
              </div>

              <div className="bg-white rounded-xl p-6 border-2 border-orange-200">
                <div className="text-4xl mb-3">⬇️</div>
                <h4 className="text-lg font-bold text-gray-900 mb-3">Descer de Categoria</h4>
                <ul className="space-y-2 text-gray-700 text-sm">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-orange-500 flex-shrink-0 mt-0.5" />
                    <span>Você precisa <strong>solicitar</strong> ao administrador</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-orange-500 flex-shrink-0 mt-0.5" />
                    <span>Informe o motivo da solicitação</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-orange-500 flex-shrink-0 mt-0.5" />
                    <span>Aguarde aprovação (pode ser rejeitada)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-orange-500 flex-shrink-0 mt-0.5" />
                    <span>Se aprovado, você <strong>recupera</strong> os pontos da categoria anterior</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Critérios de Desempate */}
      <section className="py-16 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Critérios de Desempate
              </h2>
              <p className="text-lg text-gray-600">
                Quando dois jogadores têm a mesma pontuação
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-8 border-2 border-gray-100">
              <ol className="space-y-4">
                <li className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                    1
                  </div>
                  <div>
                    <div className="font-bold text-gray-900 mb-1">Maior Pontuação</div>
                    <div className="text-gray-600 text-sm">Quem tiver mais pontos fica à frente</div>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                    2
                  </div>
                  <div>
                    <div className="font-bold text-gray-900 mb-1">Mais Torneios Disputados</div>
                    <div className="text-gray-600 text-sm">Em caso de empate nos pontos, quem jogou mais torneios tem prioridade</div>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                    3
                  </div>
                  <div>
                    <div className="font-bold text-gray-900 mb-1">Ordem Alfabética</div>
                    <div className="text-gray-600 text-sm">Se ainda assim empatar, usamos ordem alfabética</div>
                  </div>
                </li>
              </ol>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-br from-primary-600 to-royal-700 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Pronto para Começar?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Cadastre-se gratuitamente e comece a competir no ranking oficial!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/cadastro"
              className="bg-white text-primary-700 px-8 py-4 rounded-xl font-bold hover:bg-yellow-400 hover:text-gray-900 transition-all inline-flex items-center justify-center gap-2 shadow-2xl"
            >
              Cadastrar Agora
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link 
              href="/rankings"
              className="bg-white/10 backdrop-blur-sm text-white px-8 py-4 rounded-xl font-bold hover:bg-white/20 transition-all border-2 border-white/30"
            >
              Ver Rankings
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}