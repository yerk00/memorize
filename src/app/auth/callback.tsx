import { createSessionFromUrl } from '@/features/auth/auth.service';
import { colors } from '@/theme/colors';
import * as Linking from 'expo-linking';
import { Stack, router } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

export default function AuthCallbackScreen() {
  const [errorText, setErrorText] = useState('');

  useEffect(() => {
    let mounted = true;

    const handleCallback = async () => {
      try {
        const initialUrl = await Linking.getInitialURL();

        if (initialUrl) {
          await createSessionFromUrl(initialUrl);
        }

        if (mounted) {
          router.replace('/');
        }
      } catch (error) {
        if (!mounted) return;

        setErrorText(
          error instanceof Error
            ? error.message
            : 'No se pudo completar el inicio de sesión.'
        );

        setTimeout(() => {
          router.replace('/auth/login');
        }, 1200);
      }
    };

    handleCallback();

    const subscription = Linking.addEventListener('url', async ({ url }) => {
      try {
        await createSessionFromUrl(url);
        router.replace('/');
      } catch (error) {
        setErrorText(
          error instanceof Error
            ? error.message
            : 'No se pudo completar el inicio de sesión.'
        );

        setTimeout(() => {
          router.replace('/auth/login');
        }, 1200);
      }
    });

    return () => {
      mounted = false;
      subscription.remove();
    };
  }, []);

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />

      <View style={styles.container}>
        <ActivityIndicator color={colors.coral} />
        <Text style={styles.text}>
          {errorText || 'Completando inicio de sesión...'}
        </Text>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  text: {
    marginTop: 14,
    color: colors.textSoft,
    fontSize: 14,
    textAlign: 'center',
  },
});