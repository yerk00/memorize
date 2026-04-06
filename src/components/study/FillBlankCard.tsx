import { StyleSheet, Text, TextInput, View } from 'react-native';
import { FillBlankQuestion } from '@/features/study/types';
import { colors } from '@/theme/colors';
import { radius } from '@/theme/radius';

type Props = {
  item: FillBlankQuestion;
  value: string;
  index: number;
  total: number;
  editable: boolean;
  onChangeText: (value: string) => void;
  status: 'idle' | 'correct' | 'wrong';
  revealedAnswer?: string | null;
};

export function FillBlankCard({
  item,
  value,
  index,
  total,
  editable,
  onChangeText,
  status,
  revealedAnswer,
}: Props) {
  return (
    <View style={styles.wrapper}>
      <Text style={styles.progressText}>
        Ejercicio {index + 1} de {total}
      </Text>

      <View style={styles.card}>
        <Text style={styles.label}>Completa</Text>
        <Text style={styles.prompt}>{item.prompt}</Text>

        {item.hint ? <Text style={styles.hint}>{item.hint}</Text> : null}

        <TextInput
          value={value}
          editable={editable}
          onChangeText={onChangeText}
          placeholder="Escribe tu respuesta"
          placeholderTextColor={colors.textSoft}
          style={[
            styles.input,
            status === 'correct' && styles.inputCorrect,
            status === 'wrong' && styles.inputWrong,
          ]}
        />

        {status === 'correct' ? (
          <Text style={styles.correctText}>Correcto</Text>
        ) : null}

        {status === 'wrong' && revealedAnswer ? (
          <View style={styles.answerBox}>
            <Text style={styles.answerLabel}>Respuesta correcta</Text>
            <Text style={styles.answerText}>{revealedAnswer}</Text>
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
    backgroundColor: colors.skySoft,
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
    marginBottom: 12,
  },
  hint: {
    color: colors.textSoft,
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 16,
  },
  input: {
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 14,
    paddingVertical: 14,
    color: colors.text,
    fontSize: 16,
    fontWeight: '600',
  },
  inputCorrect: {
    borderColor: colors.success,
  },
  inputWrong: {
    borderColor: colors.danger,
  },
  correctText: {
    marginTop: 12,
    color: colors.success,
    fontSize: 14,
    fontWeight: '800',
  },
  answerBox: {
    marginTop: 14,
    backgroundColor: 'rgba(255,255,255,0.65)',
    borderRadius: radius.lg,
    padding: 14,
  },
  answerLabel: {
    color: colors.textSoft,
    fontSize: 12,
    fontWeight: '800',
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  answerText: {
    color: colors.text,
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '700',
  },
});