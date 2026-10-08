"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Check, Clock3, RotateCcw, Sparkles, Trophy, X, Zap } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { saveAttemptLocally } from "@/lib/local-progress";
import type { AttemptPayload, Question } from "@/lib/types";
import { cn, formatDuration, shuffle } from "@/lib/utils";

export default function QuizArena({
  questions: sourceQuestions,
  title,
  subtitle,
  mode,
  week,
  immediateFeedback = true,
  shuffleQuestions = true,
}: {
  questions: Question[];
  title: string;
  subtitle?: string;
  mode: string;
  week?: number;
  immediateFeedback?: boolean;
  shuffleQuestions?: boolean;
}) {
  const [questions, setQuestions] = useState(sourceQuestions);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [finished, setFinished] = useState(false);
  const [startedAt, setStartedAt] = useState(() => Date.now());
  const [finishedAt, setFinishedAt] = useState<number | null>(null);
  const [synced, setSynced] = useState<"idle" | "saving" | "saved" | "local">("idle");

  const resetQuiz = useCallback(() => {
    setQuestions(shuffleQuestions ? shuffle(sourceQuestions) : [...sourceQuestions]);
    setIndex(0);
    setAnswers({});
    setFinished(false);
    setStartedAt(Date.now());
    setFinishedAt(null);
    setSynced("idle");
  }, [shuffleQuestions, sourceQuestions]);

  useEffect(() => {
    if (shuffleQuestions) setQuestions(shuffle(sourceQuestions));
  }, [shuffleQuestions, sourceQuestions]);

  const current = questions[index];
  const selected = current ? answers[current.id] : undefined;
  const locked = immediateFeedback && Boolean(selected);
  const progress = questions.length ? ((index + (finished ? 1 : 0)) / questions.length) * 100 : 0;

  const score = useMemo(
    () => questions.reduce((sum, q) => sum + (answers[q.id] === q.answer ? 1 : 0), 0),
    [answers, questions],
  );

  const choose = useCallback(
    (key: string) => {
      if (!current || (immediateFeedback && answers[current.id])) return;
      setAnswers((prev) => ({ ...prev, [current.id]: key }));
    },
    [answers, current, immediateFeedback],
  );

  const finishQuiz = useCallback(async () => {
    const end = Date.now();
    setFinishedAt(end);
    setFinished(true);
    const computedScore = questions.reduce((sum, q) => sum + (answers[q.id] === q.answer ? 1 : 0), 0);
    const payload: AttemptPayload = {
      mode,
      score: computedScore,
      total: questions.length,
      durationMs: end - startedAt,
      week,
      questionResults: questions.map((q) => ({ id: q.id, selected: answers[q.id] ?? "", correct: answers[q.id] === q.answer })),
    };
    saveAttemptLocally(payload);
    setSynced("saving");
    try {
      const response = await fetch("/api/attempts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await response.json();
      setSynced(json.persisted ? "saved" : "local");
    } catch {
      setSynced("local");
    }
  }, [answers, mode, questions, startedAt, week]);

  const advance = useCallback(() => {
    if (!current || !answers[current.id]) return;
    if (index === questions.length - 1) void finishQuiz();
    else setIndex((i) => i + 1);
  }, [answers, current, finishQuiz, index, questions.length]);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (finished || !current) return;
      const numeric = Number(event.key);
      if (numeric >= 1 && numeric <= current.options.length) choose(current.options[numeric - 1].key);
      if (event.key === "Enter" && answers[current.id]) advance();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [advance, answers, choose, current, finished]);

  if (!questions.length) {
    return <div className="glass-card p-8 text-center text-zinc-400">No questions available for this mode yet.</div>;
  }

  if (finished) {
    const percent = Math.round((score / questions.length) * 100);
    const wrong = questions.filter((q) => answers[q.id] !== q.answer);
    return (
      <section className="mx-auto max-w-4xl py-8">
        {score === questions.length && <PerfectBurst />}
        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="glass-card relative overflow-hidden p-6 sm:p-10">
          <div className="absolute -right-16 -top-20 h-56 w-56 rounded-full bg-violet-500/10 blur-3xl" />
          <div className="relative">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="section-kicker">RUN COMPLETE</div>
                <h1 className="mt-2 text-4xl font-black tracking-[-0.04em] text-white sm:text-5xl">{percent}% locked in.</h1>
                <p className="mt-3 max-w-xl text-sm leading-6 text-zinc-500">
                  {percent >= 90 ? "You are cooking. Keep the recall loop hot." : percent >= 70 ? "Solid. One more pass on the misses and this jumps fast." : "Good diagnostic run. The weak-question mode now knows exactly what to attack."}
                </p>
              </div>
              <div className="score-orb">
                <div className="text-4xl font-black text-white">{score}</div>
                <div className="text-[10px] font-black uppercase tracking-[0.18em] text-zinc-500">of {questions.length}</div>
              </div>
            </div>

            <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
              <ResultStat label="Accuracy" value={`${percent}%`} />
              <ResultStat label="Wrong" value={String(questions.length - score)} />
              <ResultStat label="Time" value={formatDuration((finishedAt ?? Date.now()) - startedAt)} />
              <ResultStat label="Sync" value={synced === "saved" ? "Global" : synced === "saving" ? "Saving…" : "Local"} />
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <button onClick={resetQuiz} className="primary-button"><RotateCcw className="h-4 w-4" />Run it again</button>
              <Link href="/weak" className="secondary-button"><Zap className="h-4 w-4" />Drill weak questions</Link>
              <Link href="/weeks" className="secondary-button"><ArrowLeft className="h-4 w-4" />Back to weeks</Link>
            </div>
          </div>
        </motion.div>

        {wrong.length > 0 && (
          <div className="mt-6 glass-card p-5 sm:p-7">
            <div className="flex items-center justify-between gap-4">
              <div>
                <div className="section-kicker">REVIEW QUEUE</div>
                <h2 className="mt-1 text-xl font-black text-white">The {wrong.length} that got away</h2>
              </div>
              <div className="rounded-full bg-rose-500/10 px-3 py-1 text-xs font-bold text-rose-300">auto-saved to weak mode</div>
            </div>
            <div className="mt-5 space-y-3">
              {wrong.map((q) => (
                <div key={q.id} className="rounded-2xl border border-white/5 bg-black/20 p-4">
                  <div className="text-[10px] font-black uppercase tracking-[0.16em] text-zinc-600">Week {q.week} · Q{q.number}</div>
                  <div className="mt-2 text-sm font-semibold leading-6 text-zinc-200">{q.question}</div>
                  <div className="mt-3 flex flex-wrap gap-2 text-xs">
                    <span className="rounded-lg bg-rose-500/10 px-2.5 py-1 text-rose-300">You: {answers[q.id] || "—"}</span>
                    <span className="rounded-lg bg-emerald-500/10 px-2.5 py-1 text-emerald-300">Correct: {q.answer}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-4xl py-6 sm:py-10">
      <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="section-kicker">{mode.toUpperCase()} MODE</div>
          <h1 className="mt-1 text-2xl font-black tracking-tight text-white sm:text-3xl">{title}</h1>
          {subtitle && <p className="mt-1 text-sm text-zinc-500">{subtitle}</p>}
        </div>
        <div className="flex items-center gap-2 text-xs font-bold text-zinc-500">
          <Clock3 className="h-3.5 w-3.5" />
          <LiveTimer startedAt={startedAt} />
          <span className="text-zinc-700">•</span>
          <span>{index + 1}/{questions.length}</span>
        </div>
      </div>

      {!current.official && (
        <div className="mb-4 rounded-2xl border border-amber-400/15 bg-amber-400/[0.05] px-4 py-3 text-xs leading-5 text-amber-200/80">
          Week 12 answers are provisional in the supplied PDF: they are submitted answers, not the released official key.
        </div>
      )}

      <div className="mb-5 h-1.5 overflow-hidden rounded-full bg-white/5">
        <motion.div className="h-full rounded-full bg-gradient-to-r from-violet-500 via-cyan-400 to-fuchsia-400" animate={{ width: `${Math.max(progress, ((index + 1) / questions.length) * 100)}%` }} transition={{ type: "spring", stiffness: 140, damping: 25 }} />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={current.id}
          initial={{ opacity: 0, x: 20, scale: 0.99 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: -20, scale: 0.99 }}
          transition={{ duration: 0.22 }}
          className="quiz-shell"
        >
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="question-chip">W{current.week}</span>
              <span className="question-chip">Q{current.number}</span>
              {!immediateFeedback && <span className="question-chip text-cyan-300">EXAM RULES</span>}
            </div>
            <div className="hidden text-[10px] font-black uppercase tracking-[0.16em] text-zinc-700 sm:block">Keys 1–4 · Enter</div>
          </div>

          <h2 className="mt-7 text-xl font-bold leading-8 tracking-[-0.015em] text-zinc-100 sm:text-2xl sm:leading-9">{current.question}</h2>

          <div className="mt-7 grid gap-3">
            {current.options.map((option, optionIndex) => {
              const isSelected = selected === option.key;
              const isCorrect = option.key === current.answer;
              const revealCorrect = immediateFeedback && Boolean(selected) && isCorrect;
              const revealWrong = immediateFeedback && isSelected && !isCorrect;
              return (
                <motion.button
                  whileHover={!locked ? { scale: 1.008, x: 3 } : undefined}
                  whileTap={!locked ? { scale: 0.995 } : undefined}
                  key={option.key}
                  onClick={() => choose(option.key)}
                  className={cn(
                    "answer-option",
                    isSelected && !immediateFeedback && "answer-selected",
                    revealCorrect && "answer-correct",
                    revealWrong && "answer-wrong",
                  )}
                >
                  <span className="answer-letter">{option.key}</span>
                  <span className="flex-1 text-left text-sm font-semibold leading-6 sm:text-base">{option.text}</span>
                  <span className="ml-auto text-[10px] font-mono text-zinc-700">{optionIndex + 1}</span>
                  {revealCorrect && <Check className="h-5 w-5 text-emerald-300" />}
                  {revealWrong && <X className="h-5 w-5 text-rose-300" />}
                </motion.button>
              );
            })}
          </div>

          <AnimatePresence>
            {immediateFeedback && selected && (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className={cn("mt-5 rounded-2xl border px-4 py-3 text-sm font-semibold", selected === current.answer ? "border-emerald-400/15 bg-emerald-400/[0.05] text-emerald-200" : "border-rose-400/15 bg-rose-400/[0.05] text-rose-200")}>
                {selected === current.answer ? (
                  <span className="flex items-center gap-2"><Sparkles className="h-4 w-4" />Correct. Burn that association in.</span>
                ) : (
                  <span>Not this one. Correct answer: <strong>{current.answer}. {current.options.find((o) => o.key === current.answer)?.text}</strong></span>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          <div className="mt-7 flex items-center justify-between border-t border-white/5 pt-5">
            <div className="text-xs text-zinc-600">
              {immediateFeedback ? "Answer is locked after your first click." : "No answer reveal until the run ends."}
            </div>
            <button disabled={!selected} onClick={advance} className="primary-button disabled:cursor-not-allowed disabled:opacity-30">
              {index === questions.length - 1 ? <><Trophy className="h-4 w-4" />Finish</> : <>Next<ArrowRight className="h-4 w-4" /></>}
            </button>
          </div>
        </motion.div>
      </AnimatePresence>
    </section>
  );
}

function LiveTimer({ startedAt }: { startedAt: number }) {
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, []);
  return <span>{formatDuration(now - startedAt)}</span>;
}

function ResultStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/5 bg-black/20 p-4">
      <div className="text-[9px] font-black uppercase tracking-[0.18em] text-zinc-600">{label}</div>
      <div className="mt-1 text-lg font-black text-zinc-100">{value}</div>
    </div>
  );
}

function PerfectBurst() {
  return (
    <div className="pointer-events-none fixed inset-0 z-[60] overflow-hidden" aria-hidden="true">
      {Array.from({ length: 36 }, (_, i) => (
        <span key={i} className="confetti" style={{ left: `${(i * 37) % 100}%`, animationDelay: `${(i % 9) * 0.08}s`, animationDuration: `${2.2 + (i % 5) * 0.2}s` }} />
      ))}
    </div>
  );
}
