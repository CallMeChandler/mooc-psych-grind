"use client";

import type { AttemptPayload, LocalProgress } from "@/lib/types";

const KEY = "psych-grind-progress-v1";

export const EMPTY_PROGRESS: LocalProgress = {
  questionStats: {},
  history: [],
  totalAttempts: 0,
};

export function loadLocalProgress(): LocalProgress {
  if (typeof window === "undefined") return EMPTY_PROGRESS;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return EMPTY_PROGRESS;
    const parsed = JSON.parse(raw) as LocalProgress;
    return {
      questionStats: parsed.questionStats ?? {},
      history: parsed.history ?? [],
      totalAttempts: parsed.totalAttempts ?? 0,
    };
  } catch {
    return EMPTY_PROGRESS;
  }
}

export function saveAttemptLocally(payload: AttemptPayload) {
  const progress = loadLocalProgress();
  const next = structuredClone(progress);

  for (const result of payload.questionResults) {
    const existing = next.questionStats[result.id] ?? {
      seen: 0,
      correct: 0,
      wrong: 0,
      lastCorrect: false,
    };
    existing.seen += 1;
    if (result.correct) existing.correct += 1;
    else existing.wrong += 1;
    existing.lastCorrect = result.correct;
    next.questionStats[result.id] = existing;
  }

  next.totalAttempts += 1;
  next.history.unshift({
    id: crypto.randomUUID(),
    mode: payload.mode,
    score: payload.score,
    total: payload.total,
    date: new Date().toISOString(),
    week: payload.week,
    durationMs: payload.durationMs,
  });
  next.history = next.history.slice(0, 80);

  window.localStorage.setItem(KEY, JSON.stringify(next));
  window.dispatchEvent(new CustomEvent("psych-grind-progress-updated"));
  return next;
}
