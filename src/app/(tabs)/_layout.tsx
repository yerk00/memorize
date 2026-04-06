import { Tabs } from 'expo-router';
import { CustomTabBar } from '@/components/navigation/CustomTabBar';
import { colors } from '@/theme/colors';

export default function TabsLayout() {
  return (
    <Tabs
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
        sceneStyle: {
          backgroundColor: colors.background,
        },
      }}
    >
      <Tabs.Screen name="index" />
      <Tabs.Screen name="tables" />
      <Tabs.Screen name="review" />
      <Tabs.Screen name="settings" />
    </Tabs>
  );
}
