import { BookEntry } from '@/features/books/types';

export type ExamField =
  | 'classification'
  | 'name'
  | 'chapters'
  | 'presentation';

export type ExamFormat =
  | 'multiple_choice'
  | 'clue_choice'
  | 'semantic_match';

export type ExamResolutionState =
  | 'idle'
  | 'answered_correct'
  | 'answered_wrong';

export type ExamConfig = {
  totalQuestions: 10 | 20 | 30;
};

export type ChoiceQuestion = {
  id: string;
  field: ExamField;
  format: 'multiple_choice' | 'clue_choice';
  prompt: string;
  options: string[];
  correctAnswer: string;
  state: ExamResolutionState;
  explanation?: string;
};

export type MatchPair = {
  pairId: string;
  leftLabel: string;
  rightLabel: string;
};

export type MatchQuestion = {
  id: string;
  field: ExamField;
  format: 'semantic_match';
  prompt: string;
  pairs: MatchPair[];
  state: ExamResolutionState;
  explanation?: string;
};

export type ExamQuestion = ChoiceQuestion | MatchQuestion;

export type ExamResult = {
  total: number;
  correct: number;
  wrong: number;
  percent: number;
  byField: Record<ExamField, { total: number; correct: number; percent: number }>;
};

export type ExamSession = {
  config: ExamConfig;
  questions: ExamQuestion[];
  currentIndex: number;
  completed: boolean;
};

export type ExamBook = Pick<
  BookEntry,
  'id' | 'testament' | 'classificationLabel' | 'name' | 'chapterCount' | 'keyPhrase'
>;