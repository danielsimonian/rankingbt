import Link from 'next/link';
import { Trophy, TrendingUp, Users, Calendar, Award, ArrowRight, Sparkles, Target, Zap, ExternalLink } from 'lucide-react';
import PlayerSearch from '@/components/PlayerSearch';
import { getJogadores, getTorneios, calcularPosicoes } from '@/lib/api';
import TorneioLogo from '@/components/TorneioLogo';

export const revalidate = 60; // Revalidar a cada 60 segundos

export default async function Home() {
  const jogadores = await getJogadores();
  const torneios = await getTorneios();
  
  const top5Geral = calcularPosicoes(jogadores).slice(0, 5);
  const proximosTorneios = torneios
    .filter(t => {
      const dataFim = new Date(t.data_fim || t.data);
      const hoje = new Date();
      hoje.setHours(0, 0, 0, 0);
      return dataFim >= hoje && t.status === 'confirmado';
    })
    .sort((a, b) => new Date(a.data).getTime() - new Date(b.data).getTime())
    .slice(0, 3);

  const stats = [
    { label: 'Jogadores Ativos', value: jogadores.length, icon: Users, color: 'from-blue-500 to-cyan-500' },
    { label: 'Torneios Realizados', value: torneios.filter(t => t.status === 'realizado').length, icon: Trophy, color: 'from-amber-500 to-orange-500' },
    { label: 'Próximos Eventos', value: torneios.filter(t => t.status === 'confirmado').length, icon: Calendar, color: 'from-emerald-500 to-teal-500' },
  ];

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-royal-900 via-royal-800 to-gray-900 text-white overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-royal-600/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
        </div>
        
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}></div>
        </div>
        
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
          <div className="text-center max-w-4xl mx-auto">
            {/* Premium Badge */}
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-primary-500/20 to-primary-600/20 backdrop-blur-sm px-5 py-2.5 rounded-full mb-8 border border-primary-500/30 shadow-lg shadow-primary-500/20">
              <Sparkles className="w-4 h-4 text-primary-400" />
              <span className="text-sm font-bold bg-gradient-to-r from-primary-300 to-primary-100 bg-clip-text text-transparent">
                Sistema Oficial Homologado
              </span>
            </div>
            
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black mb-6 tracking-tight leading-tight">
              Ranking Oficial de
              <span className="block bg-gradient-to-r from-primary-400 via-primary-300 to-primary-400 bg-clip-text text-transparent mt-3 drop-shadow-2xl">
                Beach Tennis
              </span>
            </h1>
            <p className="text-2xl sm:text-3xl text-primary-300 mb-6 font-bold">
              Baixada Santista
            </p>
            <p className="text-lg sm:text-xl text-gray-300 mb-12 max-w-2xl mx-auto leading-relaxed">
              Acompanhe o ranking oficial, torneios homologados e os melhores atletas da região em tempo real.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/rankings"
                className="group relative bg-gradient-to-r from-primary-500 to-primary-600 text-gray-900 px-10 py-4 rounded-xl font-black hover:from-primary-400 hover:to-primary-500 transition-all duration-300 inline-flex items-center justify-center gap-2 shadow-2xl shadow-primary-500/50 hover:shadow-primary-400/60 hover:scale-105 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700"></div>
                <Trophy className="w-5 h-5 relative z-10" />
                <span className="relative z-10">Ver Rankings Oficiais</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform relative z-10" />
              </Link>
              <Link 
                href="#torneios"
                className="bg-white/10 backdrop-blur-sm text-white px-10 py-4 rounded-xl font-bold hover:bg-white/20 transition-all duration-300 border-2 border-white/30 shadow-xl hover:shadow-2xl hover:scale-105"
              >
                Próximos Torneios
              </Link>
            </div>
          </div>
        </div>
        
        {/* Premium Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg className="w-full h-auto" viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="#F9FAFB"/>
          </svg>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-b from-gray-50 to-white -mt-1">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {stats.map((stat, index) => (
              <div 
                key={stat.label} 
                className="group relative bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 p-8 text-center overflow-hidden border-2 border-transparent hover:border-primary-200 hover:scale-105"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Premium gradient background */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary-50/50 via-transparent to-royal-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                {/* Shine effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                
                {/* Content */}
                <div className="relative z-10">
                  {/* Premium Icon */}
                  <div className={`inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br ${stat.color} rounded-2xl mb-6 shadow-2xl transform group-hover:rotate-12 group-hover:scale-110 transition-all duration-500`}>
                    <stat.icon className="w-10 h-10 text-white drop-shadow-lg" />
                  </div>
                  
                  {/* Number with gradient */}
                  <div className="text-5xl font-black mb-3 bg-gradient-to-br from-gray-900 via-gray-700 to-gray-900 bg-clip-text text-transparent drop-shadow-sm">
                    {stat.value}
                  </div>
                  
                  {/* Label */}
                  <div className="text-gray-600 font-bold text-lg">{stat.label}</div>
                  
                  {/* Premium underline */}
                  <div className="mt-4 h-1 w-0 group-hover:w-20 bg-gradient-to-r from-primary-500 to-royal-600 mx-auto transition-all duration-500 rounded-full"></div>
                </div>
                
                {/* Corner decoration */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-primary-100/50 to-transparent rounded-bl-full"></div>
                <div className="absolute bottom-0 left-0 w-20 h-20 bg-gradient-to-tr from-royal-100/50 to-transparent rounded-tr-full"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Player Search */}
      <section className="py-20 bg-white relative overflow-hidden">
        {/* Elegant background decoration */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-100/30 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-royal-100/30 rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-primary-100 to-royal-100 text-royal-900 px-5 py-2.5 rounded-full mb-6 font-bold text-sm border-2 border-primary-200/50 shadow-lg">
              <Target className="w-4 h-4 text-primary-600" />
              Encontre sua posição no ranking
            </div>
            <h2 className="text-4xl sm:text-5xl font-black mb-6">
              <span className="bg-gradient-to-r from-gray-900 via-royal-900 to-gray-900 bg-clip-text text-transparent">
                Buscar Jogador
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto font-medium">
              Encontre sua posição no ranking ou busque por outros competidores da região
            </p>
          </div>
          <PlayerSearch />
        </div>
      </section>

{/* Top 5 por Categoria Aleatória */}
      <section className="py-20 bg-gradient-to-br from-gray-50 via-primary-50/20 to-royal-50/20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {(() => {
            // Tentar diferentes combinações até achar jogadores
            const categorias = ['C', 'B', 'A', 'D', 'FUN'];
            const generos = ['Masculino', 'Feminino'];
            
            let top5Categoria: typeof jogadores = [];
            let categoriaEscolhida = '';
            let generoEscolhido = '';
            
            // Sortear categoria e gênero, ou usar a primeira disponível
            for (let i = 0; i < categorias.length && top5Categoria.length === 0; i++) {
              for (let j = 0; j < generos.length && top5Categoria.length === 0; j++) {
                const catIndex = (Math.floor(Math.random() * categorias.length) + i) % categorias.length;
                const genIndex = (Math.floor(Math.random() * generos.length) + j) % generos.length;
                
                const cat = categorias[catIndex];
                const gen = generos[genIndex];
                
                const filtrados = jogadores.filter(jog => 
                  jog.categoria === cat && 
                  jog.genero === gen &&
                  jog.pontos > 0
                );
                
                if (filtrados.length > 0) {
                  top5Categoria = calcularPosicoes(filtrados).slice(0, 5);
                  categoriaEscolhida = cat;
                  generoEscolhido = gen;
                }
              }
            }
            
            // Se ainda não achou, pega qualquer categoria com jogadores
            if (top5Categoria.length === 0) {
              const comPontos = jogadores.filter(j => j.pontos > 0);
              if (comPontos.length > 0) {
                top5Categoria = calcularPosicoes(comPontos).slice(0, 5);
                categoriaEscolhida = 'Geral';
                generoEscolhido = '';
              } else {
                // Se realmente não tem nenhum jogador, não mostra nada
                return null;
              }
            }
            
            return (
              <>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-10 gap-4">
                  <div>
                    <div className="inline-flex items-center gap-2 bg-gradient-to-r from-primary-500 to-primary-600 text-white px-5 py-2.5 rounded-full mb-4 font-black text-sm shadow-xl shadow-primary-500/30">
                      <Trophy className="w-4 h-4" />
                      Top 5
                    </div>
                    <h2 className="text-3xl sm:text-4xl font-black bg-gradient-to-r from-gray-900 via-royal-900 to-gray-900 bg-clip-text text-transparent">
                      {categoriaEscolhida === 'Geral' 
                        ? 'Ranking Geral' 
                        : `Categoria ${categoriaEscolhida}${generoEscolhido ? ` - ${generoEscolhido}` : ''}`
                      }
                    </h2>
                  </div>
                  <Link 
                    href="/rankings"
                    className="inline-flex items-center justify-center gap-2 text-royal-700 hover:text-primary-600 font-bold bg-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all"
                  >
                    Ver todos os rankings
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
                
                {/* MOBILE: Cards */}
                <div className="lg:hidden space-y-3">
                  {top5Categoria.map((jogador, index) => {
                    const isPodium = index < 3;
                    const podiumColors = [
                      'from-yellow-50 to-amber-50 border-yellow-300',
                      'from-gray-50 to-slate-50 border-gray-300',
                      'from-orange-50 to-amber-50 border-orange-300',
                    ];

                    return (
                      <Link
                        key={jogador.id}
                        href={`/jogador/${jogador.id}`}
                        className={`block bg-white rounded-xl border-2 p-4 shadow-sm hover:shadow-md transition-all ${
                          isPodium ? `bg-gradient-to-br ${podiumColors[index]}` : 'border-gray-200'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          {/* Posição */}
                          <div
                            className={`flex items-center justify-center w-14 h-14 rounded-xl font-black text-xl shadow-md flex-shrink-0 ${
                              index === 0
                                ? 'bg-gradient-to-br from-primary-400 to-primary-600 text-white'
                                : index === 1
                                ? 'bg-gradient-to-br from-gray-300 to-gray-500 text-white'
                                : index === 2
                                ? 'bg-gradient-to-br from-orange-400 to-orange-600 text-white'
                                : 'bg-gray-100 text-gray-700'
                            }`}
                          >
                            {index === 0 ? (
                              <div className="relative">
                                <Trophy className="w-7 h-7" />
                                <Sparkles className="w-3 h-3 text-white absolute -top-1 -right-1" />
                              </div>
                            ) : (
                              jogador.posicao
                            )}
                          </div>

                          {/* Info */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="font-black text-gray-900 text-lg truncate">
                                {jogador.nome}
                              </h3>
                              <span
                                className={`px-2 py-0.5 rounded-full text-xs font-black flex-shrink-0 ${
                                  jogador.categoria === 'A' ? 'bg-red-100 text-red-700' :
                                  jogador.categoria === 'B' ? 'bg-orange-100 text-orange-700' :
                                  jogador.categoria === 'C' ? 'bg-yellow-100 text-yellow-700' :
                                  jogador.categoria === 'D' ? 'bg-green-100 text-green-700' :
                                  'bg-blue-100 text-blue-700'
                                }`}
                              >
                                {jogador.categoria}
                              </span>
                            </div>

                            <div className="flex items-center gap-3 text-xs text-gray-600 mb-3">
                              <span>{jogador.genero === 'Masculino' ? '👨' : '👩'} {jogador.genero}</span>
                              <span>•</span>
                              <span>{jogador.torneios_disputados} torneios</span>
                            </div>

                            <div className="flex items-center gap-2">
                              <Award className="w-5 h-5 text-primary-600" />
                              <span className="font-black text-primary-600 text-2xl">{jogador.pontos}</span>
                              <span className="text-sm text-gray-500 font-bold">pontos</span>
                            </div>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>

                {/* DESKTOP: Tabela Horizontal */}
                <div className="hidden lg:block bg-white rounded-3xl shadow-2xl border-2 border-gray-100 overflow-hidden">
                  <div className="divide-y divide-gray-100">
                    {top5Categoria.map((jogador, index) => {
                      const podiumGradients = [
                        'from-primary-400 via-primary-500 to-primary-600',
                        'from-gray-300 via-gray-400 to-gray-500', 
                        'from-amber-600 via-amber-700 to-amber-800'
                      ];
                      const podiumBg = [
                        'bg-gradient-to-br from-primary-50 via-yellow-50 to-amber-50',
                        'bg-gradient-to-br from-gray-50 to-slate-50',
                        'bg-gradient-to-br from-orange-50 to-amber-50'
                      ];
                      const podiumShadow = [
                        'shadow-primary-500/20',
                        'shadow-gray-400/20',
                        'shadow-amber-600/20'
                      ];
                      const isPodium = index < 3;
                      
                      return (
                        <Link
                          key={jogador.id}
                          href={`/jogador/${jogador.id}`}
                          className={`flex items-center justify-between p-8 hover:bg-gradient-to-r hover:from-transparent hover:to-primary-50/30 transition-all duration-300 ${isPodium ? podiumBg[index] : ''} relative group`}
                        >
                          {/* Shine effect for podium */}
                          {isPodium && (
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                          )}
                          
                          <div className="flex items-center gap-6 relative z-10">
                            {/* Premium Position Badge */}
                            <div className={`relative flex items-center justify-center w-16 h-16 rounded-2xl font-black text-xl shadow-2xl ${podiumShadow[index] || ''} ${
                              isPodium 
                                ? `bg-gradient-to-br ${podiumGradients[index]} text-white`
                                : 'bg-gradient-to-br from-gray-100 to-gray-200 text-gray-700'
                            } transform group-hover:scale-110 transition-transform`}>
                              {isPodium && index === 0 && <Trophy className="w-7 h-7 drop-shadow-lg" />}
                              {!isPodium && jogador.posicao}
                              {isPodium && index !== 0 && (
                                <span className="drop-shadow-md">{jogador.posicao}</span>
                              )}
                              
                              {/* Crown for 1st place */}
                              {index === 0 && (
                                <div className="absolute -top-2 -right-2 w-6 h-6 bg-primary-400 rounded-full flex items-center justify-center shadow-lg">
                                  <Sparkles className="w-3 h-3 text-white" />
                                </div>
                              )}
                            </div>
                            
                            {/* Player Info */}
                            <div>
                              <div className="font-black text-gray-900 text-xl mb-1">{jogador.nome}</div>
                              <div className="flex items-center gap-3">
                                <span className={`px-3 py-1 text-xs font-black rounded-full shadow-sm ${
                                  jogador.categoria === 'A' ? 'bg-gradient-to-r from-accent-500 to-accent-600 text-white' :
                                  jogador.categoria === 'B' ? 'bg-gradient-to-r from-orange-400 to-orange-500 text-white' :
                                  jogador.categoria === 'C' ? 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-white' :
                                  jogador.categoria === 'D' ? 'bg-gradient-to-r from-green-400 to-green-500 text-white' :
                                  'bg-gradient-to-r from-royal-400 to-royal-500 text-white'
                                }`}>
                                  CATEGORIA {jogador.categoria}
                                </span>
                                <span className="text-xs font-bold text-gray-500 uppercase">{jogador.genero}</span>
                                <span className="text-sm text-gray-600 font-semibold">{jogador.torneios_disputados} torneios</span>
                              </div>
                            </div>
                          </div>
                          
                          {/* Points - Premium display */}
                          <div className="text-right relative z-10">
                            <div className="font-black text-3xl bg-gradient-to-br from-primary-600 via-primary-500 to-royal-600 bg-clip-text text-transparent drop-shadow-sm">
                              {jogador.pontos}
                            </div>
                            <div className="text-sm text-gray-600 font-bold uppercase tracking-wide">pontos</div>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </>
            );
          })()}
        </div>
      </section>

      {/* Próximos Torneios */}
      <section id="torneios" className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-10">
            <div>
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-800 px-5 py-2.5 rounded-full mb-4 font-bold text-sm border-2 border-emerald-200/50 shadow-lg">
                <Calendar className="w-4 h-4" />
                Calendário 2025
              </div>
              <h2 className="text-4xl font-black bg-gradient-to-r from-gray-900 via-royal-900 to-gray-900 bg-clip-text text-transparent">
                Próximos Torneios
              </h2>
            </div>
            <Link 
              href="/torneios"
              className="hidden sm:inline-flex items-center gap-2 text-royal-700 hover:text-primary-600 font-bold group bg-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all"
            >
              Ver calendário completo
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {proximosTorneios.map((torneio, index) => (
              <div 
  key={torneio.id} 
  className="group relative bg-gradient-to-br from-white via-white to-gray-50 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 p-8 border-2 border-gray-100 hover:border-primary-200 hover:scale-105 overflow-hidden"
  style={{ animationDelay: `${index * 100}ms` }}
>
  {/* Premium decorative gradient */}
  <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-primary-100 via-primary-50 to-transparent rounded-bl-full opacity-60"></div>
  <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-royal-100 to-transparent rounded-tr-full opacity-40"></div>
  
  {/* Shine effect */}
  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
  
  <div className="relative z-10">
    {/* LOGO DO TORNEIO - NOVO! */}
    <div className="flex items-center justify-center mb-6">
      <TorneioLogo 
        logoUrl={torneio.logo_url}
        nome={torneio.nome}
        size="medium"
      />
    </div>
    
    {/* Content */}
    <h3 className="font-black text-gray-900 text-xl mb-3 leading-tight group-hover:text-royal-900 transition-colors text-center">{torneio.nome}</h3>
    <p className="text-primary-600 font-bold mb-6 text-lg text-center">{torneio.cidade}</p>
    
    <div className="space-y-4">
      <div className="flex items-center gap-3 text-gray-700">
        <div className="flex items-center justify-center w-11 h-11 bg-gradient-to-br from-royal-100 to-royal-200 rounded-xl shadow-md">
          <Calendar className="w-5 h-5 text-royal-700" />
        </div>
        <div className="flex-1">
          <div className="text-sm font-bold">
            {(() => {
              const dataInicio = new Date(torneio.data);
              const dataFim = new Date(torneio.data_fim || torneio.data);
              const diasDuracao = Math.ceil((dataFim.getTime() - dataInicio.getTime()) / (1000 * 60 * 60 * 24)) + 1;
              
              if (torneio.data === torneio.data_fim || !torneio.data_fim) {
                return dataInicio.toLocaleDateString('pt-BR', { 
                  day: '2-digit', 
                  month: 'long', 
                  year: 'numeric' 
                });
              } else {
                const mesmoMes = dataInicio.getMonth() === dataFim.getMonth();
                if (mesmoMes) {
                  return `${dataInicio.getDate()} a ${dataFim.toLocaleDateString('pt-BR', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric',
                  })}`;
                } else {
                  return `${dataInicio.toLocaleDateString('pt-BR', {
                    day: '2-digit',
                    month: 'short',
                  })} a ${dataFim.toLocaleDateString('pt-BR', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric',
                  })}`;
                }
              }
            })()}
          </div>
          {(() => {
            const dataInicio = new Date(torneio.data);
            const dataFim = new Date(torneio.data_fim || torneio.data);
            const diasDuracao = Math.ceil((dataFim.getTime() - dataInicio.getTime()) / (1000 * 60 * 60 * 24)) + 1;
            
            if (diasDuracao > 1) {
              return (
                <div className="text-xs text-gray-500 mt-0.5">
                  ({diasDuracao} dias)
                </div>
              );
            }
            return null;
          })()}
        </div>
      </div>
      <div className="flex items-center gap-3 text-gray-700">
        <div className="flex items-center justify-center w-11 h-11 bg-gradient-to-br from-primary-100 to-primary-200 rounded-xl shadow-md">
          <Award className="w-5 h-5 text-primary-700" />
        </div>
        <div className="text-sm font-bold">{torneio.local}</div>
      </div>
    </div>
    
    {/* Link LetzPlay */}
    {torneio.link_letzplay && (
      <a
        href={torneio.link_letzplay}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-6 flex items-center justify-center gap-2 w-full px-4 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-lg hover:from-primary-600 hover:to-primary-700 transition-all font-bold shadow-lg hover:shadow-xl group/btn"
      >
        <ExternalLink className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
        Ver no LetzPlay
      </a>
    )}
    
    {/* Premium Badge */}
    <div className="mt-6 inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-4 py-2 rounded-full text-xs font-black shadow-lg">
      <Zap className="w-3 h-3" />
      CONFIRMADO
    </div>
  </div>
</div>
            ))}
          </div>
          
          <Link 
            href="/torneios"
            className="sm:hidden mt-8 w-full inline-flex items-center justify-center gap-2 text-royal-700 hover:text-primary-600 font-bold py-4 bg-white rounded-xl border-2 border-royal-200 shadow-lg hover:shadow-xl transition-all"
          >
            Ver calendário completo
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* CTA Section - Premium Gold */}
      <section className="relative py-24 bg-gradient-to-br from-royal-900 via-gray-900 to-royal-900 overflow-hidden">
        {/* Animated premium background elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-96 h-96 bg-primary-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-royal-600/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
        </div>
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}></div>
        </div>
        
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-primary-500/30 to-primary-600/30 backdrop-blur-sm px-5 py-2.5 rounded-full mb-8 border border-primary-400/40 shadow-2xl shadow-primary-500/20">
            <Sparkles className="w-4 h-4 text-primary-300" />
            <span className="text-sm font-black bg-gradient-to-r from-primary-200 to-white bg-clip-text text-transparent">
              SISTEMA OFICIAL HOMOLOGADO
            </span>
          </div>
          
          <h2 className="text-4xl sm:text-6xl font-black text-white mb-6 leading-tight">
            Acompanhe a <span className="bg-gradient-to-r from-primary-300 via-primary-200 to-primary-300 bg-clip-text text-transparent">Elite</span> do Beach Tennis
          </h2>
          <p className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed font-medium">
            Rankings oficiais atualizados em tempo real. Torneios homologados. Sistema profissional de pontuação.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link 
              href="/rankings"
              className="group relative bg-gradient-to-r from-primary-500 to-primary-600 text-gray-900 px-12 py-5 rounded-xl font-black text-lg hover:from-primary-400 hover:to-primary-500 transition-all duration-300 inline-flex items-center justify-center gap-3 shadow-2xl shadow-primary-500/50 hover:shadow-primary-400/60 hover:scale-110 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/30 to-white/0 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700"></div>
              <Trophy className="w-6 h-6 relative z-10" />
              <span className="relative z-10">Ver Rankings</span>
              <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform relative z-10" />
            </Link>
            <Link 
              href="#torneios"
              className="bg-white/10 backdrop-blur-sm text-white px-12 py-5 rounded-xl font-black text-lg hover:bg-white/20 transition-all duration-300 border-2 border-white/30 shadow-2xl hover:scale-105"
            >
              Próximos Torneios
            </Link>
          </div>
          
          {/* Premium Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              { icon: Trophy, text: 'Sistema Oficial Homologado' },
              { icon: TrendingUp, text: 'Rankings em Tempo Real' },
              { icon: Calendar, text: 'Calendário de Torneios' },
            ].map((feature, index) => (
              <div 
                key={index} 
                className="flex items-center gap-3 text-white/90 justify-center bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 hover:bg-white/10 transition-all hover:scale-105"
              >
                <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg">
                  <feature.icon className="w-5 h-5 text-white" />
                </div>
                <span className="font-bold">{feature.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}