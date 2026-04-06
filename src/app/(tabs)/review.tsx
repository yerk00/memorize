import { useFocusEffect, router } from 'expo-router';
import { useCallback, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { AppHeader } from '@/components/common/AppHeader';
import { AppScreen } from '@/components/common/AppScreen';
import { getReviewOverview } from '@/features/progress/storage';
import { ReviewOverview } from '@/features/progress/types';
import { colors } from '@/theme/colors';
import { radius } from '@/theme/radius';

export default function ReviewScreen() {
  const [data, setData] = useState<ReviewOverview | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const overview = await getReviewOverview();
    setData(overview);
    setLoading(false);
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  const maxBar = Math.max(...(data?.dailyActivity.map((item) => item.sessions) ?? [1]), 1);

  return (
    <AppScreen>
      <AppHeader
        title="Estadísticas"
        subtitle="Visualiza tu avance y detecta qué necesitas reforzar."
        rightSlot={
          <Pressable style={styles.homeButton} onPress={() => router.push('/')}>
            <Text style={styles.homeButtonText}>Inicio</Text>
          </Pressable>
        }
      />

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator color={colors.coral} />
        </View>
      ) : (
        <>
          <View style={styles.hero}>
            <Text style={styles.heroEyebrow}>Dominio general</Text>
            <Text style={styles.heroValue}>{data?.averageMastery ?? 0}%</Text>
            <Text style={styles.heroText}>Promedio de dominio acumulado</Text>
          </View>

          <View style={styles.metricsRow}>
            <View style={styles.metricCard}>
              <Text style={styles.metricValue}>{data?.totalSessions ?? 0}</Text>
              <Text style={styles.metricLabel}>Sesiones</Text>
            </View>

            <View style={styles.metricCard}>
              <Text style={styles.metricValue}>{data?.studiedBooks ?? 0}</Text>
              <Text style={styles.metricLabel}>Libros estudiados</Text>
            </View>
          </View>

          <View style={styles.block}>
            <Text style={styles.blockTitle}>Actividad semanal</Text>

            <View style={styles.chartRow}>
              {data?.dailyActivity.map((item, index) => {
                const height = Math.max(12, (item.sessions / maxBar) * 120);

                return (
                  <View key={`${item.label}-${index}`} style={styles.chartItem}>
                    <View style={[styles.chartBar, { height }]} />
                    <Text style={styles.chartValue}>{item.sessions}</Text>
                    <Text style={styles.chartLabel}>{item.label}</Text>
                  </View>
                );
              })}
            </View>
          </View>

          <View style={styles.block}>
            <Text style={styles.blockTitle}>Libros por reforzar</Text>

            {data?.weakBooks.length ? (
              data.weakBooks.map((item) => (
                <View key={item.bookId} style={styles.weakRow}>
                  <View style={styles.weakTexts}>
                    <Text style={styles.weakTitle}>{item.bookName}</Text>
                    <Text style={styles.weakSubtitle}>
                      {item.completedSessions} sesiones
                    </Text>

                    <View style={styles.progressTrack}>
                      <View
                        style={[
                          styles.progressFill,
                          { width: `${item.mastery}%` },
                        ]}
                      />
                    </View>
                  </View>

                  <Text style={styles.weakPercent}>{item.mastery}%</Text>
                </View>
              ))
            ) : (
              <Text style={styles.emptyText}>Aún no hay datos para mostrar.</Text>
            )}
          </View>
        </>
      )}
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  center: {
    paddingTop: 40,
    alignItems: 'center',
  },
  homeButton: {
    minHeight: 40,
    paddingHorizontal: 14,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  homeButtonText: {
    color: colors.text,
    fontSize: 13,
    fontWeight: '700',
  },
  hero: {
    backgroundColor: colors.coralSoft,
    borderRadius: radius.xl,
    padding: 20,
    marginBottom: 16,
  },
  heroEyebrow: {
    color: colors.textSoft,
    fontSize: 12,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginBottom: 8,
  },
  heroValue: {
    color: colors.text,
    fontSize: 40,
    fontWeight: '800',
    marginBottom: 4,
  },
  heroText: {
    color: colors.textSoft,
    fontSize: 14,
  },
  metricsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  metricCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: 18,
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
  chartRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    minHeight: 170,
    gap: 10,
  },
  chartItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  chartBar: {
    width: 24,
    borderRadius: 12,
    backgroundColor: colors.coral,
    marginBottom: 8,
  },
  chartValue: {
    color: colors.text,
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 4,
  },
  chartLabel: {
    color: colors.textSoft,
    fontSize: 12,
    fontWeight: '700',
  },
  weakRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  weakTexts: {
    flex: 1,
  },
  weakTitle: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '800',
    marginBottom: 4,
  },
  weakSubtitle: {
    color: colors.textSoft,
    fontSize: 12,
    marginBottom: 8,
  },
  progressTrack: {
    height: 10,
    backgroundColor: colors.backgroundSoft,
    borderRadius: 999,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 999,
    backgroundColor: colors.coral,
  },
  weakPercent: {
    color: colors.coralDark,
    fontSize: 15,
    fontWeight: '800',
  },
  emptyText: {
    color: colors.textSoft,
    fontSize: 14,
  },
});