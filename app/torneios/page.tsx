import { Calendar, MapPin, CheckCircle, Clock, Play } from 'lucide-react';
import { torneios } from '@/data/rankings';

export const dynamic = 'force-dynamic'; // Força sem cache

const statusConfig = {
  confirmado: {
    label: 'Confirmado',
    icon: CheckCircle,
    color: 'bg-green-100 text-green-700 border-green-200',
    iconColor: 'text-green-600',
  },
  realizado: {
    label: 'Realizado',
    icon: CheckCircle,
    color: 'bg-gray-100 text-gray-700 border-gray-200',
    iconColor: 'text-gray-600',
  },
  em_andamento: {
    label: 'Em Andamento',
    icon: Play,
    color: 'bg-blue-100 text-blue-700 border-blue-200',
    iconColor: 'text-blue-600',
  },
};

export default function TorneiosPage() {
  const torneiosRealizados = torneios.filter(t => t.status === 'realizado').sort((a, b) => 
    new Date(b.data).getTime() - new Date(a.data).getTime()
  );
  
  const proximosTorneios = torneios.filter(t => t.status === 'confirmado').sort((a, b) => 
    new Date(a.data).getTime() - new Date(b.data).getTime()
  );

  const emAndamento = torneios.filter(t => t.status === 'em_andamento');

  const formatarData = (data: string) => {
    return new Date(data).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  };

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Torneios Homologados
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Confira o calendário completo de torneios homologados pelo Ranking BT. 
            Participe e acumule pontos no ranking oficial!
          </p>
        </div>

        {/* Em Andamento */}
        {emAndamento.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Em Andamento</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {emAndamento.map((torneio) => {
                const config = statusConfig[torneio.status];
                const StatusIcon = config.icon;
                
                return (
                  <div key={torneio.id} className="bg-white rounded-lg shadow-sm border-2 border-blue-300 p-6 hover:shadow-md transition-shadow">
                    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium border mb-4 ${config.color}`}>
                      <StatusIcon className={`w-4 h-4 ${config.iconColor}`} />
                      {config.label}
                    </div>
                    
                    <h3 className="text-xl font-bold text-gray-900 mb-4">
                      {torneio.nome}
                    </h3>
                    
                    <div className="space-y-3">
                      <div className="flex items-start gap-3 text-gray-600">
                        <Calendar className="w-5 h-5 flex-shrink-0 mt-0.5" />
                        <div className="text-sm">
                          {formatarData(torneio.data)}
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3 text-gray-600">
                        <MapPin className="w-5 h-5 flex-shrink-0 mt-0.5" />
                        <div className="text-sm">
                          <div className="font-medium text-gray-900">{torneio.local}</div>
                          <div>{torneio.cidade}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Próximos Torneios */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Próximos Torneios</h2>
          
          {proximosTorneios.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {proximosTorneios.map((torneio) => {
                const config = statusConfig[torneio.status];
                const StatusIcon = config.icon;
                
                return (
                  <div key={torneio.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium border mb-4 ${config.color}`}>
                      <StatusIcon className={`w-4 h-4 ${config.iconColor}`} />
                      {config.label}
                    </div>
                    
                    <h3 className="text-xl font-bold text-gray-900 mb-4">
                      {torneio.nome}
                    </h3>
                    
                    <div className="space-y-3">
                      <div className="flex items-start gap-3 text-gray-600">
                        <Calendar className="w-5 h-5 flex-shrink-0 mt-0.5" />
                        <div className="text-sm">
                          {formatarData(torneio.data)}
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3 text-gray-600">
                        <MapPin className="w-5 h-5 flex-shrink-0 mt-0.5" />
                        <div className="text-sm">
                          <div className="font-medium text-gray-900">{torneio.local}</div>
                          <div>{torneio.cidade}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
              <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Nenhum torneio confirmado no momento.</p>
              <p className="text-sm text-gray-500 mt-2">Fique atento! Novos torneios serão divulgados em breve.</p>
            </div>
          )}
        </div>

        {/* Torneios Realizados */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Torneios Realizados</h2>
          

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 divide-y divide-gray-200">
            {torneiosRealizados.map((torneio) => {
              const config = statusConfig[torneio.status];
              const StatusIcon = config.icon;
              
              return (
                <div key={torneio.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-bold text-gray-900">
                          {torneio.nome}
                        </h3>
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${config.color}`}>
                          <StatusIcon className={`w-3 h-3 ${config.iconColor}`} />
                          {config.label}
                        </span>
                      </div>
                      
                      <div className="flex flex-col sm:flex-row sm:items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          {formatarData(torneio.data)}
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          {torneio.local} - {torneio.cidade}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Info para Organizadores */}
        <div className="mt-12 bg-primary-50 border border-primary-200 rounded-lg p-8">
          <h3 className="text-xl font-bold text-primary-900 mb-4">
            É organizador de torneios?
          </h3>
          <p className="text-primary-800 mb-6">
            Homologue seus torneios no Ranking BT e faça parte do circuito oficial da Baixada Santista. 
            Entre em contato conosco para saber mais sobre o processo de homologação.
          </p>
          <a 
            href="mailto:contato@rankingbt.com.br"
            className="inline-flex items-center gap-2 bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors font-medium"
          >
            Entrar em Contato
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
}
