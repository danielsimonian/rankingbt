import Link from 'next/link';
import Image from 'next/image';
import FormularioApoiador from '@/components/FormularioApoiador';
import { 
  Heart, Trophy, MapPin, Phone, Instagram, Globe, 
  MessageCircle, Mail, Users, Award, Sparkles, Target,
  ExternalLink
} from 'lucide-react';

// Dados hard-coded - fácil de editar depois
const professores = [
  {
    id: '1',
    nome: 'Professor Tales',
    foto: '/profs/avatar-thales.png',
    cidade: 'Santos',
    telefone: '(11) 98717-3766',
    whatsapp: '5511987173766',
    instagram: '@talesqueralt',
    especialidade: 'Iniciantes e Intermediários',
  },
  {
    id: '2',
    nome: 'Professor Rodrigo',
    foto: '/profs/avatar-digao.png',
    cidade: 'Guarujá',
    telefone: '(13) 97412-2195',
    whatsapp: '5513974122195',
    instagram: '@forehand_beach_tennis',
    especialidade: 'Iniciantes ao Avançados',
  },
  {
    id: '3',
    nome: 'Professora Mel',
    foto: '/profs/avatar-mel.png',
    cidade: 'São Vicente',
    telefone: '(13) 98179-2982',
    whatsapp: '5513981792982',
    instagram: '@mel_beach_tennis',
    especialidade: 'Iniciantes e Intermediários',
  },
];

const points = [
  {
    id: '1',
    nome: 'ASSESP - O Point do Jajá',
    logo: '/points/logo-assesp.jpeg',
    endereco: 'Avenida Vicente de Carvalho, 74',
    cidade: 'Santos',
    telefone: '(13) 99176-0203',
    whatsapp: '5513991760203',
    instagram: '@pointdogonzagabt',
    site: 'https://letzplay.me/assespgonzaga',
  },
  {
    id: '2',
    nome: 'Point Mel Beach Tennis',
    logo: '/points/logo-mel.webp',
    endereco: 'Avenida Manoel da Nóbrega (em frente ao nº 332',
    cidade: 'São Vicente',
    telefone: '(13) 98179-2982',
    whatsapp: '5513981792982',
    instagram: '@mel_beach_tennis',
    site: 'https://letzplay.me/pointmel',
  },
  {
    id: '3',
    nome: 'Complexo Beach PG',
    logo: 'https://api.dicebear.com/7.x/shapes/svg?seed=Complexo&backgroundColor=10b981',
    endereco: 'Av. dos Esportes, 789',
    cidade: 'Praia Grande',
    telefone: '(13) 3111-1111',
    whatsapp: '5513311111111',
    instagram: '@complexobeach',
    site: 'https://complexobeach.com.br',
  },
];

