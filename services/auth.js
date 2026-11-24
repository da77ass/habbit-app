import { supabase } from './supabase';

// Cria uma conta no Supabase Auth.
export async function cadastrarUsuario(email, senha) {
  const { data, error } = await supabase.auth.signUp({
    email: email.trim().toLowerCase(),
    password: senha,
  });

  if (error) throw error;
  return data;
}

// Autentica um usuário existente.
export async function entrarUsuario(email, senha) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email.trim().toLowerCase(),
    password: senha,
  });

  if (error) throw error;
  return data;
}

// Encerra a sessão atual.
export async function sairUsuario() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}
