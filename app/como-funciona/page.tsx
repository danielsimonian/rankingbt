import { Trophy, TrendingUp, Award, CheckCircle, AlertCircle } from 'lucide-react';

export default function ComoFuncionaPage() {
  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Como Funciona o Ranking
          </h1>
          <p className="text-lg text-gray-600">
            Entenda o sistema de pontuação e classificação do Ranking BT
          </p>
        </div>

        {/* Sistema de Pontuação */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center justify-center w-12 h-12 bg-primary-100 rounded-lg">
              <Trophy className="w-6 h-6 text-primary-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Sistema de Pontuação</h2>
          </div>
          
          <div className="space-y-4">
            <p className="text-gray-600">
              A pontuação é distribuída de acordo com a colocação final em cada torneio homologado:
            </p>
            
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center justify-between p-3 bg-white rounded border border-gray-200">
                  <span className="font-medium text-gray-700">🥇 Campeão</span>
                  <span className="font-bold text-primary-600">100 pontos</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-white rounded border border-gray-200">
                  <span className="font-medium text-gray-700">🥈 Vice-campeão</span>
                  <span className="font-bold text-primary-600">75 pontos</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-white rounded border border-gray-200">
                  <span className="font-medium text-gray-700">🥉 3º Lugar</span>
                  <span className="font-bold text-primary-600">50 pontos</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-white rounded border border-gray-200">
                  <span className="font-medium text-gray-700">Quartas de Final</span>
                  <span className="font-bold text-primary-600">25 pontos</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-white rounded border border-gray-200">
                  <span className="font-medium text-gray-700">Oitavas de Final</span>
                  <span className="font-bold text-primary-600">10 pontos</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-white rounded border border-gray-200">
                  <span className="font-medium text-gray-700">Participação</span>
                  <span className="font-bold text-primary-600">5 pontos</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Categorias */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center justify-center w-12 h-12 bg-primary-100 rounded-lg">
              <Award className="w-6 h-6 text-primary-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Categorias</h2>
          </div>
          
          <div className="space-y-4">
            <p className="text-gray-600 mb-6">
              Os jogadores são classificados em 5 categorias baseadas em sua pontuação acumulada:
            </p>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between p-4 bg-red-50 border-l-4 border-red-500 rounded">
                <div>
                  <div className="font-bold text-red-900">Categoria A - Elite</div>
                  <div className="text-sm text-red-700">Jogadores de alto nível competitivo</div>
                </div>
                <div className="font-bold text-red-600">1000+ pontos</div>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-orange-50 border-l-4 border-orange-500 rounded">
                <div>
                  <div className="font-bold text-orange-900">Categoria B - Avançado</div>
                  <div className="text-sm text-orange-700">Jogadores experientes</div>
                </div>
                <div className="font-bold text-orange-600">601-1000 pontos</div>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-yellow-50 border-l-4 border-yellow-500 rounded">
                <div>
                  <div className="font-bold text-yellow-900">Categoria C - Intermediário</div>
                  <div className="text-sm text-yellow-700">Jogadores em desenvolvimento</div>
                </div>
                <div className="font-bold text-yellow-600">301-600 pontos</div>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-green-50 border-l-4 border-green-500 rounded">
                <div>
                  <div className="font-bold text-green-900">Categoria D - Iniciante</div>
                  <div className="text-sm text-green-700">Jogadores em fase inicial</div>
                </div>
                <div className="font-bold text-green-600">101-300 pontos</div>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-blue-50 border-l-4 border-blue-500 rounded">
                <div>
                  <div className="font-bold text-blue-900">Categoria FUN - Recreativo</div>
                  <div className="text-sm text-blue-700">Jogadores iniciantes e recreativos</div>
                </div>
                <div className="font-bold text-blue-600">0-100 pontos</div>
              </div>
            </div>
          </div>
        </div>

        {/* Regras */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center justify-center w-12 h-12 bg-primary-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-primary-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Regras Importantes</h2>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
              <div>
                <div className="font-medium text-gray-900">Período de validade</div>
                <div className="text-sm text-gray-600">
                  São considerados os pontos acumulados nos últimos 12 meses
                </div>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
              <div>
                <div className="font-medium text-gray-900">Mínimo de participações</div>
                <div className="text-sm text-gray-600">
                  É necessário disputar no mínimo 3 torneios para aparecer no ranking oficial
                </div>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
              <div>
                <div className="font-medium text-gray-900">Mudança de categoria</div>
                <div className="text-sm text-gray-600">
                  A mudança de categoria é automática ao atingir a pontuação necessária
                </div>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
              <div>
                <div className="font-medium text-gray-900">Torneios homologados</div>
                <div className="text-sm text-gray-600">
                  Apenas torneios oficialmente homologados pelo Ranking BT pontuam
                </div>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
              <div>
                <div className="font-medium text-gray-900">Atualização</div>
                <div className="text-sm text-gray-600">
                  O ranking é atualizado após cada torneio homologado realizado
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Critérios de Desempate */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center justify-center w-12 h-12 bg-primary-100 rounded-lg">
              <AlertCircle className="w-6 h-6 text-primary-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Critérios de Desempate</h2>
          </div>
          
          <div className="space-y-3 text-gray-600">
            <p>Em caso de empate na pontuação, são utilizados os seguintes critérios:</p>
            <ol className="list-decimal list-inside space-y-2 ml-4">
              <li>Maior número de vitórias (títulos)</li>
              <li>Maior número de finais disputadas</li>
              <li>Maior número de torneios disputados</li>
              <li>Resultado do confronto direto (se houver)</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
