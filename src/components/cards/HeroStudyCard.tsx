import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '@/theme/colors';
import { radius } from '@/theme/radius';

type Props = {
  tag: string;
  title: string;
  subtitle: string;
  buttonLabel: string;
  onPress: () => void;
};

export function HeroStudyCard({
  tag,
  title,
  subtitle,
  buttonLabel,
  onPress,
}: Props) {
  return (
    <View style={styles.card}>
      <Text style={styles.tag}>{tag}</Text>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>

      <Pressable style={styles.button} onPress={onPress}>
        <Ionicons name="play" size={16} color={colors.white} />
        <Text style={styles.buttonText}>{buttonLabel}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.lavender,
    borderRadius: radius.xl,
    padding: 20,
    marginBottom: 18,
  },
  tag: {
    color: '#5B4C6E',
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 10,
  },
  title: {
    color: colors.text,
    fontSize: 24,
    fontWeight: '800',
    lineHeight: 30,
    marginBottom: 8,
  },
  subtitle: {
    color: '#4F4659',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
  },
  button: {
    alignSelf: 'flex-start',
    backgroundColor: colors.black,
    borderRadius: radius.pill,
    paddingHorizontal: 14,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  buttonText: {
    color: colors.white,
    fontWeight: '700',
    fontSize: 13,
  },
});