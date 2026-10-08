"use client";

import { signIn } from "next-auth/react";
import { Github, Chrome, ArrowLeft, ShieldCheck } from "lucide-react";
import Link from "next/link";

export default function SignInPanel({
  google,
  github,
  callbackUrl,
}: {
  google: boolean;
  github: boolean;
  callbackUrl: string;
}) {
  return (
    <section className="mx-auto grid min-h-[calc(100vh-130px)] max-w-5xl place-items-center py-12">
      <div className="glass-card w-full max-w-md p-6 sm:p-8">
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl border border-violet-400/15 bg-violet-400/[0.06]">
          <ShieldCheck className="h-6 w-6 text-violet-300" />
        </div>

        <div className="mt-5 text-center">
          <div className="section-kicker">SIGN IN REQUIRED</div>
          <h1 className="mt-2 text-3xl font-black tracking-tight text-white">Unlock the grind.</h1>
          <p className="mt-3 text-sm leading-6 text-zinc-500">
            Sign in once to access weeks, mix mode, exam simulation, weak-question drills,
            stats and the leaderboard.
          </p>
        </div>

        <div className="mt-7 space-y-3">
          {google && (
            <button
              onClick={() => signIn("google", { callbackUrl })}
              className="signin-button"
            >
              <Chrome className="h-4 w-4" />
              Continue with Google
            </button>
          )}

          {github && (
            <button
              onClick={() => signIn("github", { callbackUrl })}
              className="signin-button"
            >
              <Github className="h-4 w-4" />
              Continue with GitHub
            </button>
          )}

          {!google && !github && (
            <div className="rounded-2xl border border-amber-400/10 bg-amber-400/[0.04] p-4 text-sm leading-6 text-amber-100/70">
              OAuth providers are not configured yet. Fill the Google and/or GitHub
              variables in <code>.env</code>, then restart the dev server.
            </div>
          )}
        </div>

        <Link
          href="/"
          className="mt-6 flex items-center justify-center gap-2 text-xs font-bold text-zinc-600 transition hover:text-zinc-300"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to home
        </Link>
      </div>
    </section>
  );
}
