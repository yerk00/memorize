import { Pressable, StyleSheet, Text, View } from 'react-native';
import { FlashcardItem } from '@/features/study/types';
import { colors } from '@/theme/colors';
import { radius } from '@/theme/radius';

type Props = {
  item: FlashcardItem;
  revealed: boolean;
  index: number;
  total: number;
  onReveal: () => void;
};

export function FlashcardView({
  item,
  revealed,
  index,
  total,
  onReveal,
}: Props) {
  return (
    <View style={styles.wrapper}>
      <View style={styles.progressRow}>
        <Text style={styles.progressText}>
          Tarjeta {index + 1} de {total}
        </Text>
      </View>

      <Pressable style={styles.card} onPress={onReveal}>
        <Text style={styles.label}>Pregunta</Text>
        <Text style={styles.prompt}>{item.prompt}</Text>

        <View style={styles.divider} />

        <Text style={styles.label}>Respuesta</Text>
        <Text style={[styles.answer, !revealed && styles.answerHidden]}>
          {revealed ? item.answer : 'Toca la tarjeta para revelar'}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 18,
  },
  progressRow: {
    marginBottom: 10,
  },
  progressText: {
    color: colors.textSoft,
    fontSize: 13,
    fontWeight: '700',
  },
  card: {
    backgroundColor: colors.lavenderSoft,
    borderRadius: radius.xl,
    padding: 20,
    minHeight: 320,
    justifyContent: 'center',
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
    fontSize: 26,
    lineHeight: 32,
    fontWeight: '800',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(0,0,0,0.08)',
    marginVertical: 22,
  },
  answer: {
    color: colors.text,
    fontSize: 22,
    lineHeight: 28,
    fontWeight: '800',
  },
  answerHidden: {
    color: colors.textSoft,
    fontWeight: '700',
  },
});