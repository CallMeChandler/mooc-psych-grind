export type Option = {
  key: "A" | "B" | "C" | "D";
  text: string;
};

export type Question = {
  id: string;
  week: number;
  assignment: number;
  number: number;
  question: string;
  options: Option[];
  answer: Option["key"];
  official: boolean;
};

export type QuestionResult = {
  id: string;
  selected: string;
  correct: boolean;
};

export type AttemptPayload = {
  mode: string;
  score: number;
  total: number;
  durationMs: number;
  week?: number;
  questionResults: QuestionResult[];
};

export type LocalQuestionStat = {
  seen: number;
  correct: number;
  wrong: number;
  lastCorrect: boolean;
};

export type LocalHistoryItem = {
  id: string;
  mode: string;
  score: number;
  total: number;
  date: string;
  week?: number;
  durationMs: number;
};

export type LocalProgress = {
  questionStats: Record<string, LocalQuestionStat>;
  history: LocalHistoryItem[];
  totalAttempts: number;
};
