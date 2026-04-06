import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '@/theme/colors';
import { radius } from '@/theme/radius';

type Props = {
  title: string;
  subtitle: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  onPress: () => void;
};

export function ModeCard({
  title,
  subtitle,
  icon,
  color,
  onPress,
}: Props) {
  return (
    <Pressable onPress={onPress} style={[styles.card, { backgroundColor: color }]}>
      <View style={styles.iconWrap}>
        <Ionicons name={icon} size={22} color={colors.text} />
      </View>

      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>

      <View style={styles.footer}>
        <Ionicons name="play-circle" size={18} color={colors.black} />
        <Text style={styles.footerText}>Empezar</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.lg,
    padding: 16,
    minHeight: 170,
    justifyContent: 'space-between',
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.55)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '800',
    marginTop: 8,
  },
  subtitle: {
    color: colors.textSoft,
    fontSize: 13,
    lineHeight: 18,
    marginTop: 8,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  footerText: {
    color: colors.text,
    fontSize: 13,
    fontWeight: '700',
  },
});