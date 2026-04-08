import { AppScreen } from '@/components/common/AppScreen';
import { ScreenNavHeader } from '@/components/common/ScreenNavHeader';
import { FlashcardView } from '@/components/study/FlashcardView';
import { getBookById } from '@/features/books/seeds';
import { buildBookFlashcards } from '@/features/study/flashcards';
import { colors } from '@/theme/colors';
import { radius } from '@/theme/radius';
import { Stack, router, useLocalSearchParams } from 'expo-router';
import { useMemo, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

export default function FlashcardsScreen() {
  const { bookId } = useLocalSearchParams<{ bookId: string }>();
  const book = getBookById(bookId ?? '');
  const sessionIdRef = useRef(`flashcards-${bookId}-${Date.now()}`);

  const cards = useMemo(() => {
    return book ? buildBookFlashcards(book) : [];
  }, [book]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [correct, setCorrect] = useState(0);
  const [wrong, setWrong] = useState(0);

  if (!book) {
    return (
      <AppScreen>
        <Text>No se encontró el libro para la sesión.</Text>
      </AppScreen>
    );
  }

  const currentCard = cards[currentIndex];
  const isLast = currentIndex === cards.length - 1;

  const handleAnswer = (wasCorrect: boolean) => {
    const nextCorrect = wasCorrect ? correct + 1 : correct;
    const nextWrong = wasCorrect ? wrong : wrong + 1;

    if (isLast) {
      router.replace({
        pathname: '/study/result',
        params: {
          sessionId: sessionIdRef.current,
          bookId: book.id,
          correct: String(nextCorrect),
          wrong: String(nextWrong),
          total: String(cards.length),
        },
      });
      return;
    }

    if (wasCorrect) {
      setCorrect((prev) => prev + 1);
    } else {
      setWrong((prev) => prev + 1);
    }

    setCurrentIndex((prev) => prev + 1);
    setRevealed(false);
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />

      <AppScreen scrollable={false} contentStyle={styles.screenContent}>
        <ScreenNavHeader title={book.name} subtitle="Tarjetas rápidas" />

        <FlashcardView
          item={currentCard}
          revealed={revealed}
          index={currentIndex}
          total={cards.length}
          onReveal={() => setRevealed(true)}
        />

        <View style={styles.actions}>
          <Pressable
            style={[styles.actionButton, styles.wrongButton, !revealed && styles.disabled]}
            disabled={!revealed}
            onPress={() => handleAnswer(false)}
          >
            <Text style={styles.wrongText}>Fallé</Text>
          </Pressable>

          <Pressable
            style={[styles.actionButton, styles.correctButton, !revealed && styles.disabled]}
            disabled={!revealed}
            onPress={() => handleAnswer(true)}
          >
            <Text style={styles.correctText}>Bien</Text>
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
  actions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 'auto',
  },
  actionButton: {
    flex: 1,
    borderRadius: radius.pill,
    paddingVertical: 15,
    alignItems: 'center',
  },
  wrongButton: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  correctButton: {
    backgroundColor: colors.coral,
  },
  wrongText: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '800',
  },
  correctText: {
    color: colors.white,
    fontSize: 15,
    fontWeight: '800',
  },
  disabled: {
    opacity: 0.45,
  },
});