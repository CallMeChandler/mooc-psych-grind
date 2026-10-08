"use client";

import { useEffect, useState } from "react";
import { Activity, Users, Zap } from "lucide-react";

type Stats = {
  enabled: boolean;
  attempts: number;
  answers: number;
  correct: number;
  users: number;
  busiestWeek: number | null;
};

export default function GlobalPulse() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    fetch("/api/global-stats")
      .then((r) => r.json())
      .then(setStats)
      .catch(() => null);
  }, []);

  if (!stats) return <div className="h-20 animate-pulse rounded-3xl bg-white/[0.025]" />;

  if (!stats.enabled) {
    return (
      <div className="glass-card flex flex-col gap-2 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="text-sm font-bold text-zinc-200">Global stats are ready to go.</div>
          <div className="mt-1 text-xs text-zinc-500">Add the two Upstash Redis env values to turn on shared analytics + leaderboard.</div>
        </div>
        <span className="status-pill">LOCAL MODE</span>
      </div>
    );
  }

  const accuracy = stats.answers ? Math.round((stats.correct / stats.answers) * 100) : 0;
  return (
    <div className="glass-card grid grid-cols-2 gap-3 p-3 sm:grid-cols-4">
      <PulseStat icon={<Activity className="h-4 w-4" />} label="Attempts" value={stats.attempts.toLocaleString()} />
      <PulseStat icon={<Users className="h-4 w-4" />} label="Players" value={stats.users.toLocaleString()} />
      <PulseStat icon={<Zap className="h-4 w-4" />} label="Global accuracy" value={`${accuracy}%`} />
      <PulseStat icon={<span className="font-black">W</span>} label="Most grinded" value={stats.busiestWeek ? `Week ${stats.busiestWeek}` : "—"} />
    </div>
  );
}

function PulseStat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/5 bg-black/20 px-4 py-3">
      <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.16em] text-zinc-600">{icon}{label}</div>
      <div className="mt-2 text-xl font-black tracking-tight text-zinc-100">{value}</div>
    </div>
  );
}
