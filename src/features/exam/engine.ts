import { allBooks } from '@/features/books/seeds';
import {
  ChoiceQuestion,
  ExamBook,
  ExamConfig,
  ExamField,
  ExamQuestion,
  ExamResult,
  ExamSession,
  MatchPair,
  MatchQuestion,
} from './types';

const shuffle = <T>(items: T[]): T[] => [...items].sort(() => Math.random() - 0.5);

const sample = <T>(items: T[], count: number): T[] => shuffle(items).slice(0, count);

const unique = (items: string[]) => Array.from(new Set(items));

const normalize = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[“”"'.,;:¡!¿?()]/g, '')
    .replace(/\s+/g, ' ')
    .trim();

const books: ExamBook[] = allBooks.map((b) => ({
  id: b.id,
  testament: b.testament,
  classificationLabel: b.classificationLabel,
  name: b.name,
  chapterCount: b.chapterCount,
  keyPhrase: b.keyPhrase,
}));

const getChoiceOptions = (correct: string, pool: string[], size = 4): string[] => {
  const distractors = unique(pool).filter((v) => normalize(v) !== normalize(correct));
  return shuffle([correct, ...sample(distractors, size - 1)]);
};

const buildClassificationQuestion = (book: ExamBook): ChoiceQuestion => {
  const pool = books.map((b) => b.classificationLabel);

  return {
    id: `classification-${book.id}`,
    field: 'classification',
    format: 'multiple_choice',
    prompt: `¿A qué clasificación pertenece ${book.name}?`,
    options: getChoiceOptions(book.classificationLabel, pool),
    correctAnswer: book.classificationLabel,
    state: 'idle',
  };
};

const buildChaptersQuestion = (book: ExamBook): ChoiceQuestion => {
  const pool = books.map((b) => String(b.chapterCount));

  return {
    id: `chapters-${book.id}`,
    field: 'chapters',
    format: 'multiple_choice',
    prompt: `¿Cuántos capítulos tiene ${book.name}?`,
    options: getChoiceOptions(String(book.chapterCount), pool),
    correctAnswer: String(book.chapterCount),
    state: 'idle',
  };
};

const buildPresentationQuestion = (book: ExamBook): ChoiceQuestion => {
  const pool = books.map((b) => b.keyPhrase);

  return {
    id: `presentation-${book.id}`,
    field: 'presentation',
    format: 'multiple_choice',
    prompt: `¿Cómo se presenta en ${book.name}?`,
    options: getChoiceOptions(book.keyPhrase, pool),
    correctAnswer: book.keyPhrase,
    state: 'idle',
  };
};

const buildNameQuestion = (book: ExamBook): ChoiceQuestion => {
  const pool = books.map((b) => b.name);

  return {
    id: `name-${book.id}`,
    field: 'name',
    format: 'clue_choice',
    prompt: `Pertenezco a ${book.classificationLabel}, tengo ${book.chapterCount} capítulos y me presento como "${book.keyPhrase}". ¿Qué libro soy?`,
    options: getChoiceOptions(book.name, pool),
    correctAnswer: book.name,
    state: 'idle',
  };
};

const makeRightLabel = (
  book: ExamBook,
  field: 'classification' | 'chapters' | 'presentation'
) => {
  if (field === 'classification') return book.classificationLabel;
  if (field === 'chapters') return `${book.chapterCount} capítulos`;

  const duplicates = books.filter(
    (b) => normalize(b.keyPhrase) === normalize(book.keyPhrase)
  ).length;

  return duplicates > 1
    ? `${book.keyPhrase} · ${book.chapterCount} capítulos`
    : book.keyPhrase;
};

const buildMatchQuestion = (
  field: 'classification' | 'chapters' | 'presentation'
): MatchQuestion => {
  let candidateBooks = sample(books, 4);

  if (field === 'presentation') {
    for (let i = 0; i < 10; i += 1) {
      const labels = candidateBooks.map((b) => makeRightLabel(b, field));
      if (new Set(labels.map(normalize)).size === labels.length) break;
      candidateBooks = sample(books, 4);
    }
  }

  const pairs: MatchPair[] = candidateBooks.map((book) => ({
    pairId: book.id,
    leftLabel: book.name,
    rightLabel: makeRightLabel(book, field),
  }));

  const prompt =
    field === 'classification'
      ? 'Relaciona cada libro con su clasificación'
      : field === 'chapters'
      ? 'Relaciona cada libro con su cantidad de capítulos'
      : 'Relaciona cada libro con cómo se presenta';

  return {
    id: `match-${field}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    field,
    format: 'semantic_match',
    prompt,
    pairs,
    state: 'idle',
  };
};

const buildFieldQuestion = (field: ExamField): ExamQuestion => {
  if (field === 'classification') {
    if (Math.random() < 0.3) return buildMatchQuestion('classification');
    return buildClassificationQuestion(sample(books, 1)[0]);
  }

  if (field === 'chapters') {
    if (Math.random() < 0.3) return buildMatchQuestion('chapters');
    return buildChaptersQuestion(sample(books, 1)[0]);
  }

  if (field === 'presentation') {
    if (Math.random() < 0.3) return buildMatchQuestion('presentation');
    return buildPresentationQuestion(sample(books, 1)[0]);
  }

  return buildNameQuestion(sample(books, 1)[0]);
};

export const buildExamSession = (config: ExamConfig): ExamSession => {
  const fields: ExamField[] = ['classification', 'name', 'chapters', 'presentation'];
  const questions: ExamQuestion[] = [];

  while (questions.length < config.totalQuestions) {
    const field = fields[questions.length % fields.length];
    questions.push(buildFieldQuestion(field));
  }

  return {
    config,
    questions: shuffle(questions),
    currentIndex: 0,
    completed: false,
  };
};

export const evaluateChoiceQuestion = (
  question: ChoiceQuestion,
  selected: string
) => {
  return normalize(selected) === normalize(question.correctAnswer);
};

export const evaluateMatchQuestion = (
  question: MatchQuestion,
  answers: Array<{ leftLabel: string; rightLabel: string }>
) => {
  if (answers.length !== question.pairs.length) return false;

  return question.pairs.every((pair) =>
    answers.some(
      (answer) =>
        normalize(answer.leftLabel) === normalize(pair.leftLabel) &&
        normalize(answer.rightLabel) === normalize(pair.rightLabel)
    )
  );
};

export const buildExamResult = (questions: ExamQuestion[]): ExamResult => {
  const total = questions.length;
  const correct = questions.filter((q) => q.state === 'answered_correct').length;
  const wrong = questions.filter((q) => q.state === 'answered_wrong').length;

  const fields: ExamField[] = ['classification', 'name', 'chapters', 'presentation'];

  const byField = fields.reduce<ExamResult['byField']>((acc, field) => {
    const fieldQuestions = questions.filter((q) => q.field === field);
    const fieldCorrect = fieldQuestions.filter(
      (q) => q.state === 'answered_correct'
    ).length;

    acc[field] = {
      total: fieldQuestions.length,
      correct: fieldCorrect,
      percent:
        fieldQuestions.length === 0
          ? 0
          : Math.round((fieldCorrect / fieldQuestions.length) * 100),
    };

    return acc;
  }, {
    classification: { total: 0, correct: 0, percent: 0 },
    name: { total: 0, correct: 0, percent: 0 },
    chapters: { total: 0, correct: 0, percent: 0 },
    presentation: { total: 0, correct: 0, percent: 0 },
  });

  return {
    total,
    correct,
    wrong,
    percent: total === 0 ? 0 : Math.round((correct / total) * 100),
    byField,
  };
};