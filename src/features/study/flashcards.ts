import { BookEntry } from '@/features/books/types';
import { FlashcardItem } from './types';

export const buildBookFlashcards = (book: BookEntry): FlashcardItem[] => {
  return [
    {
      id: `${book.id}-order`,
      questionType: 'book_to_order',
      prompt: `¿Qué número ocupa ${book.name}?`,
      answer: `${book.orderNumber}`,
    },
    {
      id: `${book.id}-chapters`,
      questionType: 'book_to_chapters',
      prompt: `¿Cuántos capítulos tiene ${book.name}?`,
      answer: `${book.chapterCount}`,
    },
    {
      id: `${book.id}-classification`,
      questionType: 'book_to_classification',
      prompt: `¿A qué clasificación pertenece ${book.name}?`,
      answer: book.classificationLabel,
    },
    {
      id: `${book.id}-phrase`,
      questionType: 'book_to_phrase',
      prompt: `¿Cómo se presenta Cristo en ${book.name}?`,
      answer: book.keyPhrase,
    },
  ];
};