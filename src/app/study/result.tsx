import { Stack, router, useLocalSearchParams } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { ResultSummaryCard } from '@/components/study/ResultSummaryCard';
import { AppScreen } from '@/components/common/AppScreen';
import { ScreenNavHeader } from '@/components/common/ScreenNavHeader';
import { getBookById } from '@/features/books/seeds';
import { recordStudySession } from '@/features/progress/storage';
import { StudySessionMode } from '@/features/progress/types';
import { colors } from '@/theme/colors';
import { radius } from '@/theme/radius';

export default function ResultScreen() {
  const { sessionId, bookId, mode, correct, wrong, total } = useLocalSearchParams<{
    sessionId: string;
    bookId: string;
    mode?: StudySessionMode;
    correct: string;
    wrong: string;
    total: string;
  }>();

  const resolvedMode: StudySessionMode =
    mode === 'quiz'
      ? 'quiz'
      : mode === 'match'
      ? 'match'
      : mode === 'fill_blank'
      ? 'fill_blank'
      : 'flashcards';

  const book = getBookById(bookId ?? '');
  const correctCount = Number(correct ?? 0);
  const wrongCount = Number(wrong ?? 0);
  const totalCount = Number(total ?? 0);

  const didSaveRef = useRef(false);
  const [saveState, setSaveState] = useState<'saving' | 'saved' | 'error'>('saving');

  useEffect(() => {
    if (!book || !sessionId || didSaveRef.current) return;

    didSaveRef.current = true;

    recordStudySession({
      sessionId,
      bookId: book.id,
      bookName: book.name,
      mode: resolvedMode,
      correct: correctCount,
      wrong: wrongCount,
      total: totalCount,
    })
      .then(() => setSaveState('saved'))
      .catch(() => setSaveState('error'));
  }, [sessionId, book, resolvedMode, correctCount, wrongCount, totalCount]);

  if (!book) {
    return (
      <AppScreen>
        <Text>No se pudo cargar el resultado.</Text>
      </AppScreen>
    );
  }

  const repeatPath =
    resolvedMode === 'quiz'
      ? '/study/quiz'
      : resolvedMode === 'match'
      ? '/study/match'
      : resolvedMode === 'fill_blank'
      ? '/study/fill-blank'
      : '/study/flashcards';

  const modeLabel =
    resolvedMode === 'quiz'
      ? 'Quiz'
      : resolvedMode === 'match'
      ? 'Relaciona columnas'
      : resolvedMode === 'fill_blank'
      ? 'Fill Blank'
      : 'Tarjetas rápidas';

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />

      <AppScreen>
        <ScreenNavHeader title="Sesión completada" subtitle={`${book.name} · ${modeLabel}`} />

<View style={styles.statusWrap}>
          <Text style={styles.saveStatus}>
            {saveState === 'saving' && 'Guardando progreso...'}
            {saveState === 'saved' && 'Progreso guardado'}
            {saveState === 'error' && 'No se pudo guardar el progreso'}
          </Text>
        </View>

        <ResultSummaryCard
          correct={correctCount}
          wrong={wrongCount}
          total={totalCount}
        />

        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>Lectura rápida del resultado</Text>
          <Text style={styles.infoText}>
            Usa este resultado para saber si este libro ya está firme o si debes repetirlo
            antes de pasar al siguiente.
          </Text>
        </View>

        <View style={styles.actions}>
          <Pressable
            style={styles.secondaryButton}
            onPress={() =>
              router.replace({
                pathname: repeatPath,
                params: { bookId: book.id },
              })
            }
          >
            <Text style={styles.secondaryText}>
              Repetir
            </Text>
          </Pressable>

          <Pressable
            style={styles.primaryButton}
            onPress={() => router.replace('/review')}
          >
            <Text style={styles.primaryText}>Ir a repaso</Text>
          </Pressable>
        </View>
      </AppScreen>
    </>
  );
}

const styles = StyleSheet.create({
  statusWrap: {
    marginBottom: 12,
  },
  saveStatus: {
    color: colors.coralDark,
    fontSize: 12,
    fontWeight: '700',
  },
  infoCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: 18,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 18,
  },
  infoTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 8,
  },
  infoText: {
    color: colors.textSoft,
    fontSize: 14,
    lineHeight: 20,
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
  primaryButton: {
    flex: 1,
    backgroundColor: colors.coral,
    borderRadius: radius.pill,
    paddingVertical: 15,
    alignItems: 'center',
  },
  secondaryText: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '800',
  },
  primaryText: {
    color: colors.white,
    fontSize: 15,
    fontWeight: '800',
  },
});