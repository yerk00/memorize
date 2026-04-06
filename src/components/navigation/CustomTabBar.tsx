import { Ionicons } from '@expo/vector-icons';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '@/theme/colors';
import { radius } from '@/theme/radius';

const icons: Record<string, keyof typeof Ionicons.glyphMap> = {
  index: 'home-outline',
  tables: 'grid-outline',
  review: 'stats-chart-outline',
  settings: 'person-outline',
};

const labels: Record<string, string> = {
  index: 'Inicio',
  tables: 'Libros',
  review: 'Estadísticas',
  settings: 'Ajustes',
};

export function CustomTabBar({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) {
  return (
    <View style={styles.wrapper}>
      <View style={styles.container}>
        {state.routes.map((route, index) => {
          const isFocused = state.index === index;
          const options = descriptors[route.key].options;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          const iconName = icons[route.name] ?? 'ellipse-outline';
          const label = labels[route.name] ?? options.title ?? route.name;

          return (
            <Pressable
              key={route.key}
              onPress={onPress}
              style={styles.item}
            >
              <View style={[styles.iconWrap, isFocused && styles.iconWrapActive]}>
                <Ionicons
                  name={iconName}
                  size={22}
                  color={isFocused ? colors.white : colors.textSoft}
                />
              </View>
              <Text style={[styles.label, isFocused && styles.labelActive]}>
                {label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 18,
  },
  container: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    paddingHorizontal: 10,
    paddingTop: 10,
    paddingBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: colors.border,
  },
  item: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  iconWrap: {
    width: 46,
    height: 46,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapActive: {
    backgroundColor: colors.coral,
    marginTop: -26,
  },
  label: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textSoft,
  },
  labelActive: {
    color: colors.coralDark,
  },
});