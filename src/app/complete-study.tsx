import { AppScreen } from '@/components/common/AppScreen';
import { ScreenNavHeader } from '@/components/common/ScreenNavHeader';
import { allBooks } from '@/features/books/seeds';
import { colors } from '@/theme/colors';
import { radius } from '@/theme/radius';
import { Stack } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

type TestamentKey = 'old' | 'new';

type SectionGroup = {
  classificationLabel: string;
  rows: typeof allBooks;
};

const TESTAMENT_TITLES: Record<TestamentKey, string> = {
  old: 'ANTIGUO TESTAMENTO',
  new: 'NUEVO TESTAMENTO',
};

function groupBooksByClassification(testament: TestamentKey): SectionGroup[] {
  const filtered = allBooks.filter((book) => book.testament === testament);

  const groups: SectionGroup[] = [];

  filtered.forEach((book) => {
    const existing = groups.find(
      (group) => group.classificationLabel === book.classificationLabel
    );

    if (existing) {
      existing.rows.push(book);
      return;
    }

    groups.push({
      classificationLabel: book.classificationLabel,
      rows: [book],
    });
  });

  return groups;
}

function TableHeader() {
  return (
    <View style={[styles.row, styles.headerRow]}>
      <Text style={[styles.cell, styles.numberCol, styles.headerText]}>N°</Text>
      <Text style={[styles.cell, styles.classificationCol, styles.headerText]}>
        CLASIFICACIÓN
      </Text>
      <Text style={[styles.cell, styles.nameCol, styles.headerText]}>NOMBRE</Text>
      <Text style={[styles.cell, styles.chapterCol, styles.headerText]}>CAPÍTULOS</Text>
      <Text style={[styles.cell, styles.presentationCol, styles.headerText]}>
        CÓMO SE PRESENTA
      </Text>
    </View>
  );
}

export default function CompleteStudyScreen() {
  const oldGroups = groupBooksByClassification('old');
  const newGroups = groupBooksByClassification('new');

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />

      <AppScreen>
        <ScreenNavHeader
          title="Estudiar completo"
          subtitle="Consulta todo el contenido completo en formato tabla."
        />

        {[oldGroups, newGroups].map((groups, sectionIndex) => {
          const testament = sectionIndex === 0 ? 'old' : 'new';

          return (
            <View key={testament} style={styles.section}>
              <Text style={styles.sectionTitle}>
                {TESTAMENT_TITLES[testament as TestamentKey]}
              </Text>

              <ScrollView horizontal showsHorizontalScrollIndicator>
                <View style={styles.table}>
                  <TableHeader />

                  {groups.map((group) => (
                    <View key={group.classificationLabel}>
                      <View style={styles.groupRow}>
                        <Text style={styles.groupTitle}>{group.classificationLabel}</Text>
                      </View>

                      {group.rows.map((book) => (
                        <View key={book.id} style={styles.row}>
                          <Text style={[styles.cell, styles.numberCol]}>
                            {book.orderNumber}
                          </Text>
                          <Text
                            style={[styles.cell, styles.classificationCol, styles.mutedText]}
                          >
                            {book.classificationLabel}
                          </Text>
                          <Text style={[styles.cell, styles.nameCol]}>{book.name}</Text>
                          <Text style={[styles.cell, styles.chapterCol]}>
                            {book.chapterCount}
                          </Text>
                          <Text style={[styles.cell, styles.presentationCol]}>
                            {book.keyPhrase}
                          </Text>
                        </View>
                      ))}
                    </View>
                  ))}
                </View>
              </ScrollView>
            </View>
          );
        })}
      </AppScreen>
    </>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: 22,
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 12,
  },
  table: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  headerRow: {
    backgroundColor: colors.coralSoft,
  },
  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  groupRow: {
    backgroundColor: colors.lavenderSoft,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  groupTitle: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '800',
  },
  cell: {
    paddingHorizontal: 10,
    paddingVertical: 12,
    color: colors.text,
    fontSize: 13,
    lineHeight: 18,
  },
  headerText: {
    fontWeight: '800',
  },
  mutedText: {
    color: colors.textSoft,
  },
  numberCol: {
    width: 60,
  },
  classificationCol: {
    width: 220,
  },
  nameCol: {
    width: 150,
  },
  chapterCol: {
    width: 110,
  },
  presentationCol: {
    width: 340,
  },
});