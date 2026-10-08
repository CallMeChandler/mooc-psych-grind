"use client";

import { useEffect, useState } from "react";
import { Crown, Medal, RefreshCw, Trophy } from "lucide-react";
import type { LeaderboardMetric } from "@/lib/store";

const tabs: Array<{ key: LeaderboardMetric; label: string }> = [
  { key: "xp", label: "XP" },
  { key: "mastery", label: "Mastery" },
  { key: "accuracy", label: "Accuracy" },
  { key: "attempts", label: "Attempts" },
];

type Row = {
  rank: number;
  email: string;
  name: string;
  image: string;
  xp: number;
  attempts: number;
  accuracy: number;
  mastery: number;
  bestExam: number;
};

export default function LeaderboardClient() {
  const [metric, setMetric] = useState<LeaderboardMetric>("xp");
  const [rows, setRows] = useState<Row[]>([]);
  const [enabled, setEnabled] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/leaderboard?metric=${metric}`)
      .then((r) => r.json())
      .then((data) => {
        setEnabled(Boolean(data.enabled));
        setRows(data.rows ?? []);
      })
      .catch(() => setRows([]))
      .finally(() => setLoading(false));
  }, [metric]);

  return (
    <section className="mx-auto max-w-5xl py-10 sm:py-16">
      <div className="section-kicker">GLOBAL ARENA</div>
      <div className="mt-2 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-4xl font-black tracking-[-0.04em] text-white sm:text-6xl">Leaderboard.</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-500">Sign-in runs count globally. XP rewards correct answers, perfect runs, and exam simulations.</p>
        </div>
        <Trophy className="hidden h-12 w-12 text-violet-300 sm:block" />
      </div>

      <div className="mt-8 flex flex-wrap gap-2">
        {tabs.map((tab) => (
          <button key={tab.key} onClick={() => setMetric(tab.key)} className={metric === tab.key ? "tab-button tab-button-active" : "tab-button"}>{tab.label}</button>
        ))}
      </div>

      {!enabled ? (
        <div className="glass-card mt-6 p-8 text-center">
          <RefreshCw className="mx-auto h-7 w-7 text-zinc-600" />
          <h2 className="mt-4 text-xl font-black text-white">Leaderboard is in local-only mode.</h2>
          <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-zinc-500">Fill `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` in your environment and redeploy. Everything else already works.</p>
        </div>
      ) : loading ? (
        <div className="mt-6 h-80 animate-pulse rounded-3xl bg-white/[0.025]" />
      ) : rows.length === 0 ? (
        <div className="glass-card mt-6 p-10 text-center text-zinc-500">No ranked runs yet. First signed-in finisher gets the crown.</div>
      ) : (
        <div className="mt-6 space-y-3">
          {rows.map((row) => (
            <div key={row.email} className="leader-row">
              <div className="grid h-10 w-10 place-items-center rounded-xl border border-white/5 bg-black/20 font-black text-zinc-500">
                {row.rank === 1 ? <Crown className="h-5 w-5 text-amber-300" /> : row.rank <= 3 ? <Medal className="h-5 w-5 text-violet-300" /> : `#${row.rank}`}
              </div>
              {row.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={row.image} alt="" className="h-10 w-10 rounded-xl border border-white/10 object-cover" />
              ) : <div className="grid h-10 w-10 place-items-center rounded-xl bg-violet-500/10 text-xs font-black text-violet-200">{row.name.slice(0, 2).toUpperCase()}</div>}
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-bold text-zinc-200">{row.name}</div>
                <div className="mt-0.5 text-[10px] text-zinc-600">{row.mastery}/120 mastered · best exam {row.bestExam}/75</div>
              </div>
              <div className="hidden text-right sm:block">
                <div className="text-xs font-bold text-zinc-300">{row.accuracy.toFixed(1)}%</div>
                <div className="text-[10px] text-zinc-600">accuracy</div>
              </div>
              <div className="w-24 text-right">
                <div className="text-lg font-black text-white">{metric === "accuracy" ? `${row.accuracy.toFixed(1)}%` : metric === "mastery" ? row.mastery : metric === "attempts" ? row.attempts : row.xp.toLocaleString()}</div>
                <div className="text-[9px] font-black uppercase tracking-[0.14em] text-zinc-600">{metric}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
