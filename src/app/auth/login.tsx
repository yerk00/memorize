import { AppScreen } from '@/components/common/AppScreen';
import { signInWithGoogle } from '@/features/auth/auth.service';
import { colors } from '@/theme/colors';
import { radius } from '@/theme/radius';
import { Stack } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

export default function LoginScreen() {
  const [loading, setLoading] = useState(false);
  const [errorText, setErrorText] = useState('');

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      setErrorText('');
      await signInWithGoogle();
    } catch (error) {
      setErrorText(
        error instanceof Error
          ? error.message
          : 'No se pudo iniciar sesión con Google.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />

      <AppScreen scrollable={false} contentStyle={styles.container}>
        <View style={styles.card}>
          <View style={styles.hero}>
            <Image
              source={require('../../../assets/images/splash-screen.png')}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>

          <View style={styles.content}>
            <Text style={styles.title}>Bienvenido a Scriptura</Text>
            <Text style={styles.subtitle}>
              Memoriza, estudia y repasa tus textos de forma simple y ordenada.
            </Text>
            <Text style={styles.subtitle}>
              dev: yerk00 (⌐■_■)ノ
            </Text>

            <Pressable
              style={({ pressed }) => [
                styles.googleButton,
                loading && styles.disabled,
                pressed && !loading && styles.googleButtonPressed,
              ]}
              disabled={loading}
              onPress={handleGoogleLogin}
            >
              {loading ? (
                <ActivityIndicator color={colors.white} />
              ) : (
                <>
                  <View style={styles.googleBadge}>
                    <Text style={styles.googleBadgeText}>G</Text>
                  </View>
                  <Text style={styles.googleButtonText}>
                    Continuar con Google
                  </Text>
                </>
              )}
            </Pressable>

            {errorText ? <Text style={styles.errorText}>{errorText}</Text> : null}
          </View>
        </View>
      </AppScreen>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#EED0B6',
    paddingVertical: 24,
  },
  card: {
    flex: 1,
    maxHeight: 720,
    backgroundColor: '#F8F6F3',
    borderRadius: 38,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.04)',
  },
  hero: {
    flex: 1.15,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingTop: 28,
    paddingBottom: 12,
    backgroundColor: '#F8F6F3',
  },
  logo: {
    width: 230,
    height: 230,
  },
  content: {
    flex: 0.85,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 28,
    paddingBottom: 34,
    paddingTop: 8,
  },
  title: {
    fontSize: 34,
    lineHeight: 40,
    fontWeight: '800',
    color: colors.coral,
    textAlign: 'center',
    marginBottom: 14,
  },
  subtitle: {
    fontSize: 15,
    lineHeight: 23,
    color: colors.textSoft,
    textAlign: 'center',
    marginBottom: 28,
    maxWidth: 290,
  },
  googleButton: {
    minHeight: 56,
    minWidth: 250,
    backgroundColor: colors.coral,
    borderRadius: radius.xl,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 5,
  },
  googleButtonPressed: {
    transform: [{ scale: 0.985 }],
    opacity: 0.96,
  },
  googleBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  googleBadgeText: {
    fontSize: 14,
    fontWeight: '900',
    color: colors.coral,
  },
  googleButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '800',
  },
  errorText: {
    marginTop: 16,
    color: colors.danger,
    fontSize: 13,
    lineHeight: 18,
    textAlign: 'center',
  },
  disabled: {
    opacity: 0.7,
  },
});