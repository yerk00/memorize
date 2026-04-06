import { Pressable, StyleSheet, Text, View } from 'react-native';
import { ClassificationSummary } from '@/features/books/seeds';
import { colors } from '@/theme/colors';
import { radius } from '@/theme/radius';

type Props = {
  item: ClassificationSummary;
  color: string;
  onPress: () => void;
};

export function ClassificationCard({ item, color, onPress }: Props) {
  return (
    <Pressable onPress={onPress} style={[styles.card, { backgroundColor: color }]}>
      <View style={styles.badge}>
        <Text style={styles.badgeText}>{item.totalBooks} libros</Text>
      </View>

      <View style={styles.illustration} />

      <Text numberOfLines={2} style={styles.title}>
        {item.classificationLabel}
      </Text>

      <Text style={styles.subtitle}>Entrenar esta sección</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    minHeight: 190,
    borderRadius: radius.lg,
    padding: 14,
    justifyContent: 'space-between',
  },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.7)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: radius.pill,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.text,
  },
  illustration: {
    height: 62,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.35)',
    marginVertical: 10,
  },
  title: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '800',
    lineHeight: 20,
    marginBottom: 6,
  },
  subtitle: {
    color: colors.textSoft,
    fontSize: 12,
    fontWeight: '600',
  },
});