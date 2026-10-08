"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Brain, RefreshCw } from "lucide-react";
import QuizArena from "@/components/QuizArena";
import { loadLocalProgress } from "@/lib/local-progress";
import type { Question } from "@/lib/types";

export default function WeakQuiz({ questions }: { questions: Question[] }) {
  const [weak, setWeak] = useState<Question[] | null>(null);

  useEffect(() => {
    const progress = loadLocalProgress();
    const scored = questions
      .map((q) => ({ q, stat: progress.questionStats[q.id] }))
      .filter(({ stat }) => stat && (stat.wrong > 0 || !stat.lastCorrect))
      .sort((a, b) => (b.stat!.wrong - b.stat!.correct) - (a.stat!.wrong - a.stat!.correct));
    setWeak(scored.map(({ q }) => q));
  }, [questions]);

  if (weak === null) return <div className="mx-auto mt-16 h-60 max-w-4xl animate-pulse rounded-3xl bg-white/[0.025]" />;

  if (!weak.length) {
    return (
      <section className="mx-auto max-w-3xl py-20 text-center">
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-3xl border border-violet-400/15 bg-violet-400/[0.06]"><Brain className="h-7 w-7 text-violet-300" /></div>
        <h1 className="mt-6 text-4xl font-black tracking-tight text-white">No weak questions yet.</h1>
        <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-zinc-500">Finish any week or mix run first. Every miss gets automatically ranked here for targeted repetition.</p>
        <Link href="/weeks" className="primary-button mt-6"><RefreshCw className="h-4 w-4" />Start a run</Link>
      </section>
    );
  }

  return <QuizArena questions={weak} title={`${weak.length} weak questions`} subtitle="Ordered from most troublesome, then shuffled each run." mode="weak" />;
}
