import { supabase } from './supabase';

/**
 * Fazer login
 */
export async function login(email: string, password: string) {
  console.log('🔐 Tentando login com:', email);
  
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.error('❌ Erro no login do Supabase:', error);
    return { success: false, error: error.message };
  }

  console.log('✅ Login no Supabase OK, user_id:', data.user?.id);

  // Verificar se é admin
  const { data: adminData, error: adminError } = await supabase
    .from('admins')
    .select('*')
    .eq('user_id', data.user.id)
    .eq('ativo', true)
    .single();

  console.log('📊 Verificando admin...');
  console.log('Admin data:', adminData);
  console.log('Admin error:', adminError);

  if (adminError || !adminData) {
    console.error('❌ Não é admin ou não está ativo');
    // Fazer logout se não for admin
    await supabase.auth.signOut();
    return { success: false, error: 'Usuário não autorizado' };
  }

  console.log('✅ Admin autorizado:', adminData.email);
  return { success: true, user: data.user, admin: adminData };
}

/**
 * Fazer logout
 */
export async function logout() {
  const { error } = await supabase.auth.signOut();
  if (error) {
    return { success: false, error: error.message };
  }
  return { success: true };
}

/**
 * Verificar se está logado e é admin
 */
export async function verificarAdmin() {
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    return { isAdmin: false, user: null };
  }

  // Verificar se é admin ativo
  const { data: adminData, error: adminError } = await supabase
    .from('admins')
    .select('*')
    .eq('user_id', user.id)
    .eq('ativo', true)
    .single();

  if (adminError || !adminData) {
    return { isAdmin: false, user: null };
  }

  return { isAdmin: true, user, admin: adminData };
}

/**
 * Pegar sessão atual
 */
export async function getSession() {
  const { data: { session } } = await supabase.auth.getSession();
  return session;
}