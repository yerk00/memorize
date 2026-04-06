import { AppScreen } from '@/components/common/AppScreen';
import { ScreenNavHeader } from '@/components/common/ScreenNavHeader';
import { evaluateChoiceQuestion } from '@/features/exam/engine';
import { completeExamSession, getExamSession, updateExamSession } from '@/features/exam/runtime';
import { ChoiceQuestion, ExamQuestion, MatchQuestion } from '@/features/exam/types';
import { colors } from '@/theme/colors';
import { radius } from '@/theme/radius';
import { Stack, router } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

type MatchAnswer = {
  pairId: string;
};

type RightColumnItem = {
  id: string;
  pairId: string;
  label: string;
};

const shuffle = <T,>(items: T[]): T[] => [...items].sort(() => Math.random() - 0.5);

export default function ExamRunScreen() {
  const [session, setSession] = useState(() => getExamSession());
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [selectedLeftPairId, setSelectedLeftPairId] = useState<string | null>(null);
  const [selectedRightId, setSelectedRightId] = useState<string | null>(null);
  const [matchedAnswers, setMatchedAnswers] = useState<MatchAnswer[]>([]);
  const [matchMistakes, setMatchMistakes] = useState(0);

  const currentQuestion = session?.questions[session.currentIndex] ?? null;
  const isResolved = currentQuestion ? currentQuestion.state !== 'idle' : false;

  const rightColumn = useMemo<RightColumnItem[]>(() => {
    if (!currentQuestion || currentQuestion.format !== 'semantic_match') return [];

    return shuffle(
      currentQuestion.pairs.map((pair) => ({
        id: `right-${pair.pairId}`,
        pairId: pair.pairId,
        label: pair.rightLabel,
      }))
    );
  }, [currentQuestion?.id]);

  useEffect(() => {
    if (!currentQuestion) return;
    setSelectedOption(null);
    setSelectedLeftPairId(null);
    setSelectedRightId(null);
    setMatchedAnswers([]);
    setMatchMistakes(0);
  }, [currentQuestion?.id]);

  if (!session || !currentQuestion) {
    return (
      <AppScreen>
        <Text style={styles.fallbackTitle}>No hay un examen activo.</Text>
        <Pressable style={styles.primaryButton} onPress={() => router.replace('/exam')}>
          <Text style={styles.primaryButtonText}>Ir al examen</Text>
        </Pressable>
      </AppScreen>
    );
  }

  const updateCurrentQuestion = (nextQuestion: ExamQuestion) => {
    const nextQuestions = session.questions.map((question, index) =>
      index === session.currentIndex ? nextQuestion : question
    );

    const nextSession = {
      ...session,
      questions: nextQuestions,
    };

    setSession(nextSession);
    updateExamSession(nextSession);
  };

  const goNext = () => {
    const isLast = session.currentIndex === session.questions.length - 1;

    if (isLast) {
      completeExamSession(session);
      router.replace('/exam/result');
      return;
    }

    const nextSession = {
      ...session,
      currentIndex: session.currentIndex + 1,
    };

    setSession(nextSession);
    updateExamSession(nextSession);
  };

  const handleConfirmChoice = () => {
    if (currentQuestion.format === 'semantic_match' || !selectedOption || isResolved) return;

    const isCorrect = evaluateChoiceQuestion(currentQuestion as ChoiceQuestion, selectedOption);

    updateCurrentQuestion({
      ...currentQuestion,
      state: isCorrect ? 'answered_correct' : 'answered_wrong',
    });
  };

  const handleLinkPair = () => {
    if (currentQuestion.format !== 'semantic_match' || isResolved) return;
    if (!selectedLeftPairId || !selectedRightId) return;

    const selectedRightItem = rightColumn.find((item) => item.id === selectedRightId);
    if (!selectedRightItem) return;

    const isCorrect = selectedLeftPairId === selectedRightItem.pairId;

    if (isCorrect) {
      const nextMatchedAnswers = [...matchedAnswers, { pairId: selectedLeftPairId }];

      setMatchedAnswers(nextMatchedAnswers);
      setSelectedLeftPairId(null);
      setSelectedRightId(null);

      const question = currentQuestion as MatchQuestion;
      if (nextMatchedAnswers.length === question.pairs.length) {
        updateCurrentQuestion({
          ...question,
          state: matchMistakes === 0 ? 'answered_correct' : 'answered_wrong',
        });
      }

      return;
    }

    setMatchMistakes((prev) => prev + 1);
    setSelectedLeftPairId(null);
    setSelectedRightId(null);
  };

  const renderChoiceQuestion = (question: ChoiceQuestion) => {
    const correctAnswer = question.correctAnswer;

    return (
      <View style={styles.card}>
        <Text style={styles.cardEyebrow}>
          {question.format === 'clue_choice' ? 'Identificación' : 'Selección múltiple'}
        </Text>
        <Text style={styles.cardPrompt}>{question.prompt}</Text>

        <View style={styles.optionsList}>
          {question.options.map((option) => {
            const selected = selectedOption === option;
            const isCorrectOption = option === correctAnswer;

            return (
              <Pressable
                key={option}
                disabled={isResolved}
                onPress={() => setSelectedOption(option)}
                style={[
                  styles.option,
                  selected && styles.optionSelected,
                  isResolved && isCorrectOption && styles.optionCorrect,
                  isResolved && selected && !isCorrectOption && styles.optionWrong,
                ]}
              >
                <Text
                  style={[
                    styles.optionText,
                    selected && styles.optionTextSelected,
                    isResolved && isCorrectOption && styles.optionTextCorrect,
                  ]}
                >
                  {option}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {isResolved ? (
          <View
            style={[
              styles.feedbackBox,
              question.state === 'answered_correct'
                ? styles.feedbackCorrect
                : styles.feedbackWrong,
            ]}
          >
            <Text style={styles.feedbackTitle}>
              {question.state === 'answered_correct' ? 'Correcta' : 'Incorrecta'}
            </Text>

            {question.state === 'answered_wrong' ? (
              <Text style={styles.feedbackText}>
                Respuesta correcta: {question.correctAnswer}
              </Text>
            ) : null}
          </View>
        ) : null}
      </View>
    );
  };

  const renderMatchQuestion = (question: MatchQuestion) => {
    const matchedPairIds = matchedAnswers.map((item) => item.pairId);

    return (
      <View style={styles.card}>
        <Text style={styles.cardEyebrow}>Relación semántica</Text>
        <Text style={styles.cardPrompt}>{question.prompt}</Text>

        <View style={styles.matchColumns}>
          <View style={styles.matchColumn}>
            <Text style={styles.matchTitle}>Izquierda</Text>

            {question.pairs.map((pair, index) => {
              const matched = matchedPairIds.includes(pair.pairId);
              const selected = selectedLeftPairId === pair.pairId;

              return (
                <Pressable
                  key={`left-${pair.pairId}-${index}`}
                  disabled={matched || isResolved}
                  onPress={() => setSelectedLeftPairId(pair.pairId)}
                  style={[
                    styles.matchItem,
                    styles.leftAccent,
                    matched && styles.matchItemDone,
                    selected && styles.matchItemSelected,
                  ]}
                >
                  <Text style={styles.matchText}>{pair.leftLabel}</Text>
                </Pressable>
              );
            })}
          </View>

          <View style={styles.matchColumn}>
            <Text style={styles.matchTitle}>Derecha</Text>

            {rightColumn.map((item, index) => {
              const matched = matchedPairIds.includes(item.pairId);
              const selected = selectedRightId === item.id;

              return (
                <Pressable
                  key={`${item.id}-${index}`}
                  disabled={matched || isResolved}
                  onPress={() => setSelectedRightId(item.id)}
                  style={[
                    styles.matchItem,
                    styles.rightAccent,
                    matched && styles.matchItemDone,
                    selected && styles.matchItemSelected,
                  ]}
                >
                  <Text style={styles.matchText}>{item.label}</Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        {!isResolved ? (
          <Text style={styles.matchHint}>
            Selecciona una tarjeta izquierda y una derecha, luego toca “Vincular”.
          </Text>
        ) : null}

        {isResolved ? (
          <View
            style={[
              styles.feedbackBox,
              question.state === 'answered_correct'
                ? styles.feedbackCorrect
                : styles.feedbackWrong,
            ]}
          >
            <Text style={styles.feedbackTitle}>
              {question.state === 'answered_correct'
                ? 'Relación correcta'
                : 'Relación completada con errores'}
            </Text>
          </View>
        ) : null}
      </View>
    );
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />

      <AppScreen scrollable contentStyle={styles.scrollContent}>
        <ScreenNavHeader title="Examen general" subtitle={`Pregunta ${session.currentIndex + 1} de ${session.questions.length}`} />

        <View style={styles.progressCard}>
          <Text style={styles.progressText}>
            Resueltas: {session.questions.filter((question) => question.state !== 'idle').length} / {session.questions.length}
          </Text>
        </View>

        {currentQuestion.format === 'semantic_match'
          ? renderMatchQuestion(currentQuestion as MatchQuestion)
          : renderChoiceQuestion(currentQuestion as ChoiceQuestion)}

        <View style={styles.actions}>
          {currentQuestion.format === 'semantic_match' && !isResolved ? (
            <Pressable
              style={[styles.primaryButton, (!selectedLeftPairId || !selectedRightId) && styles.disabled]}
              disabled={!selectedLeftPairId || !selectedRightId}
              onPress={handleLinkPair}
            >
              <Text style={styles.primaryButtonText}>Vincular</Text>
            </Pressable>
          ) : null}

          {currentQuestion.format !== 'semantic_match' && !isResolved ? (
            <Pressable
              style={[styles.primaryButton, !selectedOption && styles.disabled]}
              disabled={!selectedOption}
              onPress={handleConfirmChoice}
            >
              <Text style={styles.primaryButtonText}>Comprobar</Text>
            </Pressable>
          ) : null}

          {isResolved ? (
            <Pressable style={styles.primaryButton} onPress={goNext}>
              <Text style={styles.primaryButtonText}>
                {session.currentIndex === session.questions.length - 1 ? 'Ver resultado' : 'Siguiente'}
              </Text>
            </Pressable>
          ) : null}
        </View>
      </AppScreen>
    </>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 32,
  },
  fallbackTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 16,
  },
  progressCard: {
    backgroundColor: colors.coralSoft,
    borderRadius: radius.lg,
    padding: 14,
    marginBottom: 16,
  },
  progressText: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '700',
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: 18,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardEyebrow: {
    color: colors.textSoft,
    fontSize: 12,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginBottom: 8,
  },
  cardPrompt: {
    color: colors.text,
    fontSize: 22,
    lineHeight: 28,
    fontWeight: '800',
    marginBottom: 18,
  },
  optionsList: {
    gap: 10,
  },
  option: {
    backgroundColor: colors.backgroundSoft,
    borderRadius: radius.lg,
    paddingVertical: 14,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: colors.border,
  },
  optionSelected: {
    borderColor: colors.coral,
    backgroundColor: colors.coralSoft,
  },
  optionCorrect: {
    borderColor: colors.success,
    backgroundColor: colors.mintSoft,
  },
  optionWrong: {
    borderColor: colors.danger,
  },
  optionText: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '700',
  },
  optionTextSelected: {
    color: colors.text,
  },
  optionTextCorrect: {
    color: colors.text,
  },
  feedbackBox: {
    marginTop: 16,
    borderRadius: radius.lg,
    padding: 14,
  },
  feedbackCorrect: {
    backgroundColor: colors.mintSoft,
  },
  feedbackWrong: {
    backgroundColor: colors.coralSoft,
  },
  feedbackTitle: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '800',
    marginBottom: 4,
  },
  feedbackText: {
    color: colors.textSoft,
    fontSize: 13,
    lineHeight: 18,
  },
  matchColumns: {
    flexDirection: 'row',
    gap: 12,
  },
  matchColumn: {
    flex: 1,
    gap: 10,
  },
  matchTitle: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '800',
    marginBottom: 4,
  },
  matchItem: {
    backgroundColor: colors.backgroundSoft,
    borderRadius: radius.lg,
    padding: 14,
    borderWidth: 2,
    borderColor: colors.border,
    minHeight: 68,
    justifyContent: 'center',
  },
  leftAccent: {
    borderLeftWidth: 6,
    borderLeftColor: colors.lavender,
  },
  rightAccent: {
    borderLeftWidth: 6,
    borderLeftColor: colors.sky,
  },
  matchItemSelected: {
    borderColor: colors.coral,
    backgroundColor: colors.coralSoft,
  },
  matchItemDone: {
    backgroundColor: colors.mintSoft,
    borderColor: colors.success,
  },
  matchText: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 18,
  },
  matchHint: {
    marginTop: 14,
    color: colors.textSoft,
    fontSize: 13,
    lineHeight: 18,
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
  primaryButtonText: {
    color: colors.white,
    fontSize: 15,
    fontWeight: '800',
  },
  disabled: {
    opacity: 0.45,
  },
});
