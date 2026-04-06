import { StyleSheet, Text, View } from 'react-native';
import { colors } from '@/theme/colors';
import { typography } from '@/theme/typography';

type Props = {
  title: string;
  actionLabel?: string;
};

export function SectionTitle({ title, actionLabel }: Props) {
  return (
    <View style={styles.row}>
      <Text style={styles.title}>{title}</Text>
      {actionLabel ? <Text style={styles.action}>{actionLabel}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    color: colors.text,
    fontSize: typography.section,
    fontWeight: '800',
  },
  action: {
    color: colors.coral,
    fontSize: typography.caption,
    fontWeight: '700',
  },
});