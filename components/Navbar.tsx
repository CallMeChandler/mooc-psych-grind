"use client";

import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";
import { BarChart3, LogIn, LogOut, Shield, Sparkles, Trophy } from "lucide-react";
import { initials } from "@/lib/utils";

export default function Navbar() {
  const { data: session, status } = useSession();

  return (
    <header className="sticky top-0 z-50 border-b border-white/5 bg-[#07070a]/70 backdrop-blur-2xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="group flex items-center gap-3">
          <div className="relative grid h-9 w-9 place-items-center rounded-xl border border-violet-400/20 bg-white/[0.05] shadow-glow">
            <Sparkles className="h-4 w-4 text-violet-300 transition-transform group-hover:rotate-12 group-hover:scale-110" />
          </div>
          <div>
            <div className="text-sm font-black tracking-tight text-white">PSYCH GRIND</div>
            <div className="hidden text-[10px] font-semibold uppercase tracking-[0.22em] text-zinc-500 sm:block">120 → 75. Lock in.</div>
          </div>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          <Link className="nav-link" href="/weeks">Weeks</Link>
          <Link className="nav-link" href="/mix">Mix</Link>
          <Link className="nav-link" href="/exam">Exam</Link>
          <Link className="nav-link" href="/weak">Weak Qs</Link>
          <Link className="nav-link flex items-center gap-1.5" href="/leaderboard"><Trophy className="h-3.5 w-3.5" />Leaderboard</Link>
          <Link className="nav-link flex items-center gap-1.5" href="/dashboard"><BarChart3 className="h-3.5 w-3.5" />Stats</Link>
        </nav>

        <div className="flex items-center gap-2">
          {status === "loading" ? (
            <div className="h-9 w-24 animate-pulse rounded-xl bg-white/5" />
          ) : session?.user ? (
            <div className="flex items-center gap-2">
              <Link href="/admin" className="hidden rounded-xl p-2 text-zinc-500 transition hover:bg-white/5 hover:text-zinc-200 sm:block" title="Admin">
                <Shield className="h-4 w-4" />
              </Link>
              <div className="hidden max-w-40 text-right sm:block">
                <div className="truncate text-xs font-bold text-zinc-200">{session.user.name ?? "Player"}</div>
                <div className="truncate text-[10px] text-zinc-500">{session.user.email}</div>
              </div>
              {session.user.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={session.user.image} alt="" className="h-9 w-9 rounded-xl border border-white/10 object-cover" />
              ) : (
                <div className="grid h-9 w-9 place-items-center rounded-xl bg-violet-500/15 text-xs font-black text-violet-200">
                  {initials(session.user.name)}
                </div>
              )}
              <button onClick={() => signOut({ callbackUrl: "/" })} className="icon-button" title="Sign out">
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <button onClick={() => signIn()} className="primary-button !px-3 !py-2 text-xs">
              <LogIn className="h-3.5 w-3.5" /> Sign in
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
