import { AppScreen } from '@/components/common/AppScreen';
import { ScreenNavHeader } from '@/components/common/ScreenNavHeader';
import { QuizQuestionCard } from '@/components/study/QuizQuestionCard';
import { allBooks, getBookById } from '@/features/books/seeds';
import { buildBookQuizQuestions } from '@/features/study/quiz';
import { colors } from '@/theme/colors';
import { radius } from '@/theme/radius';
import { Stack, router, useLocalSearchParams } from 'expo-router';
import { useMemo, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

export default function QuizScreen() {
  const { bookId } = useLocalSearchParams<{ bookId: string }>();
  const book = getBookById(bookId ?? '');
  const sessionIdRef = useRef(`quiz-${bookId}-${Date.now()}`);

  const questions = useMemo(() => {
    return book ? buildBookQuizQuestions(book, allBooks) : [];
  }, [book]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [resolved, setResolved] = useState(false);
  const [correct, setCorrect] = useState(0);
  const [wrong, setWrong] = useState(0);

  if (!book) {
    return (
      <AppScreen>
        <Text>No se encontró el libro para el quiz.</Text>
      </AppScreen>
    );
  }

  const currentQuestion = questions[currentIndex];
  const isLast = currentIndex === questions.length - 1;

  const handleCheck = () => {
    if (!selectedOption || resolved) return;

    const isCorrect = selectedOption === currentQuestion.correctAnswer;

    if (isCorrect) {
      setCorrect((prev) => prev + 1);
    } else {
      setWrong((prev) => prev + 1);
    }

    setResolved(true);
  };

  const handleNext = () => {
    if (!resolved) return;

    if (isLast) {
      router.replace({
        pathname: '/study/result',
        params: {
          sessionId: sessionIdRef.current,
          bookId: book.id,
          mode: 'quiz',
          correct: String(correct),
          wrong: String(wrong),
          total: String(questions.length),
        },
      });
      return;
    }

    setCurrentIndex((prev) => prev + 1);
    setSelectedOption(null);
    setResolved(false);
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />

      <AppScreen scrollable={false} contentStyle={styles.screenContent}>
        <ScreenNavHeader title={book.name} subtitle="Quiz" />

        <QuizQuestionCard
          item={currentQuestion}
          index={currentIndex}
          total={questions.length}
          selectedOption={selectedOption}
          resolved={resolved}
          onSelect={setSelectedOption}
        />

        <View style={styles.actions}>
          {!resolved ? (
            <Pressable
              style={[styles.primaryButton, !selectedOption && styles.disabled]}
              disabled={!selectedOption}
              onPress={handleCheck}
            >
              <Text style={styles.primaryText}>Comprobar</Text>
            </Pressable>
          ) : (
            <Pressable style={styles.primaryButton} onPress={handleNext}>
              <Text style={styles.primaryText}>
                {isLast ? 'Finalizar quiz' : 'Siguiente'}
              </Text>
            </Pressable>
          )}
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
    marginTop: 'auto',
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
