import { allBooks, getBookById } from '@/features/books/seeds';
import { BookEntry } from '@/features/books/types';
import { ReviewOverview } from './types';

let sessionRecommendedId: string | null = null;

const pickRandom = <T,>(items: T[]): T | null => {
  if (!items.length) return null;
  return items[Math.floor(Math.random() * items.length)];
};

export const getRecommendedBook = (
  overview: ReviewOverview | null
): BookEntry | null => {
  const weakCandidates =
    overview?.weakBooks
      .map((item) => getBookById(item.bookId))
      .filter(Boolean) as BookEntry[] ?? [];

  const recentCandidates =
    overview?.recentSessions
      .map((item) => getBookById(item.bookId))
      .filter(Boolean) as BookEntry[] ?? [];

  const pool =
    weakCandidates.length > 0
      ? weakCandidates
      : recentCandidates.length > 0
      ? recentCandidates
      : allBooks;

  if (
    !sessionRecommendedId ||
    !pool.some((book) => book.id === sessionRecommendedId)
  ) {
    const randomBook = pickRandom(pool);
    sessionRecommendedId = randomBook?.id ?? null;
  }

  return sessionRecommendedId ? getBookById(sessionRecommendedId) ?? null : null;
};

export const getHomeHeroText = (
  overview: ReviewOverview | null,
  recommendedBook: BookEntry | null
) => {
  if (!recommendedBook) {
    return {
      tag: 'Hoy',
      title: 'Empieza tu estudio',
      subtitle: 'Explora los libros y comienza una primera sesión.',
    };
  }

  if (!overview || overview.totalSessions === 0) {
    return {
      tag: 'Hoy',
      title: `Empieza con ${recommendedBook.name}`,
      subtitle: `Una buena forma de arrancar es reforzar ${recommendedBook.classificationLabel.toLowerCase()}.`,
    };
  }

  return {
    tag: 'Recomendado hoy',
    title: `Repasa ${recommendedBook.name}`,
    subtitle: `Te conviene volver sobre este libro antes de pasar al siguiente.`,
  };
};