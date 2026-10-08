import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { ArrowUpRight } from "lucide-react";

export default function ModeCard({
  href,
  icon: Icon,
  eyebrow,
  title,
  description,
  stat,
}: {
  href: string;
  icon: LucideIcon;
  eyebrow: string;
  title: string;
  description: string;
  stat: string;
}) {
  return (
    <Link href={href} className="mode-card group">
      <div className="flex items-start justify-between">
        <div className="grid h-11 w-11 place-items-center rounded-2xl border border-white/10 bg-white/[0.05] text-zinc-200 transition group-hover:scale-110 group-hover:border-violet-400/30 group-hover:text-violet-200">
          <Icon className="h-5 w-5" />
        </div>
        <ArrowUpRight className="h-4 w-4 text-zinc-700 transition group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-zinc-300" />
      </div>
      <div className="mt-8 text-[10px] font-black uppercase tracking-[0.22em] text-violet-400/80">{eyebrow}</div>
      <h3 className="mt-2 text-xl font-black tracking-tight text-white">{title}</h3>
      <p className="mt-2 min-h-[60px] text-sm leading-6 text-zinc-500">{description}</p>
      <div className="mt-5 inline-flex rounded-full border border-white/5 bg-black/20 px-3 py-1 text-[10px] font-black uppercase tracking-[0.14em] text-zinc-500">{stat}</div>
    </Link>
  );
}
