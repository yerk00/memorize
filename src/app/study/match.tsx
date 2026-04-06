import { Stack, router, useLocalSearchParams } from 'expo-router';
import { useMemo, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { MatchBoard } from '@/components/study/MatchBoard';
import { AppScreen } from '@/components/common/AppScreen';
import { ScreenNavHeader } from '@/components/common/ScreenNavHeader';
import { allBooks, getBookById } from '@/features/books/seeds';
import { buildMatchGameForBook } from '@/features/study/match';
import { colors } from '@/theme/colors';
import { radius } from '@/theme/radius';

export default function MatchScreen() {
  const { bookId } = useLocalSearchParams<{ bookId: string }>();
  const book = getBookById(bookId ?? '');
  const sessionIdRef = useRef(`match-${bookId}-${Date.now()}`);

  const game = useMemo(() => {
    return book ? buildMatchGameForBook(book, allBooks) : null;
  }, [book]);

  const [selectedLeftId, setSelectedLeftId] = useState<string | null>(null);
  const [selectedRightId, setSelectedRightId] = useState<string | null>(null);
  const [matchedPairIds, setMatchedPairIds] = useState<string[]>([]);
  const [correct, setCorrect] = useState(0);
  const [wrong, setWrong] = useState(0);

  if (!book || !game) {
    return (
      <AppScreen>
        <Text>No se pudo construir el ejercicio.</Text>
      </AppScreen>
    );
  }

  const total = game.leftItems.length;
  const allMatched = matchedPairIds.length === total;

  const leftItem = game.leftItems.find((item) => item.id === selectedLeftId);
  const rightItem = game.rightItems.find((item) => item.id === selectedRightId);

  const resolveAttempt = () => {
    if (!leftItem || !rightItem) return;

    if (leftItem.pairId === rightItem.pairId) {
      const nextCorrect = correct + 1;
      const nextMatched = [...matchedPairIds, leftItem.pairId];

      setCorrect(nextCorrect);
      setMatchedPairIds(nextMatched);
      setSelectedLeftId(null);
      setSelectedRightId(null);

      if (nextMatched.length === total) {
        router.replace({
          pathname: '/study/result',
          params: {
            sessionId: sessionIdRef.current,
            bookId: book.id,
            mode: 'match',
            correct: String(nextCorrect),
            wrong: String(wrong),
            total: String(total),
          },
        });
      }

      return;
    }

    setWrong((prev) => prev + 1);
    setSelectedLeftId(null);
    setSelectedRightId(null);
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />

      <AppScreen scrollable={false} contentStyle={styles.screenContent}>
        <ScreenNavHeader title={book.name} subtitle="Relaciona columnas" />

        <View style={styles.progressCard}>
          <Text style={styles.progressText}>
            Aciertos: {correct} · Errores: {wrong} · Completados: {matchedPairIds.length}/{total}
          </Text>
        </View>

        <MatchBoard
          game={game}
          selectedLeftId={selectedLeftId}
          selectedRightId={selectedRightId}
          matchedPairIds={matchedPairIds}
          onSelectLeft={setSelectedLeftId}
          onSelectRight={setSelectedRightId}
        />

        <View style={styles.actions}>
          <Pressable
            style={[
              styles.primaryButton,
              (!selectedLeftId || !selectedRightId || allMatched) && styles.disabled,
            ]}
            disabled={!selectedLeftId || !selectedRightId || allMatched}
            onPress={resolveAttempt}
          >
            <Text style={styles.primaryText}>Comprobar</Text>
          </Pressable>
        </View>
      </AppScreen>
    </>
  );
}

const styles = StyleSheet.create({
  screenContent: {
    flex: 1,
    paddingBottom: 32,
  },
  progressCard: {
    backgroundColor: colors.lavenderSoft,
    borderRadius: radius.lg,
    padding: 14,
    marginBottom: 16,
  },
  progressText: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '700',
  },
  actions: {
    marginTop: 'auto',
    paddingTop: 16,
  },
  primaryButton: {
    backgroundColor: colors.coral,
    borderRadius: radius.pill,
    paddingVertical: 15,
    alignItems: 'center',
  },
  primaryText: {
    color: colors.white,
    fontSize: 15,
    fontWeight: '800',
  },
  disabled: {
    opacity: 0.45,
  },
});