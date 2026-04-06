import { Pressable, StyleSheet, Text, View } from 'react-native';
import { getBookColor } from '@/features/books/bookTheme';
import { BookEntry } from '@/features/books/types';
import { colors } from '@/theme/colors';
import { radius } from '@/theme/radius';

type Props = {
  item: BookEntry;
  onPress: () => void;
};

export function BookCard({ item, onPress }: Props) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.card, { backgroundColor: getBookColor(item) }]}
    >
      <View style={styles.badge}>
        <Text style={styles.badgeText}>#{item.orderNumber}</Text>
      </View>

      <View style={styles.illustration} />

      <Text numberOfLines={1} style={styles.name}>
        {item.name}
      </Text>

      <Text numberOfLines={1} style={styles.meta}>
        {item.chapterCount} capítulos
      </Text>

      <Text numberOfLines={2} style={styles.phrase}>
        {item.keyPhrase}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    minHeight: 218,
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
    height: 72,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.35)',
    marginVertical: 10,
  },
  name: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 4,
  },
  meta: {
    color: colors.textSoft,
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 6,
  },
  phrase: {
    color: colors.text,
    fontSize: 12,
    lineHeight: 16,
  },
});