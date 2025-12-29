import { supabase } from './supabase';

export async function signIn(email: string, password: string) {
  console.log('🔐 Tentando login com:', email);
  
  try {
    // 1. Login no Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      console.error('❌ Erro no login Supabase:', authError);
      throw authError;
    }

    console.log('✅ Login no Supabase OK, user_id:', authData.user?.id);

    // 2. Verificar se é admin
    const { data: adminData, error: adminError } = await supabase
      .from('admins')
      .select('*')
      .eq('user_id', authData.user?.id)
      .eq('ativo', true)
      .single();

    console.log('📊 Verificando admin...');
    console.log('Admin data:', adminData);
    console.log('Admin error:', adminError);

    if (adminError || !adminData) {
      console.error('❌ Usuário não é admin');
      throw new Error('Acesso negado. Apenas administradores podem acessar.');
    }

    console.log('✅ Admin autorizado:', email);

    // 3. ⚡ SALVAR NO LOCALSTORAGE ⚡
    localStorage.setItem('isAdmin', 'true');
    localStorage.setItem('adminEmail', email);
    localStorage.setItem('adminNome', adminData.nome);
    console.log('💾 Salvou no localStorage:', localStorage.getItem('isAdmin'));

    return { success: true, user: authData.user };
  } catch (error: any) {
    console.error('❌ Erro completo:', error);
    throw error;
  }
}

export async function signOut() {
  console.log('🚪 Fazendo logout...');
  
  // 1. Logout do Supabase
  await supabase.auth.signOut();
  
  // 2. Limpar localStorage
  localStorage.removeItem('isAdmin');
  localStorage.removeItem('adminEmail');
  localStorage.removeItem('adminNome');
  
  console.log('✅ Logout completo');
}

// Aliases para compatibilidade
export const login = signIn;
export const logout = signOut;

export async function verificarAdmin() {
  try {
    // 1. Verificar localStorage primeiro (mais rápido)
    const isAdminLocal = localStorage.getItem('isAdmin') === 'true';
    if (!isAdminLocal) {
      console.log('❌ Não está marcado como admin no localStorage');
      return { isAdmin: false };
    }

    // 2. Verificar sessão no Supabase
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      console.log('❌ Sem sessão ativa no Supabase');
      localStorage.removeItem('isAdmin');
      return { isAdmin: false };
    }

    // 3. Verificar se ainda é admin no banco
    const { data: adminData, error } = await supabase
      .from('admins')
      .select('*')
      .eq('user_id', user.id)
      .eq('ativo', true)
      .single();

    if (error || !adminData) {
      console.log('❌ Não é mais admin no banco');
      localStorage.removeItem('isAdmin');
      return { isAdmin: false };
    }

    console.log('✅ Admin verificado:', adminData.email);
    return { isAdmin: true, admin: adminData };
  } catch (error) {
    console.error('❌ Erro ao verificar admin:', error);
    localStorage.removeItem('isAdmin');
    return { isAdmin: false };
  }
}