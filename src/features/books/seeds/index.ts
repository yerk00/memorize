import { BookEntry, ClassificationKey, Testament } from '@/features/books/types';
import { newTestamentBooks } from './new-testament';
import { oldTestamentBooks } from './old-testament';

export const allBooks: BookEntry[] = [...oldTestamentBooks, ...newTestamentBooks];

export const getBooksByTestament = (testament: Testament) =>
  allBooks.filter((book) => book.testament === testament);

export const getBookById = (id: string) => allBooks.find((book) => book.id === id);

export const getBooksByClassification = (classificationKey: ClassificationKey) =>
  allBooks.filter((book) => book.classificationKey === classificationKey);

export const getBooksByTestamentAndClassification = (
  testament: Testament,
  classificationKey: ClassificationKey
) =>
  allBooks.filter(
    (book) =>
      book.testament === testament && book.classificationKey === classificationKey
  );

export type ClassificationSummary = {
  classificationKey: ClassificationKey;
  classificationLabel: string;
  totalBooks: number;
};

export const getClassificationSummariesByTestament = (
  testament: Testament
): ClassificationSummary[] => {
  const books = getBooksByTestament(testament);
  const summaryMap = new Map<ClassificationKey, ClassificationSummary>();

  books.forEach((book) => {
    const existing = summaryMap.get(book.classificationKey);

    if (existing) {
      existing.totalBooks += 1;
      return;
    }

    summaryMap.set(book.classificationKey, {
      classificationKey: book.classificationKey,
      classificationLabel: book.classificationLabel,
      totalBooks: 1,
    });
  });

  return Array.from(summaryMap.values()).sort((a, b) =>
    a.classificationLabel.localeCompare(b.classificationLabel)
  );
};
