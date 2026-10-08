"use client";

import Link from "next/link";
import { BarChart3, BookOpen, Dices, Target, Trophy } from "lucide-react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const items = [
  { href: "/weeks", label: "Weeks", icon: BookOpen },
  { href: "/mix", label: "Mix", icon: Dices },
  { href: "/exam", label: "Exam", icon: Target },
  { href: "/leaderboard", label: "Ranks", icon: Trophy },
  { href: "/dashboard", label: "Stats", icon: BarChart3 },
];

export default function MobileDock() {
  const pathname = usePathname();
  return (
    <nav className="fixed bottom-3 left-1/2 z-50 flex -translate-x-1/2 items-center gap-1 rounded-2xl border border-white/10 bg-[#0a0a0d]/90 p-1.5 shadow-2xl backdrop-blur-2xl md:hidden">
      {items.map((item) => {
        const Icon = item.icon;
        const active = pathname.startsWith(item.href);
        return (
          <Link key={item.href} href={item.href} className={cn("flex min-w-[56px] flex-col items-center gap-1 rounded-xl px-2 py-2 text-[9px] font-black uppercase tracking-[0.08em] transition", active ? "bg-violet-400/10 text-violet-200" : "text-zinc-600 hover:text-zinc-300")}>
            <Icon className="h-4 w-4" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
