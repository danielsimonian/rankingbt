'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Trophy, Users, Calendar, AlertCircle, LogOut, 
  TrendingUp, Award, Settings, FileText, ChevronRight,
  BarChart3
} from 'lucide-react';
import { logout, verificarAdmin } from '@/lib/auth';
import { supabase } from '@/lib/supabase';
import ProtectedRoute from '@/components/admin/ProtectedRoute';

interface DashboardStats {
  totalJogadores: number;
  totalTorneios: number;
  solicitacoesPendentes: number;
  jogadoresPorCategoria: {
    A: number;
    B: number;
    C: number;
    D: number;
    FUN: number;
  };
}

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({
    totalJogadores: 0,
    totalTorneios: 0,
    solicitacoesPendentes: 0,
    jogadoresPorCategoria: { A: 0, B: 0, C: 0, D: 0, FUN: 0 },
  });
  const [adminNome, setAdminNome] = useState('Administrador');
  const router = useRouter();

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      // Verificar admin
      const { isAdmin, admin } = await verificarAdmin();
      if (!isAdmin) {
        router.push('/admin/login');
        return;
      }
      
      if (admin) {
        setAdminNome(admin.nome || 'Administrador');
      }

      // Buscar estatísticas
      const [jogadores, torneios, solicitacoes] = await Promise.all([
        supabase.from('jogadores').select('categoria', { count: 'exact' }),
        supabase.from('torneios').select('*', { count: 'exact' }),
        supabase.from('solicitacoes_mudanca_categoria').select('*', { count: 'exact' }).eq('status', 'pendente'),
      ]);

      // Contar jogadores por categoria
      const porCategoria = { A: 0, B: 0, C: 0, D: 0, FUN: 0 };
      jogadores.data?.forEach((j) => {
        if (j.categoria in porCategoria) {
          porCategoria[j.categoria as keyof typeof porCategoria]++;
        }
      });

      setStats({
        totalJogadores: jogadores.count || 0,
        totalTorneios: torneios.count || 0,
        solicitacoesPendentes: solicitacoes.count || 0,
        jogadoresPorCategoria: porCategoria,
      });

      setLoading(false);
    } catch (error) {
      console.error('Erro ao carregar dashboard:', error);
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    router.push('/admin/login');
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Carregando dashboard...</p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  const menuItems = [
    { icon: Users, label: 'Jogadores', href: '/admin/jogadores', color: 'blue' },
    { icon: AlertCircle, label: 'Solicitações', href: '/admin/solicitacoes', badge: stats.solicitacoesPendentes, color: 'orange' },
    { icon: Trophy, label: 'Torneios', href: '/admin/torneios', color: 'yellow' },
    { icon: FileText, label: 'Resultados', href: '/admin/resultados', color: 'green' },
    { icon: Settings, label: 'Configurações', href: '/admin/configuracoes', color: 'purple' },
  ];

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
                  <Trophy className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Painel Administrativo</h1>
                  <p className="text-xs text-gray-500">Ranking BT - Baixada Santista</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-medium text-gray-900">{adminNome}</p>
                  <p className="text-xs text-gray-500">Administrador</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:inline">Sair</span>
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Welcome */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Bem-vindo, {adminNome}! 👋
            </h2>
            <p className="text-gray-600">
              Aqui está um resumo do sistema de ranking
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Total Jogadores */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <TrendingUp className="w-5 h-5 text-green-500" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">{stats.totalJogadores}</h3>
              <p className="text-sm text-gray-600">Jogadores Ativos</p>
            </div>

            {/* Total Torneios */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <Trophy className="w-6 h-6 text-yellow-600" />
                </div>
                <Calendar className="w-5 h-5 text-gray-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">{stats.totalTorneios}</h3>
              <p className="text-sm text-gray-600">Torneios Cadastrados</p>
            </div>

            {/* Solicitações Pendentes */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <AlertCircle className="w-6 h-6 text-orange-600" />
                </div>
                {stats.solicitacoesPendentes > 0 && (
                  <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                    {stats.solicitacoesPendentes}
                  </span>
                )}
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">{stats.solicitacoesPendentes}</h3>
              <p className="text-sm text-gray-600">Solicitações Pendentes</p>
            </div>

            {/* Categorias */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-purple-600" />
                </div>
                <Award className="w-5 h-5 text-gray-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">5</h3>
              <p className="text-sm text-gray-600">Categorias Ativas</p>
            </div>
          </div>

          {/* Jogadores por Categoria */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Distribuição por Categoria</h3>
            <div className="grid grid-cols-5 gap-4">
              {Object.entries(stats.jogadoresPorCategoria).map(([cat, count]) => (
                <div key={cat} className="text-center">
                  <div className={`text-3xl font-bold mb-1 ${
                    cat === 'A' ? 'text-red-600' :
                    cat === 'B' ? 'text-orange-600' :
                    cat === 'C' ? 'text-yellow-600' :
                    cat === 'D' ? 'text-green-600' :
                    'text-blue-600'
                  }`}>
                    {count}
                  </div>
                  <div className="text-sm text-gray-600 font-medium">Categoria {cat}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Menu de Ações */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="group bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md hover:border-primary-300 transition-all"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 bg-${item.color}-100 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform`}>
                      <item.icon className={`w-6 h-6 text-${item.color}-600`} />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 group-hover:text-primary-600 transition-colors">
                        {item.label}
                      </h3>
                      {item.badge !== undefined && item.badge > 0 && (
                        <span className="text-xs text-orange-600 font-medium">
                          {item.badge} pendente{item.badge > 1 ? 's' : ''}
                        </span>
                      )}
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-primary-600 group-hover:translate-x-1 transition-all" />
                </div>
              </Link>
            ))}
          </div>

          {/* Link para o site */}
          <div className="mt-8 text-center">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-primary-600 transition-colors"
            >
              ← Voltar para o site público
            </Link>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}