export default function ApoiadoresPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-600 via-primary-500 to-royal-600 text-white overflow-hidden py-20">
        {/* Animated background */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
        </div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-5 py-2.5 rounded-full mb-6 border border-white/30">
            <Heart className="w-4 h-4" />
            <span className="text-sm font-bold">Comunidade Unida</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black mb-6 leading-tight">
            Apoiadores do
            <span className="pb-2 block bg-gradient-to-r from-yellow-300 via-yellow-200 to-yellow-300 bg-clip-text text-transparent mt-2">
              Ranking Oficial
            </span>
          </h1>

          <p className="text-xl sm:text-2xl text-primary-100 mb-4 max-w-3xl mx-auto leading-relaxed">
            A força do Beach Tennis da Baixada Santista está nos profissionais
            que dedicam suas vidas ao esporte.
          </p>
          
          <p className="text-lg text-primary-200 max-w-2xl mx-auto">
            Conheça os professores e points que acreditam e apoiam o sistema oficial de rankings da região.
          </p>
        </div>

        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg className="w-full h-auto" viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="#F9FAFB"/>
          </svg>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 -mt-1">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-6 text-center hover:shadow-xl transition-shadow">
              <div className="w-14 h-14 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Users className="w-7 h-7 text-white" />
              </div>
              <div className="text-4xl font-black text-gray-900 mb-2">{professores.length}</div>
              <div className="text-gray-600 font-bold">Professores Parceiros</div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-6 text-center hover:shadow-xl transition-shadow">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-7 h-7 text-white" />
              </div>
              <div className="text-4xl font-black text-gray-900 mb-2">{points.length}</div>
              <div className="text-gray-600 font-bold">Points Oficiais</div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-6 text-center hover:shadow-xl transition-shadow">
              <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Trophy className="w-7 h-7 text-white" />
              </div>
              <div className="text-4xl font-black text-gray-900 mb-2">100%</div>
              <div className="text-gray-600 font-bold">Comprometimento</div>
            </div>
          </div>
        </div>
      </section>

      {/* Professores Section */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-primary-100 to-royal-100 px-5 py-2.5 rounded-full mb-4 border-2 border-primary-200/50">
              <Award className="w-4 h-4 text-primary-600" />
              <span className="text-sm font-bold text-primary-900">Profissionais Homologados</span>
            </div>
            <h2 className="text-4xl font-black text-gray-900 mb-4">
              Professores Parceiros
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Profissionais qualificados que apoiam e utilizam o ranking oficial em suas aulas
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {professores.map((prof) => (
              <div
                key={prof.id}
                className="group bg-white rounded-2xl shadow-lg border-2 border-gray-100 overflow-hidden hover:shadow-2xl hover:border-primary-200 transition-all duration-300 hover:scale-105"
              >
                {/* Header com gradiente */}
                <div className="h-32 bg-gradient-to-br from-primary-500 to-primary-600 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                  <div className="absolute top-4 right-4">
                    <div className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                      <span className="text-white text-xs font-bold">✓ Homologado</span>
                    </div>
                  </div>
                </div>

                {/* Avatar sobreposto */}
                <div className="relative -mt-16 mb-4">
                  <div className="w-28 h-28 mx-auto rounded-full border-4 border-white shadow-xl overflow-hidden bg-gray-100">
                    <Image 
                      src={prof.foto} 
                      alt={prof.nome}
                      width={112}
                      height={112}
                      unoptimized
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                {/* Conteúdo */}
                <div className="px-6 pb-6 text-center">
                  <h3 className="text-xl font-black text-gray-900 mb-1">{prof.nome}</h3>
                  <p className="text-sm text-primary-600 font-bold mb-4">{prof.especialidade}</p>

                  {/* Info */}
                  <div className="space-y-2 mb-6 text-sm">
                    <div className="flex items-center justify-center gap-2 text-gray-600">
                      <MapPin className="w-4 h-4 flex-shrink-0" />
                      <span>{prof.cidade}</span>
                    </div>
                    <div className="flex items-center justify-center gap-2 text-gray-600">
                      <Phone className="w-4 h-4 flex-shrink-0" />
                      <span>{prof.telefone}</span>
                    </div>
                    <div className="flex items-center justify-center gap-2 text-gray-600">
                      <Instagram className="w-4 h-4 flex-shrink-0" />
                      <span>{prof.instagram}</span>
                    </div>
                  </div>

                  {/* Botões de Contato */}
                  <div className="flex gap-2">
                    <a
                      href={`https://wa.me/${prof.whatsapp}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2.5 rounded-lg transition-colors font-bold text-sm"
                    >
                      <MessageCircle className="w-4 h-4" />
                      WhatsApp
                    </a>
                    <a
                      href={`https://instagram.com/${prof.instagram.replace('@', '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-4 py-2.5 rounded-lg transition-colors font-bold text-sm"
                    >
                      <Instagram className="w-4 h-4" />
                      Instagram
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Points Section */}
      <section className="py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-100 to-cyan-100 px-5 py-2.5 rounded-full mb-4 border-2 border-blue-200/50">
              <Target className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-bold text-blue-900">Locais Credenciados</span>
            </div>
            <h2 className="text-4xl font-black text-gray-900 mb-4">
              Points Oficiais
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Espaços homologados para realização de torneios oficiais do ranking
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {points.map((point) => (
              <div
                key={point.id}
                className="group bg-white rounded-2xl shadow-lg border-2 border-gray-100 overflow-hidden hover:shadow-2xl hover:border-blue-200 transition-all duration-300"
              >
                {/* Logo Section */}
                <div className="p-8 bg-gradient-to-br from-gray-50 to-white border-b-2 border-gray-100">
                  <div className="w-32 h-32 mx-auto rounded-2xl bg-white border-2 border-gray-200 shadow-lg overflow-hidden group-hover:scale-110 transition-transform duration-300">
                    <Image 
                      src={point.logo} 
                      alt={point.nome}
                      width={128}
                      height={128}
                      unoptimized
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="mt-4 text-center">
                    <div className="inline-flex items-center gap-1 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold">
                      <Award className="w-3 h-3" />
                      Point Oficial
                    </div>
                  </div>
                </div>

                {/* Conteúdo */}
                <div className="p-6">
                  <h3 className="text-xl font-black text-gray-900 mb-4 text-center">{point.nome}</h3>

                  {/* Info */}
                  <div className="space-y-3 mb-6 text-sm">
                    <div className="flex items-start gap-2 text-gray-600">
                      <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5 text-primary-600" />
                      <div>
                        <div className="font-semibold">{point.endereco}</div>
                        <div className="text-xs">{point.cidade}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Phone className="w-4 h-4 flex-shrink-0 text-green-600" />
                      <span className="font-semibold">{point.telefone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Instagram className="w-4 h-4 flex-shrink-0 text-pink-600" />
                      <span className="font-semibold">{point.instagram}</span>
                    </div>
                  </div>

                  {/* Botões de Contato */}
                  <div className="grid grid-cols-2 gap-2">
                    <a
                      href={`https://wa.me/${point.whatsapp}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-1.5 bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded-lg transition-colors font-bold text-sm"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span className="hidden sm:inline">WhatsApp</span>
                    </a>
                    {point.site && (
                      <a
                        href={point.site}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-1.5 bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-lg transition-colors font-bold text-sm"
                      >
                        <Globe className="w-4 h-4" />
                        <span className="hidden sm:inline">Site</span>
                      </a>
                    )}
                    <a
                      href={`https://instagram.com/${point.instagram.replace('@', '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-1.5 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-3 py-2 rounded-lg transition-colors font-bold text-sm"
                    >
                      <Instagram className="w-4 h-4" />
                      <span className="hidden sm:inline">Instagram</span>
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-primary-600 via-primary-500 to-royal-600 text-white relative overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
        </div>

        <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-5 py-2.5 rounded-full mb-6 border border-white/30">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-bold">Junte-se à Família</span>
          </div>

          <h2 className="text-4xl sm:text-5xl font-black mb-6 leading-tight">
            Faça Parte Dessa
            <span className="block bg-gradient-to-r from-yellow-300 via-yellow-200 to-yellow-300 bg-clip-text text-transparent mt-2">
              Revolução
            </span>
          </h2>

          <p className="text-xl text-primary-100 mb-8 leading-relaxed">
            Você é <strong>professor de Beach Tennis</strong> ou administra um <strong>point na Baixada Santista</strong> e acredita no potencial do ranking oficial?
          </p>

          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 mb-10 border border-white/20">
            <h3 className="text-2xl font-bold mb-4">Benefícios de ser Apoiador:</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold">✓</span>
                </div>
                <div>
                  <div className="font-bold mb-1">Destaque no Site</div>
                  <div className="text-sm text-primary-100">Seu perfil em destaque para milhares de atletas</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold">✓</span>
                </div>
                <div>
                  <div className="font-bold mb-1">Badge Oficial</div>
                  <div className="text-sm text-primary-100">Selo de &quot;Professor/Point Homologado&quot;</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold">✓</span>
                </div>
                <div>
                  <div className="font-bold mb-1">Ferramentas Exclusivas</div>
                  <div className="text-sm text-primary-100">Acesso a recursos para organização de torneios</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold">✓</span>
                </div>
                <div>
                  <div className="font-bold mb-1">Rede de Contatos</div>
                  <div className="text-sm text-primary-100">Conexão com outros profissionais da região</div>
                </div>
              </div>
            </div>
          </div>

          <div className="max-w-3xl mx-auto">
            <FormularioApoiador />
          </div>

          {/* WhatsApp alternativo */}
          <div className="mt-8 text-center">
            <p className="text-primary-100 mb-4">Prefere WhatsApp?</p>
            <a
              href="https://wa.me/5513997434878?text=Olá!%20Gostaria%20de%20ser%20um%20apoiador%20do%20Ranking%20BT"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-3 bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all shadow-xl hover:shadow-green-500/50 hover:scale-105"
            >
              <MessageCircle className="w-5 h-5" />
              Falar no WhatsApp
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>

      {/* Link para Rankings */}
      <section className="py-12 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <Link
            href="/rankings"
            className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-bold text-lg group"
          >
            <Trophy className="w-5 h-5" />
            Ver Rankings Oficiais
            <ExternalLink className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>
    </div>
  );
}