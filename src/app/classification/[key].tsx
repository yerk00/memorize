import { Stack, router, useLocalSearchParams } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { BookCard } from '@/components/cards/BookCard';
import { AppScreen } from '@/components/common/AppScreen';
import { ScreenNavHeader } from '@/components/common/ScreenNavHeader';
import { SectionTitle } from '@/components/common/SectionTitle';
import { getBooksByTestamentAndClassification } from '@/features/books/seeds';
import { ClassificationKey, Testament } from '@/features/books/types';

export default function ClassificationScreen() {
  const { key, testament } = useLocalSearchParams<{
    key: ClassificationKey;
    testament: Testament;
  }>();

  const books = getBooksByTestamentAndClassification(
    testament ?? 'old',
    (key as ClassificationKey) ?? 'law'
  );

  const title = books[0]?.classificationLabel ?? 'Clasificación';

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />

      <AppScreen>
        <ScreenNavHeader
          title={title}
          subtitle={
            testament === 'new'
              ? 'Nuevo Testamento'
              : 'Antiguo Testamento'
          }
        />

        <SectionTitle title="Libros" actionLabel={`${books.length} elementos`} />

        <View style={styles.grid}>
          {books.map((item) => (
            <View key={item.id} style={styles.gridItem}>
              <BookCard
                item={item}
                onPress={() =>
                  router.push({
                    pathname: '/book/[id]',
                    params: { id: item.id },
                  })
                }
              />
            </View>
          ))}
        </View>

        {!books.length ? <Text style={styles.emptyText}>No se encontraron libros.</Text> : null}
      </AppScreen>
    </>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -6,
  },
  gridItem: {
    width: '50%',
    paddingHorizontal: 6,
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 14,
  },
});
