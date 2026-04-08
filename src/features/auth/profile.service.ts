import { supabase } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';
import { AppProfile } from './auth.types';

const MAX_NICKNAME_LENGTH = 24;

const extractFullName = (user: User) =>
  user.user_metadata?.full_name ??
  user.user_metadata?.name ??
  user.identities?.[0]?.identity_data?.full_name ??
  null;

const extractAvatarUrl = (user: User) =>
  user.user_metadata?.avatar_url ??
  user.user_metadata?.picture ??
  user.identities?.[0]?.identity_data?.avatar_url ??
  null;

const extractEmailNicknameSeed = (user: User) => {
  const email = user.email?.trim().toLowerCase();
  if (!email) return null;

  return email.split('@')[0] ?? null;
};

function slugifyNickname(value: string) {
  const clean = value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '.')
    .replace(/[^a-z0-9_.-]/g, '')
    .replace(/\.{2,}/g, '.')
    .replace(/^[._-]+|[._-]+$/g, '');

  return clean.slice(0, MAX_NICKNAME_LENGTH);
}

function getBaseNickname(user: User) {
  const emailSeed = extractEmailNicknameSeed(user);
  const fullNameSeed = extractFullName(user);

  const preferred = emailSeed || fullNameSeed || `user.${user.id.slice(0, 6)}`;
  const slug = slugifyNickname(preferred);

  return slug || `user.${user.id.slice(0, 6)}`;
}

async function nicknameExists(nickname: string, userId: string) {
  const { data, error } = await supabase
    .from('profiles')
    .select('id')
    .eq('nickname', nickname)
    .neq('id', userId)
    .limit(1);

  if (error) throw error;
  return Boolean(data?.length);
}

async function resolveAvailableNickname(user: User, preferred?: string | null) {
  const base = slugifyNickname(preferred || getBaseNickname(user)) || `user.${user.id.slice(0, 6)}`;

  const candidatePool = [
    base,
    `${base}.${user.id.slice(0, 4)}`.slice(0, MAX_NICKNAME_LENGTH),
    `${base}${user.id.slice(0, 4)}`.slice(0, MAX_NICKNAME_LENGTH),
    `user.${user.id.slice(0, 8)}`.slice(0, MAX_NICKNAME_LENGTH),
  ];

  const seen = new Set<string>();

  for (const candidate of candidatePool) {
    if (!candidate || seen.has(candidate)) continue;
    seen.add(candidate);

    const exists = await nicknameExists(candidate, user.id);
    if (!exists) return candidate;
  }

  return `user.${user.id.slice(0, 8)}`.slice(0, MAX_NICKNAME_LENGTH);
}

export function buildProfileFallback(user: User): AppProfile {
  const now = new Date().toISOString();

  return {
    id: user.id,
    email: user.email ?? null,
    full_name: extractFullName(user),
    nickname: getBaseNickname(user),
    avatar_url: extractAvatarUrl(user),
    auth_provider: 'google',
    created_at: now,
    updated_at: now,
  };
}

export async function getMyProfile(userId: string): Promise<AppProfile | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) return null;
  return data as AppProfile;
}

export async function ensureMyProfile(user: User): Promise<AppProfile | null> {
  const existing = await getMyProfile(user.id);
  const nextNickname = existing?.nickname || (await resolveAvailableNickname(user));

  const payload = {
    id: user.id,
    email: user.email ?? null,
    full_name: extractFullName(user),
    nickname: nextNickname,
    avatar_url: extractAvatarUrl(user),
    auth_provider: 'google' as const,
    updated_at: new Date().toISOString(),
  };

  const { error } = await supabase.from('profiles').upsert(payload);
  if (error) throw error;

  return getMyProfile(user.id);
}

export async function updateMyNickname(userId: string, nickname: string) {
  const cleanNickname = slugifyNickname(nickname);

  if (!cleanNickname || cleanNickname.length < 3) {
    throw new Error('El nickname debe tener al menos 3 caracteres válidos.');
  }

  const { data: existing, error: existingError } = await supabase
    .from('profiles')
    .select('id')
    .eq('nickname', cleanNickname)
    .neq('id', userId)
    .limit(1);

  if (existingError) throw existingError;
  if (existing && existing.length > 0) {
    throw new Error('Ese nickname ya está en uso.');
  }

  const { error } = await supabase
    .from('profiles')
    .update({
      nickname: cleanNickname,
      updated_at: new Date().toISOString(),
    })
    .eq('id', userId);

  if (error) throw error;

  return cleanNickname;
}
