import rawQuestions from "@/data/questions.json";
import type { Question } from "@/lib/types";

export const questions = rawQuestions as Question[];

export function getWeekQuestions(week: number) {
  return questions.filter((q) => q.week === week);
}

export function getQuestionById(id: string) {
  return questions.find((q) => q.id === id);
}

export const weekMeta = Array.from({ length: 12 }, (_, i) => {
  const week = i + 1;
  return {
    week,
    count: questions.filter((q) => q.week === week).length,
    official: week !== 12,
  };
});
