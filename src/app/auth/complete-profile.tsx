import { AppScreen } from '@/components/common/AppScreen';
import { colors } from '@/theme/colors';
import { radius } from '@/theme/radius';
import { Stack, router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

export default function CompleteProfileScreen() {
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />

      <AppScreen scrollable={false} contentStyle={styles.container}>
        <View style={styles.card}>
          <Text style={styles.eyebrow}>Perfil automático</Text>
          <Text style={styles.title}>Ya no necesitas completar este paso</Text>
          <Text style={styles.subtitle}>
            La app ahora genera tu nickname a partir de tu correo de Google y te lleva directo al inicio.
            Puedes cambiarlo luego en Ajustes.
          </Text>
        </View>

        <Pressable style={styles.button} onPress={() => router.replace('/')}>
          <Text style={styles.buttonText}>Ir al inicio</Text>
        </Pressable>
      </AppScreen>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 18,
  },
  eyebrow: {
    color: colors.coral,
    fontSize: 12,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginBottom: 8,
  },
  title: {
    color: colors.text,
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 8,
  },
  subtitle: {
    color: colors.textSoft,
    fontSize: 14,
    lineHeight: 21,
  },
  button: {
    backgroundColor: colors.coral,
    borderRadius: radius.pill,
    paddingVertical: 15,
    alignItems: 'center',
  },
  buttonText: {
    color: colors.white,
    fontSize: 15,
    fontWeight: '800',
  },
});
