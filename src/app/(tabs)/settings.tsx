import { Text } from 'react-native';
import { AppHeader } from '@/components/common/AppHeader';
import { AppScreen } from '@/components/common/AppScreen';

export default function SettingsScreen() {
  return (
    <AppScreen>
      <AppHeader
        title="Perfil"
        subtitle="Meta diaria, sonido, vibración y ajustes generales."
      />
      <Text>Pantalla en construcción.</Text>
    </AppScreen>
  );
}