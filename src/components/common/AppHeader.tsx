import { StyleSheet, Text, View } from 'react-native';
import { colors } from '@/theme/colors';
import { typography } from '@/theme/typography';

type Props = {
  title: string;
  subtitle?: string;
  rightSlot?: React.ReactNode;
};

export function AppHeader({ title, subtitle, rightSlot }: Props) {
  return (
    <View style={styles.row}>
      <View style={styles.texts}>
        <Text style={styles.title}>{title}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>
      {rightSlot}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  texts: {
    flex: 1,
    paddingRight: 12,
  },
  title: {
    color: colors.text,
    fontSize: typography.hero,
    fontWeight: '800',
    letterSpacing: -0.7,
  },
  subtitle: {
    marginTop: 6,
    color: colors.textSoft,
    fontSize: typography.body,
    lineHeight: 20,
  },
});