import { BookEntry } from '@/features/books/types';
import { QuizQuestion } from './types';

const unique = (values: string[]) => Array.from(new Set(values));

const shuffle = <T,>(items: T[]): T[] => [...items].sort(() => Math.random() - 0.5);

const buildOptions = (
  correct: string,
  pool: string[],
  total: number = 4
): string[] => {
  const cleanedPool = unique(pool).filter((item) => item !== correct);
  const picked = shuffle(cleanedPool).slice(0, total - 1);
  const mixed = [correct, ...picked];

  return shuffle(mixed);
};

export const buildBookQuizQuestions = (
  book: BookEntry,
  pool: BookEntry[]
): QuizQuestion[] => {
  const sameTestament = pool.filter((item) => item.testament === book.testament);

  const chapterPool = sameTestament.map((item) => String(item.chapterCount));
  const classificationPool = sameTestament.map((item) => item.classificationLabel);
  const phrasePool = sameTestament.map((item) => item.keyPhrase);
  const orderPool = sameTestament.map((item) => String(item.orderNumber));

  return [
    {
      id: `${book.id}-quiz-order`,
      type: 'quiz_order',
      prompt: `¿Qué número ocupa ${book.name}?`,
      correctAnswer: String(book.orderNumber),
      options: buildOptions(String(book.orderNumber), orderPool),
    },
    {
      id: `${book.id}-quiz-chapters`,
      type: 'quiz_chapters',
      prompt: `¿Cuántos capítulos tiene ${book.name}?`,
      correctAnswer: String(book.chapterCount),
      options: buildOptions(String(book.chapterCount), chapterPool),
    },
    {
      id: `${book.id}-quiz-classification`,
      type: 'quiz_classification',
      prompt: `¿A qué clasificación pertenece ${book.name}?`,
      correctAnswer: book.classificationLabel,
      options: buildOptions(book.classificationLabel, classificationPool),
    },
    {
      id: `${book.id}-quiz-phrase`,
      type: 'quiz_phrase',
      prompt: `¿Cómo se presenta Cristo en ${book.name}?`,
      correctAnswer: book.keyPhrase,
      options: buildOptions(book.keyPhrase, phrasePool),
    },
  ];
};
