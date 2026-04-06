import { Stack, router, useLocalSearchParams } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { ScreenNavHeader } from '@/components/common/ScreenNavHeader';
import { ModeCard } from '@/components/study/ModeCard';
import { AppScreen } from '@/components/common/AppScreen';
import { getBookById } from '@/features/books/seeds';
import { colors } from '@/theme/colors';

export default function StudyModeScreen() {
  const { bookId } = useLocalSearchParams<{ bookId: string }>();
  const book = getBookById(bookId ?? '');

  if (!book) {
    return (
      <AppScreen>
        <Text>No se encontró el libro para estudiar.</Text>
      </AppScreen>
    );
  }

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />

      <AppScreen>
        <ScreenNavHeader title={book.name} subtitle="Estudiar libro" />

        <View style={styles.grid}>
          <ModeCard
            title="Tarjetas rápidas"
            subtitle="Pregunta y respuesta para memorizar datos clave."
            icon="layers-outline"
            color={colors.lavenderSoft}
            onPress={() =>
              router.push({
                pathname: '/study/flashcards',
                params: { bookId: book.id },
              })
            }
          />

          <ModeCard
            title="Quiz"
            subtitle="Opción múltiple para validar memoria y precisión."
            icon="help-circle-outline"
            color={colors.yellowSoft}
            onPress={() =>
              router.push({
                pathname: '/study/quiz',
                params: { bookId: book.id },
              })
            }
          />

          <ModeCard
            title="Relaciona"
            subtitle="Empareja libro con frase o capítulos dentro de su grupo."
            icon="git-compare-outline"
            color={colors.mintSoft}
            onPress={() =>
              router.push({
                pathname: '/study/match',
                params: { bookId: book.id },
              })
            }
          />

          <ModeCard
            title="Fill Blank"
            subtitle="Escribe número, capítulos, clasificación y frase clave."
            icon="create-outline"
            color={colors.skySoft}
            onPress={() =>
              router.push({
                pathname: '/study/fill-blank',
                params: { bookId: book.id },
              })
            }
          />
        </View>
      </AppScreen>
    </>
  );
}

const styles = StyleSheet.create({
  grid: {
    gap: 12,
  },
});
