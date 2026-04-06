export type StudyMode = 'flashcards' | 'match' | 'fill_blank' | 'quiz' | 'exam';

export type FlashcardQuestionType =
  | 'book_to_order'
  | 'book_to_chapters'
  | 'book_to_classification'
  | 'book_to_phrase';

export type FlashcardItem = {
  id: string;
  questionType: FlashcardQuestionType;
  prompt: string;
  answer: string;
};

export type QuizQuestionType =
  | 'quiz_order'
  | 'quiz_chapters'
  | 'quiz_classification'
  | 'quiz_phrase';

export type QuizQuestion = {
  id: string;
  type: QuizQuestionType;
  prompt: string;
  options: string[];
  correctAnswer: string;
};

export type MatchPromptType =
  | 'name_to_phrase'
  | 'name_to_chapters'
  | 'name_to_classification';

export type MatchLeftItem = {
  id: string;
  label: string;
  pairId: string;
};

export type MatchRightItem = {
  id: string;
  label: string;
  pairId: string;
};

export type MatchGame = {
  id: string;
  type: MatchPromptType;
  leftItems: MatchLeftItem[];
  rightItems: MatchRightItem[];
};

export type FillBlankQuestionType =
  | 'fill_order'
  | 'fill_chapters'
  | 'fill_classification'
  | 'fill_phrase';

export type FillBlankQuestion = {
  id: string;
  type: FillBlankQuestionType;
  prompt: string;
  answer: string;
  hint?: string;
};

export type EvaluationField =
  | 'classification'
  | 'name'
  | 'chapters'
  | 'presentation';

export type EvaluationFormat =
  | 'multiple_choice'
  | 'fill_blank'
  | 'match'
  | 'riddle';

type ExamBaseQuestion = {
  id: string;
  field: EvaluationField;
  format: EvaluationFormat;
  prompt: string;
};

export type ExamChoiceQuestion = ExamBaseQuestion & {
  format: 'multiple_choice' | 'riddle';
  options: string[];
  correctAnswer: string;
};

export type ExamFillBlankQuestion = ExamBaseQuestion & {
  format: 'fill_blank';
  correctAnswer: string;
  hint?: string;
};

export type ExamMatchQuestion = ExamBaseQuestion & {
  format: 'match';
  game: MatchGame;
};

export type ExamQuestion =
  | ExamChoiceQuestion
  | ExamFillBlankQuestion
  | ExamMatchQuestion;

export type IntegralExamQuestionCount = 4 | 8 | 12;