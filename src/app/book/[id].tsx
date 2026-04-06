import { Ionicons } from '@expo/vector-icons';
import { Stack, router, useLocalSearchParams } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { AppScreen } from '@/components/common/AppScreen';
import { getBookColor } from '@/features/books/bookTheme';
import { getBookById } from '@/features/books/seeds';
import { colors } from '@/theme/colors';
import { radius } from '@/theme/radius';

export default function BookDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const book = getBookById(id ?? '');

  if (!book) {
    return (
      <AppScreen>
        <Text>No se encontró el libro.</Text>
      </AppScreen>
    );
  }

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />

      <AppScreen>
        <View style={[styles.hero, { backgroundColor: getBookColor(book) }]}>
          <View style={styles.topRow}>
            <Pressable style={styles.backButton} onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={18} color={colors.text} />
            </Pressable>

            <View style={styles.orderBadge}>
              <Text style={styles.orderText}>#{book.orderNumber}</Text>
            </View>
          </View>

          <Text style={styles.heroTitle}>{book.name}</Text>
          <Text style={styles.heroSubtitle}>{book.classificationLabel}</Text>

          <View style={styles.metaRow}>
            <View style={styles.metaCard}>
              <Text style={styles.metaValue}>{book.chapterCount}</Text>
              <Text style={styles.metaLabel}>Capítulos</Text>
            </View>

            <View style={styles.metaCard}>
              <Text style={styles.metaValue}>
                {book.testament === 'old' ? 'AT' : 'NT'}
              </Text>
              <Text style={styles.metaLabel}>Tabla</Text>
            </View>
          </View>
        </View>

        <View style={styles.contentCard}>
          <Text style={styles.sectionLabel}>Frase clave</Text>
          <Text style={styles.keyPhrase}>{book.keyPhrase}</Text>

          <Text style={styles.sectionLabel}>Qué practicar aquí</Text>

          <View style={styles.practiceList}>
            <View style={styles.practiceItem}>
              <Ionicons name="checkmark-circle" size={18} color={colors.coral} />
              <Text style={styles.practiceText}>Orden del libro</Text>
            </View>

            <View style={styles.practiceItem}>
              <Ionicons name="checkmark-circle" size={18} color={colors.coral} />
              <Text style={styles.practiceText}>Cantidad de capítulos</Text>
            </View>

            <View style={styles.practiceItem}>
              <Ionicons name="checkmark-circle" size={18} color={colors.coral} />
              <Text style={styles.practiceText}>Clasificación</Text>
            </View>

            <View style={styles.practiceItem}>
              <Ionicons name="checkmark-circle" size={18} color={colors.coral} />
              <Text style={styles.practiceText}>Frase doctrinal</Text>
            </View>
          </View>

          <Pressable
            style={styles.primaryButton}
            onPress={() =>
                router.push({
                pathname: '/study/mode',
                params: { bookId: book.id },
                })
            }
            >
            <Text style={styles.primaryButtonText}>Practicar este libro</Text>
          </Pressable>
        </View>
      </AppScreen>
    </>
  );
}

const styles = StyleSheet.create({
  hero: {
    borderRadius: radius.xl,
    padding: 18,
    marginBottom: 16,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 18,
  },
  backButton: {
    width: 42,
    height: 42,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.65)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  orderBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.7)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: radius.pill,
  },
  orderText: {
    color: colors.text,
    fontSize: 12,
    fontWeight: '800',
  },
  heroTitle: {
    color: colors.text,
    fontSize: 30,
    fontWeight: '800',
    marginBottom: 6,
  },
  heroSubtitle: {
    color: colors.textSoft,
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 18,
  },
  metaRow: {
    flexDirection: 'row',
    gap: 12,
  },
  metaCard: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.55)',
    borderRadius: radius.lg,
    padding: 14,
  },
  metaValue: {
    color: colors.text,
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 4,
  },
  metaLabel: {
    color: colors.textSoft,
    fontSize: 12,
    fontWeight: '600',
  },
  contentCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: 18,
    borderWidth: 1,
    borderColor: colors.border,
  },
  sectionLabel: {
    color: colors.textSoft,
    fontSize: 12,
    fontWeight: '800',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  keyPhrase: {
    color: colors.text,
    fontSize: 22,
    lineHeight: 28,
    fontWeight: '800',
    marginBottom: 20,
  },
  practiceList: {
    gap: 12,
    marginBottom: 22,
  },
  practiceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  practiceText: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '600',
  },
  primaryButton: {
    backgroundColor: colors.coral,
    borderRadius: radius.pill,
    paddingVertical: 14,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: colors.white,
    fontSize: 15,
    fontWeight: '800',
  },
});