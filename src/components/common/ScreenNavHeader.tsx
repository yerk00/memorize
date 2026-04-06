import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '@/theme/colors';

type Props = {
  title: string;
  subtitle?: string;
  showHome?: boolean;
  onBack?: () => void;
};

export function ScreenNavHeader({
  title,
  subtitle,
  showHome = true,
  onBack,
}: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <Pressable
          style={styles.iconButton}
          onPress={onBack ?? (() => router.back())}
        >
          <Ionicons name="arrow-back" size={18} color={colors.text} />
        </Pressable>

        {showHome ? (
          <Pressable style={styles.homeButton} onPress={() => router.push('/')}>
            <Ionicons name="home-outline" size={16} color={colors.text} />
            <Text style={styles.homeText}>Inicio</Text>
          </Pressable>
        ) : (
          <View style={styles.homeSpacer} />
        )}
      </View>

      <Text style={styles.title}>{title}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  iconButton: {
    width: 42,
    height: 42,
    borderRadius: 16,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  homeButton: {
    minHeight: 42,
    paddingHorizontal: 14,
    borderRadius: 16,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  homeSpacer: {
    width: 42,
  },
  homeText: {
    color: colors.text,
    fontSize: 13,
    fontWeight: '700',
  },
  title: {
    color: colors.text,
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 4,
  },
  subtitle: {
    color: colors.textSoft,
    fontSize: 14,
    lineHeight: 20,
  },
});