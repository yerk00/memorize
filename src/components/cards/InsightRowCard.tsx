import { StyleSheet, Text, View } from 'react-native';
import { colors } from '@/theme/colors';
import { radius } from '@/theme/radius';

type Props = {
  title: string;
  subtitle: string;
  value: string;
};

export function InsightRowCard({ title, subtitle, value }: Props) {
  return (
    <View style={styles.card}>
      <View style={styles.texts}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </View>

      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.border,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  texts: {
    flex: 1,
    paddingRight: 12,
  },
  title: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '800',
    marginBottom: 4,
  },
  subtitle: {
    color: colors.textSoft,
    fontSize: 12,
    lineHeight: 16,
  },
  value: {
    color: colors.coralDark,
    fontSize: 15,
    fontWeight: '800',
  },
});