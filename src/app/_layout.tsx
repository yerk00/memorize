import { AppIntro } from '@/components/branding/AppIntro';
import { AuthProvider, useAuth } from '@/features/auth/auth-context';
import { Stack, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import { View } from 'react-native';

SplashScreen.preventAutoHideAsync().catch(() => {
});

function RootNavigation() {
  const router = useRouter();
  const segments = useSegments();
  const { booting, session } = useAuth();

  const [splashHidden, setSplashHidden] = useState(false);
  const [showIntro, setShowIntro] = useState(false);

  useEffect(() => {
    if (booting) return;

    const inAuth = segments[0] === 'auth';
    const inCallback = segments[0] === 'auth' && segments[1] === 'callback';

    if (inCallback) return;

    if (!session) {
      if (!inAuth) {
        router.replace('/auth/login');
      }
      return;
    }

    if (inAuth) {
      router.replace('/');
    }
  }, [booting, router, segments, session]);

  useEffect(() => {
    if (booting || splashHidden) return;

    const prepare = async () => {
      try {
        await SplashScreen.hideAsync();
      } catch {
        // no hacemos nada si ya se ocultó
      } finally {
        setSplashHidden(true);
        setShowIntro(true);
      }
    };

    prepare();
  }, [booting, splashHidden]);

  if (booting) {
    return null;
  }

  return (
    <View style={{ flex: 1 }}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="book/[id]" />
        <Stack.Screen name="classification/[key]" />
        <Stack.Screen name="study/mode" />
        <Stack.Screen name="study/flashcards" />
        <Stack.Screen name="study/quiz" />
        <Stack.Screen name="study/match" />
        <Stack.Screen name="study/fill-blank" />
        <Stack.Screen name="study/result" />
        <Stack.Screen name="exam/index" />
        <Stack.Screen name="exam/run" />
        <Stack.Screen name="exam/result" />
        <Stack.Screen name="complete-study" />
        <Stack.Screen name="auth/login" />
        <Stack.Screen name="auth/complete-profile" />
        <Stack.Screen name="auth/callback" />
      </Stack>

      {showIntro ? <AppIntro onFinish={() => setShowIntro(false)} /> : null}
    </View>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootNavigation />
    </AuthProvider>
  );
}