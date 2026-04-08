import { HeroStudyCard } from '@/components/cards/HeroStudyCard';
import { InsightRowCard } from '@/components/cards/InsightRowCard';
import { AppHeader } from '@/components/common/AppHeader';
import { AppScreen } from '@/components/common/AppScreen';
import { SectionTitle } from '@/components/common/SectionTitle';
import { useAuth } from '@/features/auth/auth-context';
import { getHomeHeroText, getRecommendedBook } from '@/features/progress/helpers';
import { getReviewOverview } from '@/features/progress/storage';
import { ReviewOverview } from '@/features/progress/types';
import { colors } from '@/theme/colors';
import { radius } from '@/theme/radius';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { router, useFocusEffect } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';

const quickActions = [
  { label: 'Libros', icon: 'library-outline' as const, color: colors.coralSoft },
  { label: 'Quiz', icon: 'help-circle-outline' as const, color: colors.yellowSoft },
];

function getDisplayName(name: string | null | undefined) {
  if (!name) return 'amiga';
  return name.trim().split(/\s+/)[0] || 'amiga';
}

export default function HomeScreen() {
  const { profile } = useAuth();
  const [overview, setOverview] = useState<ReviewOverview | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const data = await getReviewOverview();
    setOverview(data);
    setLoading(false);
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  const displayName = useMemo(
    () => getDisplayName(profile?.nickname || profile?.full_name),
    [profile?.full_name, profile?.nickname]
  );

  const avatarLabel = useMemo(() => displayName.charAt(0).toUpperCase(), [displayName]);
  const recommendedBook = useMemo(() => getRecommendedBook(overview), [overview]);
  const heroCopy = useMemo(
    () => getHomeHeroText(overview, recommendedBook),
    [overview, recommendedBook]
  );

  return (
    <AppScreen>
      <AppHeader
        title={`Hola, ${displayName}`}
        subtitle="Tu espacio para estudiar y reforzar lo importante."
        rightSlot={
          profile?.avatar_url ? (
            <Image source={{ uri: profile.avatar_url }} style={styles.avatarImage} contentFit="cover" />
          ) : (
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{avatarLabel}</Text>
            </View>
          )
        }
      />

      <HeroStudyCard
        tag={heroCopy.tag}
        title={heroCopy.title}
        subtitle={heroCopy.subtitle}
        buttonLabel={recommendedBook ? `Abrir ${recommendedBook.name}` : 'Ir a libros'}
        onPress={() => {
          if (recommendedBook) {
            router.push({
              pathname: '/book/[id]',
              params: { id: recommendedBook.id },
            });
            return;
          }

          router.push('/tables');
        }}
      />

      <Pressable style={styles.examCard} onPress={() => router.push('/exam')}>
        <View style={styles.examIconWrap}>
          <Ionicons name="flash-outline" size={22} color={colors.white} />
        </View>

        <View style={styles.examTexts}>
          <Text style={styles.examEyebrow}>Examen general</Text>
          <Text style={styles.examTitle}>Evaluación integral</Text>
          <Text style={styles.examSubtitle}>
            Evalúa clasificación, nombre, capítulos y cómo se presenta.
          </Text>
        </View>

        <Ionicons name="arrow-forward" size={18} color={colors.white} />
      </Pressable>

      <Pressable
        style={styles.studyAllCard}
        onPress={() => router.push('/complete-study')}
      >
        <View style={styles.studyAllIconWrap}>
          <Ionicons name="book-outline" size={22} color={colors.text} />
        </View>

        <View style={styles.studyAllTexts}>
          <Text style={styles.studyAllEyebrow}>Estudio completo</Text>
          <Text style={styles.studyAllTitle}>Estudiar completo</Text>
          <Text style={styles.studyAllSubtitle}>
            Consulta todo el contenido completo del Antiguo y Nuevo Testamento en formato tabla.
          </Text>
        </View>

        <Ionicons name="arrow-forward" size={18} color={colors.text} />
      </Pressable>

      <SectionTitle title="Accesos rápidos" />
      <View style={styles.quickGrid}>
        {quickActions.map((item) => (
          <Pressable
            key={item.label}
            style={[styles.quickItem, { backgroundColor: item.color }]}
            onPress={() => {
              if (item.label === 'Libros') router.push('/tables');

              if (item.label === 'Quiz' && recommendedBook) {
                router.push({
                  pathname: '/study/quiz',
                  params: { bookId: recommendedBook.id },
                });
              }
            }}
          >
            <View style={styles.quickIcon}>
              <Ionicons name={item.icon} size={20} color={colors.text} />
            </View>
            <Text style={styles.quickLabel}>{item.label}</Text>
          </Pressable>
        ))}
      </View>

      {loading ? (
        <View style={styles.loaderWrap}>
          <ActivityIndicator color={colors.coral} />
        </View>
      ) : (
        <>
          <SectionTitle title="Libros débiles" actionLabel="Prioridad" />
          <View style={styles.list}>
            {overview?.weakBooks.length ? (
              overview.weakBooks.slice(0, 3).map((item) => (
                <Pressable
                  key={item.bookId}
                  onPress={() =>
                    router.push({
                      pathname: '/book/[id]',
                      params: { id: item.bookId },
                    })
                  }
                >
                  <InsightRowCard
                    title={item.bookName}
                    subtitle={`${item.completedSessions} sesiones · último puntaje ${item.lastScorePercent}%`}
                    value={`${item.mastery}%`}
                  />
                </Pressable>
              ))
            ) : (
              <View style={styles.emptyCard}>
                <Text style={styles.emptyTitle}>Aún no hay libros débiles</Text>
                <Text style={styles.emptyText}>
                  Completa sesiones y aquí verás qué reforzar primero.
                </Text>
              </View>
            )}
          </View>

          <SectionTitle title="Sesiones recientes" actionLabel="Actividad" />
          <View style={styles.list}>
            {overview?.recentSessions.length ? (
              overview.recentSessions.slice(0, 3).map((item) => (
                <InsightRowCard
                  key={item.id}
                  title={item.bookName}
                  subtitle={`${
                    item.mode === 'match'
                      ? 'Relaciona'
                      : item.mode === 'quiz'
                      ? 'Quiz'
                      : item.mode === 'fill_blank'
                      ? 'Fill Blank'
                      : item.mode === 'exam'
                      ? 'Examen'
                      : 'Tarjetas rápidas'
                  } · ${item.correct}/${item.total} correctas`}
                  value={`${item.scorePercent}%`}
                />
              ))
            ) : (
              <View style={styles.emptyCard}>
                <Text style={styles.emptyTitle}>Todavía no hay actividad</Text>
                <Text style={styles.emptyText}>
                  Empieza con un libro y la app empezará a registrar progreso.
                </Text>
              </View>
            )}
          </View>
        </>
      )}
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  avatarImage: {
    width: 42,
    height: 42,
    borderRadius: 21,
    borderWidth: 1,
    borderColor: colors.border,
  },
  avatarText: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '800',
  },
  examCard: {
    backgroundColor: colors.coral,
    borderRadius: radius.xl,
    padding: 18,
    marginBottom: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  examIconWrap: {
    width: 46,
    height: 46,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  examTexts: {
    flex: 1,
  },
  examEyebrow: {
    color: 'rgba(255,255,255,0.75)',
    fontSize: 11,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginBottom: 4,
  },
  examTitle: {
    color: colors.white,
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 4,
  },
  examSubtitle: {
    color: colors.white,
    fontSize: 13,
    lineHeight: 18,
    opacity: 0.92,
  },
  studyAllCard: {
    backgroundColor: colors.skySoft,
    borderRadius: radius.xl,
    padding: 18,
    marginBottom: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  studyAllIconWrap: {
    width: 46,
    height: 46,
    borderRadius: 18,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  studyAllTexts: {
    flex: 1,
  },
  studyAllEyebrow: {
    color: colors.textSoft,
    fontSize: 11,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginBottom: 4,
  },
  studyAllTitle: {
    color: colors.text,
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 4,
  },
  studyAllSubtitle: {
    color: colors.textSoft,
    fontSize: 13,
    lineHeight: 18,
  },
  quickGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  quickItem: {
    flex: 1,
    borderRadius: radius.xl,
    padding: 16,
    minHeight: 108,
    justifyContent: 'space-between',
  },
  quickIcon: {
    width: 36,
    height: 36,
    borderRadius: 14,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickLabel: {
    marginTop: 14,
    color: colors.text,
    fontSize: 16,
    fontWeight: '800',
  },
  loaderWrap: {
    paddingVertical: 28,
    alignItems: 'center',
  },
  list: {
    gap: 10,
    marginBottom: 18,
  },
  emptyCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: 18,
    borderWidth: 1,
    borderColor: colors.border,
  },
  emptyTitle: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '800',
    marginBottom: 6,
  },
  emptyText: {
    color: colors.textSoft,
    fontSize: 13,
    lineHeight: 18,
  },
});
