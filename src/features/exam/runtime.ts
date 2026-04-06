import { buildExamResult, buildExamSession } from './engine';
import { ExamConfig, ExamResult, ExamSession } from './types';

let currentExamSession: ExamSession | null = null;
let currentExamResult: ExamResult | null = null;

export const createExamSession = (config: ExamConfig): ExamSession => {
  currentExamSession = buildExamSession(config);
  currentExamResult = null;
  return currentExamSession;
};

export const getExamSession = (): ExamSession | null => currentExamSession;

export const updateExamSession = (session: ExamSession) => {
  currentExamSession = session;
};

export const completeExamSession = (session: ExamSession): ExamResult => {
  currentExamSession = {
    ...session,
    completed: true,
  };

  currentExamResult = buildExamResult(currentExamSession.questions);
  return currentExamResult;
};

export const getExamResult = (): ExamResult | null => currentExamResult;

export const clearExamRuntime = () => {
  currentExamSession = null;
  currentExamResult = null;
};