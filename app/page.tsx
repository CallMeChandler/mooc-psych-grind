import Link from "next/link";
import { ArrowRight, Brain, Dices, Gauge, ShieldCheck, Shuffle, Sparkles, Target, Trophy, Zap } from "lucide-react";
import Countdown from "@/components/Countdown";
import GlobalPulse from "@/components/GlobalPulse";
import ModeCard from "@/components/ModeCard";

export default function Home() {
  return (
    <div className="mx-auto max-w-7xl pb-16">
      <section className="relative grid min-h-[680px] items-center gap-10 py-16 lg:grid-cols-[1.2fr_.8fr] lg:py-20">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-violet-400/15 bg-violet-400/[0.06] px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-violet-200">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-300" /> 120 question pool · 75 in the exam
          </div>
          <h1 className="mt-7 max-w-4xl text-6xl font-black leading-[0.92] tracking-[-0.065em] text-white sm:text-7xl lg:text-[92px]">
            Don&apos;t study it.<br />
            <span className="gradient-text">Pattern-lock it.</span>
          </h1>
          <p className="mt-7 max-w-2xl text-base leading-7 text-zinc-500 sm:text-lg">
            Grind every released Psychology of Learning MCQ week-by-week, break memorization order with mix mode, then simulate the exact 75-question draw.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/weeks" className="primary-button py-3"><Zap className="h-4 w-4" />Start Week 1<ArrowRight className="h-4 w-4" /></Link>
            <Link href="/exam" className="secondary-button py-3"><Target className="h-4 w-4" />Simulate 75</Link>
          </div>
          <div className="mt-9 flex flex-wrap gap-x-6 gap-y-3 text-xs font-semibold text-zinc-600">
            <span className="flex items-center gap-2"><ShieldCheck className="h-3.5 w-3.5 text-emerald-400/70" />Sign in required to practice</span>
            <span className="flex items-center gap-2"><Sparkles className="h-3.5 w-3.5 text-violet-400/70" />Instant answer feedback</span>
            <span className="flex items-center gap-2"><Trophy className="h-3.5 w-3.5 text-amber-400/70" />OAuth leaderboard</span>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-lg lg:ml-auto">
          <div className="absolute -inset-14 rounded-full bg-violet-500/10 blur-3xl" />
          <div className="hero-panel relative overflow-hidden p-5 sm:p-7">
            <div className="flex items-center justify-between">
              <div>
                <div className="section-kicker">EXAM COUNTDOWN</div>
                <div className="mt-1 text-xl font-black text-white">17 October 2026</div>
              </div>
              <div className="live-badge"><span />LOCK IN</div>
            </div>
            <div className="mt-6"><Countdown /></div>
            <div className="mt-7 rounded-3xl border border-white/5 bg-black/30 p-5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-zinc-400">Pool coverage target</span>
                <span className="font-black text-white">120 / 120</span>
              </div>
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/5"><div className="h-full w-full rounded-full bg-gradient-to-r from-violet-500 via-cyan-400 to-fuchsia-400" /></div>
              <div className="mt-5 grid grid-cols-3 gap-2">
                <Mini label="Weeks" value="12" />
                <Mini label="Per week" value="10" />
                <Mini label="Exam" value="75" />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-3 rounded-2xl border border-amber-400/10 bg-amber-400/[0.035] px-4 py-3 text-[11px] leading-5 text-amber-200/60">
              <Brain className="h-4 w-4 shrink-0" />Week 12 uses submitted answers in the supplied source; its official portal key was not released yet.
            </div>
          </div>
        </div>
      </section>

      <GlobalPulse />

      <section className="py-16">
        <div className="flex items-end justify-between gap-6">
          <div>
            <div className="section-kicker">CHOOSE YOUR DAMAGE</div>
            <h2 className="mt-2 text-3xl font-black tracking-tight text-white sm:text-4xl">Four ways to force recall.</h2>
          </div>
          <Link href="/dashboard" className="hidden text-xs font-bold text-zinc-500 transition hover:text-white sm:flex sm:items-center sm:gap-1">View my stats<ArrowRight className="h-3.5 w-3.5" /></Link>
        </div>
        <div className="mt-7 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <ModeCard href="/weeks" icon={Gauge} eyebrow="01 · Foundation" title="Week Grind" description="Ten questions at a time. Instant feedback and repeat until the answer pattern is automatic." stat="12 × 10 questions" />
          <ModeCard href="/mix" icon={Dices} eyebrow="02 · Recall" title="Chaos Mix" description="Destroy sequence memory. Pull 10, 25, 50, or all 120 from every week in random order." stat="10 / 25 / 50 / 120" />
          <ModeCard href="/exam" icon={Target} eyebrow="03 · Simulation" title="75-Question Exam" description="A random 75-question draw with answer reveals disabled until the run is finished." stat="exam-like pressure" />
          <ModeCard href="/weak" icon={Brain} eyebrow="04 · Repair" title="Weak Question Drill" description="Your misses automatically become a personal high-priority revision queue on this device." stat="adaptive local queue" />
        </div>
      </section>

      <section className="glass-card relative overflow-hidden px-6 py-10 sm:px-10 sm:py-12">
        <div className="absolute -right-20 -top-24 h-64 w-64 rounded-full bg-cyan-400/10 blur-3xl" />
        <div className="relative grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <div className="section-kicker">FINAL LOOP</div>
            <h2 className="mt-2 max-w-3xl text-3xl font-black tracking-[-0.035em] text-white sm:text-5xl">Week → Mix → Weak Qs → Exam. Repeat.</h2>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-zinc-500">The site keeps personal performance on-device while authenticated runs sync to Upstash for class-wide rankings and admin analytics.</p>
          </div>
          <Link href="/mix" className="primary-button py-3.5"><Shuffle className="h-4 w-4" />Start chaos mode<ArrowRight className="h-4 w-4" /></Link>
        </div>
      </section>
    </div>
  );
}

function Mini({ label, value }: { label: string; value: string }) {
  return <div className="rounded-2xl bg-white/[0.025] p-3 text-center"><div className="text-xl font-black text-white">{value}</div><div className="mt-1 text-[8px] font-black uppercase tracking-[0.16em] text-zinc-600">{label}</div></div>;
}
