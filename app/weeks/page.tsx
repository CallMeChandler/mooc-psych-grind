import Link from "next/link";
import { ArrowUpRight, BookOpen, LockKeyhole } from "lucide-react";
import { weekMeta } from "@/lib/questions";

export default function WeeksPage() {
  return (
    <section className="mx-auto max-w-6xl py-10 sm:py-16">
      <div className="section-kicker">WEEK-BY-WEEK</div>
      <h1 className="mt-2 text-4xl font-black tracking-[-0.04em] text-white sm:text-6xl">Twelve clean batches.</h1>
      <p className="mt-4 max-w-2xl text-sm leading-6 text-zinc-500">Each run has exactly the ten MCQs from that assignment. Feedback appears immediately after your first answer.</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {weekMeta.map((item) => (
          <Link href={`/practice/${item.week}`} key={item.week} className="week-card group">
            <div className="flex items-start justify-between">
              <div className="grid h-10 w-10 place-items-center rounded-xl border border-white/10 bg-white/[0.04]"><BookOpen className="h-4 w-4 text-zinc-400" /></div>
              <ArrowUpRight className="h-4 w-4 text-zinc-700 transition group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-white" />
            </div>
            <div className="mt-7 text-4xl font-black tracking-[-0.05em] text-white">{String(item.week).padStart(2, "0")}</div>
            <div className="mt-1 text-sm font-bold text-zinc-400">Assignment {item.week}</div>
            <div className="mt-5 flex items-center justify-between text-[10px] font-black uppercase tracking-[0.13em] text-zinc-600">
              <span>{item.count} questions</span>
              {item.official ? <span className="text-emerald-400/60">released key</span> : <span className="flex items-center gap-1 text-amber-300/70"><LockKeyhole className="h-3 w-3" />provisional</span>}
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
