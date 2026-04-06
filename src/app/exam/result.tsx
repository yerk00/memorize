import { Stack, router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { AppScreen } from '@/components/common/AppScreen';
import { ScreenNavHeader } from '@/components/common/ScreenNavHeader';
import { colors } from '@/theme/colors';
import { radius } from '@/theme/radius';
import { clearExamRuntime, getExamResult } from '@/features/exam/runtime';

export default function ExamResultScreen() {
  const result = getExamResult();

  if (!result) {
    return (
      <AppScreen>
        <Text style={styles.fallbackTitle}>No hay resultado disponible.</Text>
        <Pressable style={styles.primaryButton} onPress={() => router.replace('/exam')}>
          <Text style={styles.primaryButtonText}>Ir al examen</Text>
        </Pressable>
      </AppScreen>
    );
  }

  const handleRestart = () => {
    clearExamRuntime();
    router.replace('/exam');
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />

      <AppScreen>
        <ScreenNavHeader title="Resultado del examen" subtitle="Resumen final de tu evaluación integral" />

        <View style={styles.hero}>
          <Text style={styles.eyebrow}>Resultado final</Text>
          <Text style={styles.percent}>{result.percent}%</Text>
          <Text style={styles.subtitle}>Dominio en el examen general</Text>
        </View>

        <View style={styles.summaryRow}>
          <View style={styles.metricCard}>
            <Text style={styles.metricValue}>{result.correct}</Text>
            <Text style={styles.metricLabel}>Correctas</Text>
          </View>

          <View style={styles.metricCard}>
            <Text style={styles.metricValue}>{result.wrong}</Text>
            <Text style={styles.metricLabel}>Incorrectas</Text>
          </View>

          <View style={styles.metricCard}>
            <Text style={styles.metricValue}>{result.total}</Text>
            <Text style={styles.metricLabel}>Total</Text>
          </View>
        </View>

        <View style={styles.block}>
          <Text style={styles.blockTitle}>Resultado por campo</Text>

          {Object.entries(result.byField).map(([field, value]) => (
            <View key={field} style={styles.fieldRow}>
              <View>
                <Text style={styles.fieldTitle}>
                  {field === 'classification'
                    ? 'Clasificación'
                    : field === 'name'
                    ? 'Nombre'
                    : field === 'chapters'
                    ? 'Capítulos'
                    : 'Cómo se presenta'}
                </Text>
                <Text style={styles.fieldSubtitle}>
                  {value.correct}/{value.total} correctas
                </Text>
              </View>

              <Text style={styles.fieldPercent}>{value.percent}%</Text>
            </View>
          ))}
        </View>

        <View style={styles.actions}>
          <Pressable style={styles.secondaryButton} onPress={handleRestart}>
            <Text style={styles.secondaryButtonText}>Nuevo examen</Text>
          </Pressable>

          <Pressable
            style={styles.primaryButton}
            onPress={() => {
              clearExamRuntime();
              router.replace('/');
            }}
          >
            <Text style={styles.primaryButtonText}>Salir</Text>
          </Pressable>
        </View>
      </AppScreen>
    </>
  );
}

const styles = StyleSheet.create({
  fallbackTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 16,
  },
  hero: {
    backgroundColor: colors.coralSoft,
    borderRadius: radius.xl,
    padding: 20,
    marginBottom: 16,
  },
  eyebrow: {
    color: colors.textSoft,
    fontSize: 12,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginBottom: 8,
  },
  percent: {
    color: colors.text,
    fontSize: 44,
    fontWeight: '800',
    marginBottom: 4,
  },
  subtitle: {
    color: colors.textSoft,
    fontSize: 14,
  },
  summaryRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  metricCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  metricValue: {
    color: colors.text,
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 4,
  },
  metricLabel: {
    color: colors.textSoft,
    fontSize: 12,
    fontWeight: '700',
  },
  block: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: 18,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 16,
  },
  blockTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 12,
  },
  fieldRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  fieldTitle: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '800',
    marginBottom: 4,
  },
  fieldSubtitle: {
    color: colors.textSoft,
    fontSize: 12,
  },
  fieldPercent: {
    color: colors.coralDark,
    fontSize: 16,
    fontWeight: '800',
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: 15,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '800',
  },
  primaryButton: {
    flex: 1,
    backgroundColor: colors.coral,
    borderRadius: radius.pill,
    paddingVertical: 15,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: colors.white,
    fontSize: 15,
    fontWeight: '800',
  },
});
