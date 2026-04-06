export type StudySessionMode =
  | 'flashcards'
  | 'quiz'
  | 'match'
  | 'fill_blank'
  | 'exam';

export type StudySessionRecord = {
  id: string;
  bookId: string;
  bookName: string;
  mode: StudySessionMode;
  correct: number;
  wrong: number;
  total: number;
  scorePercent: number;
  completedAt: string;
};

export type BookProgress = {
  bookId: string;
  bookName: string;
  completedSessions: number;
  totalCorrect: number;
  totalWrong: number;
  lastScorePercent: number;
  mastery: number;
  lastStudiedAt: string;
};

export type DailyActivityPoint = {
  label: string;
  sessions: number;
};

export type ReviewOverview = {
  totalSessions: number;
  studiedBooks: number;
  averageMastery: number;
  recentSessions: StudySessionRecord[];
  weakBooks: BookProgress[];
  dailyActivity: DailyActivityPoint[];
};