import { PropsWithChildren } from 'react';
import { ScrollView, StyleSheet, View, ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '@/theme/colors';

type Props = PropsWithChildren<{
  scrollable?: boolean;
  contentStyle?: ViewStyle;
}>;

export function AppScreen({
  children,
  scrollable = true,
  contentStyle,
}: Props) {
  return (
    <SafeAreaView style={styles.safeArea}>
      {scrollable ? (
        <ScrollView
          contentContainerStyle={[styles.scrollContent, contentStyle]}
          showsVerticalScrollIndicator={false}
        >
          {children}
        </ScrollView>
      ) : (
        <View style={[styles.staticContent, contentStyle]}>{children}</View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 120,
  },
  staticContent: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 12,
  },
});