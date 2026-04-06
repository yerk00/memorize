import { StyleSheet, Text, View } from 'react-native';
import { colors } from '@/theme/colors';
import { radius } from '@/theme/radius';

type Props = {
  correct: number;
  wrong: number;
  total: number;
};

export function ResultSummaryCard({ correct, wrong, total }: Props) {
  const percent = total === 0 ? 0 : Math.round((correct / total) * 100);

  return (
    <View style={styles.card}>
      <Text style={styles.eyebrow}>Resultado</Text>
      <Text style={styles.percent}>{percent}%</Text>
      <Text style={styles.caption}>Dominio en esta sesión</Text>

      <View style={styles.row}>
        <View style={styles.metric}>
          <Text style={styles.metricValue}>{correct}</Text>
          <Text style={styles.metricLabel}>Bien</Text>
        </View>

        <View style={styles.metric}>
          <Text style={styles.metricValue}>{wrong}</Text>
          <Text style={styles.metricLabel}>Fallé</Text>
        </View>

        <View style={styles.metric}>
          <Text style={styles.metricValue}>{total}</Text>
          <Text style={styles.metricLabel}>Total</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.coralSoft,
    borderRadius: radius.xl,
    padding: 20,
    marginBottom: 18,
  },
  eyebrow: {
    color: colors.textSoft,
    fontSize: 12,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginBottom: 8,
  },
  percent: {
    color: colors.text,
    fontSize: 40,
    fontWeight: '800',
    marginBottom: 4,
  },
  caption: {
    color: colors.textSoft,
    fontSize: 14,
    marginBottom: 18,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  metric: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.55)',
    borderRadius: radius.lg,
    padding: 14,
  },
  metricValue: {
    color: colors.text,
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 4,
  },
  metricLabel: {
    color: colors.textSoft,
    fontSize: 12,
    fontWeight: '700',
  },
});