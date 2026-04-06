import { Stack, router, useLocalSearchParams } from 'expo-router';
import { useMemo, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { FillBlankCard } from '@/components/study/FillBlankCard';
import { AppScreen } from '@/components/common/AppScreen';
import { ScreenNavHeader } from '@/components/common/ScreenNavHeader';
import { getBookById } from '@/features/books/seeds';
import {
  buildBookFillBlankQuestions,
  isFillBlankCorrect,
} from '@/features/study/fillBlank';
import { colors } from '@/theme/colors';
import { radius } from '@/theme/radius';

type AnswerStatus = 'idle' | 'correct' | 'wrong';

export default function FillBlankScreen() {
  const { bookId } = useLocalSearchParams<{ bookId: string }>();
  const book = getBookById(bookId ?? '');
  const sessionIdRef = useRef(`fill-blank-${bookId}-${Date.now()}`);

  const questions = useMemo(() => {
    return book ? buildBookFillBlankQuestions(book) : [];
  }, [book]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [inputValue, setInputValue] = useState('');
  const [status, setStatus] = useState<AnswerStatus>('idle');
  const [revealedAnswer, setRevealedAnswer] = useState<string | null>(null);
  const [correct, setCorrect] = useState(0);
  const [wrong, setWrong] = useState(0);

  if (!book) {
    return (
      <AppScreen>
        <Text>No se encontró el libro para este ejercicio.</Text>
      </AppScreen>
    );
  }

  const currentQuestion = questions[currentIndex];
  const isLast = currentIndex === questions.length - 1;
  const alreadyChecked = status !== 'idle';

  const handleCheck = () => {
    if (!inputValue.trim()) return;

    const ok = isFillBlankCorrect(inputValue, currentQuestion.answer);

    if (ok) {
      setCorrect((prev) => prev + 1);
      setStatus('correct');
      setRevealedAnswer(null);
      return;
    }

    setWrong((prev) => prev + 1);
    setStatus('wrong');
    setRevealedAnswer(currentQuestion.answer);
  };

  const handleNext = () => {
    if (isLast) {
      router.replace({
        pathname: '/study/result',
        params: {
          sessionId: sessionIdRef.current,
          bookId: book.id,
          mode: 'fill_blank',
          correct: String(correct),
          wrong: String(wrong),
          total: String(questions.length),
        },
      });
      return;
    }

    setCurrentIndex((prev) => prev + 1);
    setInputValue('');
    setStatus('idle');
    setRevealedAnswer(null);
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />

      <AppScreen scrollable={false} contentStyle={styles.screenContent}>
        <ScreenNavHeader title={book.name} subtitle="Fill Blank" />

        <FillBlankCard
          item={currentQuestion}
          value={inputValue}
          index={currentIndex}
          total={questions.length}
          editable={!alreadyChecked}
          onChangeText={setInputValue}
          status={status}
          revealedAnswer={revealedAnswer}
        />

        <View style={styles.actions}>
          {!alreadyChecked ? (
            <Pressable
              style={[styles.primaryButton, !inputValue.trim() && styles.disabled]}
              disabled={!inputValue.trim()}
              onPress={handleCheck}
            >
              <Text style={styles.primaryText}>Comprobar</Text>
            </Pressable>
          ) : (
            <Pressable style={styles.primaryButton} onPress={handleNext}>
              <Text style={styles.primaryText}>
                {isLast ? 'Finalizar' : 'Siguiente'}
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