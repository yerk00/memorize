import { QuizQuestion } from '@/features/study/types';
import { colors } from '@/theme/colors';
import { radius } from '@/theme/radius';
import { Pressable, StyleSheet, Text, View } from 'react-native';

type Props = {
  item: QuizQuestion;
  index: number;
  total: number;
  selectedOption: string | null;
  resolved: boolean;
  onSelect: (option: string) => void;
};

export function QuizQuestionCard({
  item,
  index,
  total,
  selectedOption,
  resolved,
  onSelect,
}: Props) {
  return (
    <View style={styles.wrapper}>
      <Text style={styles.progressText}>
        Pregunta {index + 1} de {total}
      </Text>

      <View style={styles.card}>
        <Text style={styles.label}>Pregunta</Text>
        <Text style={styles.prompt}>{item.prompt}</Text>

        <View style={styles.optionsList}>
          {item.options.map((option) => {
            const selected = selectedOption === option;
            const isCorrectOption = option === item.correctAnswer;
            const isWrongSelected = resolved && selected && !isCorrectOption;

            return (
              <Pressable
                key={option}
                disabled={resolved}
                onPress={() => onSelect(option)}
                style={[
                  styles.option,
                  selected && styles.optionSelected,
                  resolved && isCorrectOption && styles.optionCorrect,
                  isWrongSelected && styles.optionWrong,
                ]}
              >
                <Text
                  style={[
                    styles.optionText,
                    selected && styles.optionTextSelected,
                    resolved && isCorrectOption && styles.optionTextCorrect,
                    isWrongSelected && styles.optionTextWrong,
                  ]}
                >
                  {option}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {resolved ? (
          <View
            style={[
              styles.feedbackBox,
              selectedOption === item.correctAnswer
                ? styles.feedbackCorrect
                : styles.feedbackWrong,
            ]}
          >
            <Text style={styles.feedbackTitle}>
              {selectedOption === item.correctAnswer ? 'Correcta' : 'Incorrecta'}
            </Text>
            {selectedOption !== item.correctAnswer ? (
              <Text style={styles.feedbackText}>
                Respuesta correcta: {item.correctAnswer}
              </Text>
            ) : null}
          </View>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 18,
  },
  progressText: {
    color: colors.textSoft,
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 10,
  },
  card: {
    backgroundColor: colors.yellowSoft,
    borderRadius: radius.xl,
    padding: 20,
    minHeight: 320,
  },
  label: {
    color: colors.textSoft,
    fontSize: 12,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginBottom: 8,
  },
  prompt: {
    color: colors.text,
    fontSize: 24,
    lineHeight: 30,
    fontWeight: '800',
    marginBottom: 22,
  },
  optionsList: {
    gap: 10,
  },
  option: {
    backgroundColor: 'rgba(255,255,255,0.65)',
    borderRadius: radius.lg,
    paddingVertical: 14,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  optionSelected: {
    borderColor: colors.coral,
    backgroundColor: colors.white,
  },
  optionCorrect: {
    borderColor: colors.success,
    backgroundColor: colors.mintSoft,
  },
  optionWrong: {
    borderColor: colors.danger,
    backgroundColor: colors.coralSoft,
  },
  optionText: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '700',
  },
  optionTextSelected: {
    color: colors.coralDark,
  },
  optionTextCorrect: {
    color: colors.text,
  },
  optionTextWrong: {
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
});
