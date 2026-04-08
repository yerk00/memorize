export type AppProfile = {
  id: string;
  email: string | null;
  full_name: string | null;
  nickname: string | null;
  avatar_url: string | null;
  auth_provider: 'google';
  created_at: string;
  updated_at: string;
};