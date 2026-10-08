"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Brain, Flame, History, Target, Trophy, Zap } from "lucide-react";
import { EMPTY_PROGRESS, loadLocalProgress } from "@/lib/local-progress";
import type { LocalProgress, Question } from "@/lib/types";
import { formatDuration } from "@/lib/utils";

export default function LocalDashboard({ questions }: { questions: Question[] }) {
  const [progress, setProgress] = useState<LocalProgress>(EMPTY_PROGRESS);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const update = () => {
      setProgress(loadLocalProgress());
      setReady(true);
    };
    update();
    window.addEventListener("psych-grind-progress-updated", update);
    return () => window.removeEventListener("psych-grind-progress-updated", update);
  }, []);

  const stats = useMemo(() => {
    const entries = Object.values(progress.questionStats);
    const seenQuestions = entries.filter((s) => s.seen > 0).length;
    const mastered = entries.filter((s) => s.correct > 0).length;
    const totalAnswered = entries.reduce((sum, s) => sum + s.seen, 0);
    const totalCorrect = entries.reduce((sum, s) => sum + s.correct, 0);
    const weak = entries.filter((s) => s.wrong > 0 && !s.lastCorrect).length;
    const accuracy = totalAnswered ? Math.round((totalCorrect / totalAnswered) * 100) : 0;
    return { seenQuestions, mastered, totalAnswered, totalCorrect, weak, accuracy };
  }, [progress]);

  const weekRows = useMemo(() => Array.from({ length: 12 }, (_, i) => {
    const week = i + 1;
    const ids = questions.filter((q) => q.week === week).map((q) => q.id);
    const weekStats = ids.map((id) => progress.questionStats[id]).filter(Boolean);
    const seen = weekStats.reduce((sum, s) => sum + s.seen, 0);
    const correct = weekStats.reduce((sum, s) => sum + s.correct, 0);
    const mastered = weekStats.filter((s) => s.correct > 0).length;
    return {
      week,
      accuracy: seen ? Math.round((correct / seen) * 100) : 0,
      mastered,
      attempts: progress.history.filter((h) => h.week === week).length,
    };
  }), [progress, questions]);

  if (!ready) return <div className="mx-auto mt-14 h-96 max-w-6xl animate-pulse rounded-3xl bg-white/[0.025]" />;

  return (
    <section className="mx-auto max-w-6xl py-10 sm:py-14">
      <div className="section-kicker">YOUR MEMORY MAP</div>
      <div className="mt-2 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-4xl font-black tracking-[-0.04em] text-white sm:text-5xl">Progress that lives on this device.</h1>
          <p className="mt-3 text-sm leading-6 text-zinc-500">No login required for personal stats. Sign in only if you want your runs on the global leaderboard.</p>
        </div>
        <Link href="/weak" className="primary-button"><Zap className="h-4 w-4" />Attack {stats.weak} weak</Link>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-3 lg:grid-cols-5">
        <Stat icon={<Target className="h-4 w-4" />} label="Accuracy" value={`${stats.accuracy}%`} />
        <Stat icon={<Brain className="h-4 w-4" />} label="Seen" value={`${stats.seenQuestions}/120`} />
        <Stat icon={<Trophy className="h-4 w-4" />} label="Mastered" value={`${stats.mastered}/120`} />
        <Stat icon={<Flame className="h-4 w-4" />} label="Attempts" value={String(progress.totalAttempts)} />
        <Stat icon={<Zap className="h-4 w-4" />} label="Weak now" value={String(stats.weak)} />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.4fr_.8fr]">
        <div className="glass-card p-5 sm:p-7">
          <div className="flex items-center justify-between">
            <div>
              <div className="section-kicker">WEEK HEATMAP</div>
              <h2 className="mt-1 text-xl font-black text-white">Where the recall is sticking</h2>
            </div>
            <div className="text-xs text-zinc-600">accuracy / mastery</div>
          </div>
          <div className="mt-6 space-y-4">
            {weekRows.map((row) => (
              <Link href={`/practice/${row.week}`} key={row.week} className="group block">
                <div className="mb-2 flex items-center justify-between text-xs">
                  <span className="font-bold text-zinc-300 group-hover:text-white">Week {row.week}{row.week === 12 ? " · provisional key" : ""}</span>
                  <span className="text-zinc-600">{row.accuracy}% · {row.mastered}/10 mastered</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-white/5">
                  <div className="h-full rounded-full bg-gradient-to-r from-violet-500 to-cyan-400 transition-all group-hover:brightness-125" style={{ width: `${row.accuracy}%` }} />
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="glass-card p-5 sm:p-7">
          <div className="flex items-center gap-2"><History className="h-4 w-4 text-violet-300" /><div className="section-kicker">RECENT RUNS</div></div>
          <div className="mt-5 space-y-3">
            {progress.history.length ? progress.history.slice(0, 8).map((item) => (
              <div key={item.id} className="rounded-2xl border border-white/5 bg-black/20 p-3.5">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <div className="text-xs font-black uppercase tracking-[0.12em] text-zinc-300">{item.week ? `Week ${item.week}` : item.mode}</div>
                    <div className="mt-1 text-[10px] text-zinc-600">{new Date(item.date).toLocaleString()} · {formatDuration(item.durationMs)}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-black text-white">{item.score}/{item.total}</div>
                    <div className="text-[10px] text-zinc-600">{Math.round((item.score / item.total) * 100)}%</div>
                  </div>
                </div>
              </div>
            )) : (
              <div className="rounded-2xl border border-dashed border-white/10 p-6 text-center text-sm text-zinc-600">No attempts yet. Your first run shows up here.</div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="glass-card p-4">
      <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.16em] text-zinc-600">{icon}{label}</div>
      <div className="mt-2 text-2xl font-black tracking-tight text-white">{value}</div>
    </div>
  );
}
