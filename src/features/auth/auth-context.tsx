import { Session } from '@supabase/supabase-js';
import { createContext, PropsWithChildren, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import { supabase } from '@/lib/supabase';
import { AppProfile } from './auth.types';
import { buildProfileFallback, ensureMyProfile, getMyProfile } from './profile.service';

type AuthContextValue = {
  booting: boolean;
  session: Session | null;
  profile: AppProfile | null;
  refreshProfile: () => Promise<AppProfile | null>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: PropsWithChildren) {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<AppProfile | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [profileReady, setProfileReady] = useState(false);

  useEffect(() => {
    let mounted = true;

    const bootstrap = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        if (!mounted) return;
        setSession(data.session ?? null);
      } finally {
        if (mounted) {
          setAuthReady(true);
        }
      }
    };

    void bootstrap();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      if (!mounted) return;
      setSession(nextSession);
      setAuthReady(true);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const refreshProfile = useCallback(async () => {
    if (!session?.user) {
      setProfile(null);
      return null;
    }

    try {
      const nextProfile = await getMyProfile(session.user.id);
      const resolvedProfile = nextProfile ?? buildProfileFallback(session.user);
      setProfile(resolvedProfile);
      return resolvedProfile;
    } catch {
      const fallback = buildProfileFallback(session.user);
      setProfile(fallback);
      return fallback;
    }
  }, [session]);

  useEffect(() => {
    let mounted = true;

    const syncProfile = async () => {
      if (!authReady) return;

      setProfileReady(false);

      if (!session?.user) {
        if (!mounted) return;
        setProfile(null);
        setProfileReady(true);
        return;
      }

      try {
        const nextProfile = await ensureMyProfile(session.user);
        if (!mounted) return;
        setProfile(nextProfile ?? buildProfileFallback(session.user));
      } catch {
        if (!mounted) return;
        setProfile(buildProfileFallback(session.user));
      } finally {
        if (mounted) {
          setProfileReady(true);
        }
      }
    };

    void syncProfile();

    return () => {
      mounted = false;
    };
  }, [authReady, session?.user?.id]);

  const value = useMemo<AuthContextValue>(
    () => ({
      booting: !authReady || !profileReady,
      session,
      profile,
      refreshProfile,
    }),
    [authReady, profile, profileReady, refreshProfile, session]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider.');
  }

  return context;
}
