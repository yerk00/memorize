import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { BookCard } from '@/components/cards/BookCard';
import { ClassificationCard } from '@/components/cards/ClassificationCard';
import { AppHeader } from '@/components/common/AppHeader';
import { AppScreen } from '@/components/common/AppScreen';
import { SearchInput } from '@/components/common/SearchInput';
import { SectionTitle } from '@/components/common/SectionTitle';
import { SegmentedTabs } from '@/components/common/SegmentedTabs';
import {
  allBooks,
  getClassificationSummariesByTestament,
} from '@/features/books/seeds';
import { getClassificationColor } from '@/features/books/bookTheme';
import { BookEntry, Testament } from '@/features/books/types';
import { colors } from '@/theme/colors';
import { radius } from '@/theme/radius';

export default function TablesScreen() {
  const [testament, setTestament] = useState<Testament>('old');
  const [search, setSearch] = useState('');

  const normalized = search.trim().toLowerCase();

  const filteredBooks = useMemo<BookEntry[]>(() => {
    return allBooks.filter((book) => {
      const matchesTestament = book.testament === testament;
      const matchesSearch =
        normalized.length === 0 ||
        book.name.toLowerCase().includes(normalized) ||
        book.classificationLabel.toLowerCase().includes(normalized) ||
        book.keyPhrase.toLowerCase().includes(normalized);

      return matchesTestament && matchesSearch;
    });
  }, [normalized, testament]);

  const classifications = useMemo(() => {
    return getClassificationSummariesByTestament(testament);
  }, [testament]);

  const highlightedBooks = filteredBooks.slice(0, 6);

  return (
    <AppScreen>
      <AppHeader
        title="Libros"
        subtitle="Explora el Antiguo y Nuevo Testamento por clasificación y libro."
        rightSlot={
          <Pressable style={styles.homeButton} onPress={() => router.push('/')}>
            <Text style={styles.homeButtonText}>Inicio</Text>
          </Pressable>
        }
      />

      <SegmentedTabs
        value={testament}
        onChange={setTestament}
        options={[
          { label: 'Antiguo', value: 'old' },
          { label: 'Nuevo', value: 'new' },
        ]}
      />

      <SearchInput value={search} onChangeText={setSearch} />

      {normalized.length === 0 ? (
        <>
          <SectionTitle
            title="Clasificaciones"
            actionLabel={`${classifications.length} grupos`}
          />

          <View style={styles.grid}>
            {classifications.map((item) => (
              <View key={item.classificationKey} style={styles.gridItem}>
                <ClassificationCard
                  item={item}
                  color={getClassificationColor(item.classificationKey)}
                  onPress={() =>
                    router.push({
                      pathname: '/classification/[key]',
                      params: {
                        key: item.classificationKey,
                        testament,
                      },
                    })
                  }
                />
              </View>
            ))}
          </View>

          <SectionTitle
            title="Libros destacados"
            actionLabel={`${highlightedBooks.length} visibles`}
          />

          <View style={styles.grid}>
            {highlightedBooks.map((item) => (
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
        </>
      ) : (
        <>
          <SectionTitle
            title={testament === 'old' ? 'Resultados en Antiguo Testamento' : 'Resultados en Nuevo Testamento'}
            actionLabel={`${filteredBooks.length} libros`}
          />

          <View style={styles.grid}>
            {filteredBooks.map((item) => (
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
        </>
      )}
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  homeButton: {
    minHeight: 40,
    paddingHorizontal: 14,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  homeButtonText: {
    color: colors.text,
    fontSize: 13,
    fontWeight: '700',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -6,
    marginBottom: 18,
  },
  gridItem: {
    width: '50%',
    paddingHorizontal: 6,
    marginBottom: 12,
  },
});