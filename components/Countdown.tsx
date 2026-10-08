"use client";

import { useEffect, useState } from "react";

function getRemaining() {
  const raw = process.env.NEXT_PUBLIC_EXAM_DATE || "2026-10-17T00:00:00+05:30";
  const diff = Math.max(0, new Date(raw).getTime() - Date.now());
  return {
    days: Math.floor(diff / 86_400_000),
    hours: Math.floor((diff % 86_400_000) / 3_600_000),
    minutes: Math.floor((diff % 3_600_000) / 60_000),
    seconds: Math.floor((diff % 60_000) / 1000),
  };
}

export default function Countdown() {
  const [remaining, setRemaining] = useState(getRemaining());

  useEffect(() => {
    const timer = window.setInterval(() => setRemaining(getRemaining()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <div className="flex items-center gap-2 sm:gap-3">
      {Object.entries(remaining).map(([label, value]) => (
        <div key={label} className="min-w-[54px] rounded-2xl border border-white/10 bg-white/[0.035] px-2.5 py-2.5 text-center backdrop-blur-xl sm:min-w-[66px]">
          <div className="font-mono text-xl font-black tracking-tight text-white sm:text-2xl">{String(value).padStart(2, "0")}</div>
          <div className="mt-0.5 text-[8px] font-black uppercase tracking-[0.2em] text-zinc-500">{label}</div>
        </div>
      ))}
    </div>
  );
}
