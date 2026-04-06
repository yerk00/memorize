import { BookEntry } from '@/features/books/types';
import { MatchGame } from './types';

const shuffle = <T>(items: T[]): T[] => {
  return [...items].sort(() => Math.random() - 0.5);
};

export const buildMatchGameForBook = (
  currentBook: BookEntry,
  pool: BookEntry[]
): MatchGame => {
  const relatedBooks = pool.filter(
    (item) =>
      item.testament === currentBook.testament &&
      item.classificationKey === currentBook.classificationKey
  );

  const fallbackPool = pool.filter((item) => item.testament === currentBook.testament);

  const source = relatedBooks.length >= 4 ? relatedBooks : fallbackPool;

  const selectedBooks = shuffle(source)
    .filter(
      (item, index, array) =>
        array.findIndex((candidate) => candidate.id === item.id) === index
    )
    .slice(0, 4);

  const type = Math.random() > 0.5 ? 'name_to_phrase' : 'name_to_chapters';

  return {
    id: `match-${currentBook.id}-${Date.now()}`,
    type,
    leftItems: selectedBooks.map((book) => ({
      id: `left-${book.id}`,
      label: book.name,
      pairId: book.id,
    })),
    rightItems: shuffle(
      selectedBooks.map((book) => ({
        id: `right-${book.id}`,
        label:
          type === 'name_to_phrase'
            ? book.keyPhrase
            : `${book.chapterCount} capítulos`,
        pairId: book.id,
      }))
    ),
  };
};