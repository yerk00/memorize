import { supabase } from '@/lib/supabase';
import { Session } from '@supabase/supabase-js';
import { makeRedirectUri } from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';

WebBrowser.maybeCompleteAuthSession();

const getRedirectTo = () => makeRedirectUri({ scheme: 'memoriza', path: 'auth/callback' });

const getHashParams = (hash: string) => {
  const trimmed = hash.startsWith('#') ? hash.slice(1) : hash;
  return new URLSearchParams(trimmed);
};

export async function getSession(): Promise<Session | null> {
  const { data } = await supabase.auth.getSession();
  return data.session ?? null;
}

export async function signOut() {
  await supabase.auth.signOut();
}

export async function createSessionFromUrl(url: string) {
  const parsedUrl = new URL(url);

  const code = parsedUrl.searchParams.get('code');
  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) throw error;
    return;
  }

  const hashParams = getHashParams(parsedUrl.hash);
  const access_token = hashParams.get('access_token');
  const refresh_token = hashParams.get('refresh_token');

  if (access_token && refresh_token) {
    const { error } = await supabase.auth.setSession({
      access_token,
      refresh_token,
    });

    if (error) throw error;
    return;
  }

  throw new Error('No se pudo crear la sesión desde la URL de retorno.');
}

export async function signInWithGoogle() {
  const redirectTo = getRedirectTo();

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo,
      skipBrowserRedirect: true,
    },
  });

  if (error) throw error;
  if (!data?.url) {
    throw new Error('No se pudo iniciar Google Sign-In.');
  }

  const result = await WebBrowser.openAuthSessionAsync(data.url, redirectTo);

  if (result.type === 'success' && result.url) {
    await createSessionFromUrl(result.url);
    return;
  }

  if (result.type === 'cancel') {
    throw new Error('El inicio de sesión fue cancelado.');
  }

  throw new Error('No se pudo completar el inicio de sesión.');
}