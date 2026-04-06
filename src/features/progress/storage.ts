import Storage from 'expo-sqlite/kv-store';
import {
  BookProgress,
  ReviewOverview,
  StudySessionMode,
  StudySessionRecord,
} from './types';

const SESSIONS_KEY = 'memoriza:sessions:v1';
const PROGRESS_KEY = 'memoriza:progress:v1';

const parseJson = <T>(value: string | null, fallback: T): T => {
  if (!value) return fallback;

  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
};

const clampPercent = (value: number) => {
  if (Number.isNaN(value)) return 0;
  return Math.max(0, Math.min(100, Math.round(value)));
};

export const getStoredSessions = async (): Promise<StudySessionRecord[]> => {
  const raw = await Storage.getItem(SESSIONS_KEY);
  return parseJson<StudySessionRecord[]>(raw, []);
};

export const getStoredProgressMap = async (): Promise<Record<string, BookProgress>> => {
  const raw = await Storage.getItem(PROGRESS_KEY);
  return parseJson<Record<string, BookProgress>>(raw, {});
};

export const recordStudySession = async (input: {
  sessionId: string;
  bookId: string;
  bookName: string;
  mode: StudySessionMode;
  correct: number;
  wrong: number;
  total: number;
}) => {
  const [sessions, progressMap] = await Promise.all([
    getStoredSessions(),
    getStoredProgressMap(),
  ]);

  const alreadySaved = sessions.some((session) => session.id === input.sessionId);
  if (alreadySaved) {
    return;
  }

  const scorePercent =
    input.total === 0 ? 0 : clampPercent((input.correct / input.total) * 100);

  const newSession: StudySessionRecord = {
    id: input.sessionId,
    bookId: input.bookId,
    bookName: input.bookName,
    mode: input.mode,
    correct: input.correct,
    wrong: input.wrong,
    total: input.total,
    scorePercent,
    completedAt: new Date().toISOString(),
  };

  const currentProgress = progressMap[input.bookId];

  const nextProgress: BookProgress = {
    bookId: input.bookId,
    bookName: input.bookName,
    completedSessions: (currentProgress?.completedSessions ?? 0) + 1,
    totalCorrect: (currentProgress?.totalCorrect ?? 0) + input.correct,
    totalWrong: (currentProgress?.totalWrong ?? 0) + input.wrong,
    lastScorePercent: scorePercent,
    mastery: clampPercent(
      (((currentProgress?.totalCorrect ?? 0) + input.correct) /
        Math.max(
          1,
          ((currentProgress?.totalCorrect ?? 0) + input.correct) +
            ((currentProgress?.totalWrong ?? 0) + input.wrong)
        )) *
        100
    ),
    lastStudiedAt: newSession.completedAt,
  };

  const nextSessions = [newSession, ...sessions].slice(0, 50);
  const nextProgressMap = {
    ...progressMap,
    [input.bookId]: nextProgress,
  };

  await Promise.all([
    Storage.setItem(SESSIONS_KEY, JSON.stringify(nextSessions)),
    Storage.setItem(PROGRESS_KEY, JSON.stringify(nextProgressMap)),
  ]);
};

const getDayKey = (date: Date) => {
  const y = date.getFullYear();
  const m = `${date.getMonth() + 1}`.padStart(2, '0');
  const d = `${date.getDate()}`.padStart(2, '0');
  return `${y}-${m}-${d}`;
};

const DAY_LABELS = ['D', 'L', 'M', 'M', 'J', 'V', 'S'];

export const getReviewOverview = async (): Promise<ReviewOverview> => {
  const [sessions, progressMap] = await Promise.all([
    getStoredSessions(),
    getStoredProgressMap(),
  ]);

  const progressList = Object.values(progressMap);

  const averageMastery =
    progressList.length === 0
      ? 0
      : clampPercent(
          progressList.reduce((acc, item) => acc + item.mastery, 0) /
            progressList.length
        );

  const weakBooks = [...progressList]
    .sort((a, b) => {
      if (a.mastery !== b.mastery) return a.mastery - b.mastery;
      return a.completedSessions - b.completedSessions;
    })
    .slice(0, 5);

  const today = new Date();
  const dailyActivity = Array.from({ length: 7 }).map((_, index) => {
    const date = new Date(today);
    date.setDate(today.getDate() - (6 - index));
    const key = getDayKey(date);

    const daySessions = sessions.filter((session) => {
      const sessionDate = new Date(session.completedAt);
      return getDayKey(sessionDate) === key;
    });

    return {
      label: DAY_LABELS[date.getDay()],
      sessions: daySessions.length,
    };
  });

  return {
    totalSessions: sessions.length,
    studiedBooks: progressList.length,
    averageMastery,
    recentSessions: sessions.slice(0, 5),
    weakBooks,
    dailyActivity,
  };
};