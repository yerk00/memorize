import { BookEntry } from '@/features/books/types';
import { FillBlankQuestion } from './types';

export const buildBookFillBlankQuestions = (
  book: BookEntry
): FillBlankQuestion[] => {
  return [
    {
      id: `${book.id}-fill-chapters`,
      type: 'fill_chapters',
      prompt: `Escribe cuántos capítulos tiene ${book.name}`,
      answer: String(book.chapterCount),
      hint: 'Solo número',
    },
    {
      id: `${book.id}-fill-classification`,
      type: 'fill_classification',
      prompt: `Escribe la clasificación de ${book.name}`,
      answer: book.classificationLabel,
      hint: 'Ejemplo: Evangelios, Libros históricos, Cartas Paulinas...',
    },
    {
      id: `${book.id}-fill-phrase`,
      type: 'fill_phrase',
      prompt: `Escribe cómo se presenta Cristo en ${book.name}`,
      answer: book.keyPhrase,
      hint: 'Puedes escribir sin comillas ni puntuación exacta.',
    },
  ];
};

export const normalizeAnswer = (value: string): string => {
  return value
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[“”"'.,;:¡!¿?()\-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
};

export const isFillBlankCorrect = (
  userAnswer: string,
  expectedAnswer: string
): boolean => {
  return normalizeAnswer(userAnswer) === normalizeAnswer(expectedAnswer);
};
