"use client";

import { useState } from "react";
import { Dices, RotateCw } from "lucide-react";
import QuizArena from "@/components/QuizArena";
import type { Question } from "@/lib/types";
import { shuffle } from "@/lib/utils";

const COUNTS = [10, 25, 50, 120];

export default function MixBuilder({ questions }: { questions: Question[] }) {
  const [count, setCount] = useState(25);
  const [run, setRun] = useState<Question[] | null>(null);
  const [runId, setRunId] = useState(0);

  function start() {
    setRun(shuffle(questions).slice(0, count));
    setRunId((id) => id + 1);
  }

  if (run) {
    return (
      <div>
        <div className="mx-auto flex max-w-4xl justify-end pt-4">
          <button onClick={() => setRun(null)} className="secondary-button"><RotateCw className="h-4 w-4" />Change mix size</button>
        </div>
        <QuizArena key={runId} questions={run} title={`${count}-question chaos run`} subtitle="Pulled randomly from all 12 weeks." mode="mix" shuffleQuestions={false} />
      </div>
    );
  }

  return (
    <section className="mx-auto max-w-4xl py-12 sm:py-16">
      <div className="section-kicker">MIX MODE</div>
      <h1 className="mt-2 text-4xl font-black tracking-[-0.04em] text-white sm:text-6xl">Break the week pattern.</h1>
      <p className="mt-4 max-w-2xl text-base leading-7 text-zinc-500">Random questions across the complete 120-question pool. Instant feedback, no predictable order, much better for actual recall.</p>
      <div className="glass-card mt-8 p-5 sm:p-7">
        <div className="text-xs font-black uppercase tracking-[0.18em] text-zinc-500">Questions in this run</div>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {COUNTS.map((value) => (
            <button key={value} onClick={() => setCount(value)} className={count === value ? "choice-card choice-card-active" : "choice-card"}>
              <span className="text-3xl font-black">{value}</span>
              <span className="mt-1 text-[10px] font-black uppercase tracking-[0.16em] text-zinc-500">questions</span>
            </button>
          ))}
        </div>
        <button onClick={start} className="primary-button mt-6 w-full justify-center py-3.5"><Dices className="h-4 w-4" />Shuffle & start</button>
      </div>
    </section>
  );
}
