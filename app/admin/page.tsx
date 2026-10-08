import Link from "next/link";
import { getServerSession } from "next-auth";
import { AlertTriangle, BarChart3, Database, ShieldX, Users } from "lucide-react";
import { authOptions, isAdmin } from "@/lib/auth";
import { getQuestionById } from "@/lib/questions";
import { getAdminOverview } from "@/lib/store";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email || !isAdmin(session.user.email)) {
    return (
      <section className="mx-auto grid min-h-[calc(100vh-130px)] max-w-xl place-items-center text-center">
        <div className="glass-card w-full p-8">
          <ShieldX className="mx-auto h-9 w-9 text-rose-300" />
          <h1 className="mt-4 text-2xl font-black text-white">Admin access only.</h1>
          <p className="mt-2 text-sm leading-6 text-zinc-500">Add your signed-in email to `ADMIN_EMAILS` in the environment, separated by commas if there are multiple admins.</p>
          <Link href="/" className="secondary-button mt-5">Back home</Link>
        </div>
      </section>
    );
  }

  const data = await getAdminOverview();
  if (!data.enabled) {
    return (
      <section className="mx-auto max-w-4xl py-16">
        <div className="glass-card p-8 text-center">
          <Database className="mx-auto h-8 w-8 text-violet-300" />
          <h1 className="mt-4 text-3xl font-black text-white">Admin panel is wired, Redis is not.</h1>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-zinc-500">Set the two Upstash Redis REST variables in `.env` or Vercel. Then this page will show users, aggregate attempts, week activity and the most-missed questions.</p>
        </div>
      </section>
    );
  }

  const accuracy = data.global.answers ? Math.round((data.global.correct / data.global.answers) * 100) : 0;
  return (
    <section className="mx-auto max-w-7xl py-10 sm:py-14">
      <div className="section-kicker">ADMIN CONSOLE</div>
      <h1 className="mt-2 text-4xl font-black tracking-[-0.04em] text-white sm:text-5xl">Class pulse.</h1>
      <p className="mt-3 text-sm text-zinc-500">Signed in as {session.user.email}</p>

      <div className="mt-7 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <AdminStat label="Users" value={data.global.users.toLocaleString()} icon={<Users className="h-4 w-4" />} />
        <AdminStat label="Attempts" value={data.global.attempts.toLocaleString()} icon={<BarChart3 className="h-4 w-4" />} />
        <AdminStat label="Answers" value={data.global.answers.toLocaleString()} icon={<Database className="h-4 w-4" />} />
        <AdminStat label="Accuracy" value={`${accuracy}%`} icon={<AlertTriangle className="h-4 w-4" />} />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[.8fr_1.2fr]">
        <div className="glass-card p-5 sm:p-6">
          <div className="section-kicker">WEEK TRAFFIC</div>
          <div className="mt-5 space-y-3">
            {Array.from({ length: 12 }, (_, i) => i + 1).map((week) => {
              const attempts = data.weekAttempts.find((row) => row.week === week)?.attempts ?? 0;
              const max = Math.max(1, ...data.weekAttempts.map((row) => row.attempts));
              return (
                <div key={week}>
                  <div className="mb-1.5 flex justify-between text-xs"><span className="font-bold text-zinc-400">Week {week}</span><span className="text-zinc-600">{attempts}</span></div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-white/5"><div className="h-full rounded-full bg-gradient-to-r from-violet-500 to-cyan-400" style={{ width: `${(attempts / max) * 100}%` }} /></div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="glass-card p-5 sm:p-6">
          <div className="section-kicker">HARDEST QUESTIONS</div>
          <div className="mt-5 space-y-3">
            {data.hardest.length ? data.hardest.map((item) => {
              const q = getQuestionById(item.id);
              return (
                <div key={item.id} className="rounded-2xl border border-white/5 bg-black/20 p-4">
                  <div className="flex items-center justify-between gap-3 text-[10px] font-black uppercase tracking-[0.13em] text-zinc-600">
                    <span>{q ? `Week ${q.week} · Q${q.number}` : item.id}</span>
                    <span className="text-rose-300/80">{item.wrongRate}% wrong · {item.attempts} seen</span>
                  </div>
                  <div className="mt-2 text-sm font-semibold leading-6 text-zinc-300">{q?.question ?? "Question metadata unavailable"}</div>
                </div>
              );
            }) : <div className="text-sm text-zinc-600">No question misses recorded yet.</div>}
          </div>
        </div>
      </div>

      <div className="glass-card mt-6 overflow-hidden">
        <div className="border-b border-white/5 p-5 sm:p-6"><div className="section-kicker">USERS · FIRST 100</div></div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="text-[9px] font-black uppercase tracking-[0.15em] text-zinc-600"><tr><th className="px-6 py-4">User</th><th>Attempts</th><th>Accuracy</th><th>Mastery</th><th>XP</th><th className="pr-6">Last seen</th></tr></thead>
            <tbody className="divide-y divide-white/5">
              {data.users.map((user) => <tr key={user.email} className="text-zinc-400"><td className="px-6 py-4"><div className="font-bold text-zinc-200">{user.name}</div><div className="mt-0.5 text-[10px] text-zinc-600">{user.email}</div></td><td>{user.attempts}</td><td>{user.accuracy.toFixed(1)}%</td><td>{user.mastery}/120</td><td className="font-bold text-zinc-200">{user.xp.toLocaleString()}</td><td className="pr-6 text-xs text-zinc-600">{user.lastSeen ? new Date(user.lastSeen).toLocaleString() : "—"}</td></tr>)}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

function AdminStat({ label, value, icon }: { label: string; value: string; icon: React.ReactNode }) {
  return <div className="glass-card p-4"><div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.16em] text-zinc-600">{icon}{label}</div><div className="mt-2 text-2xl font-black text-white">{value}</div></div>;
}
