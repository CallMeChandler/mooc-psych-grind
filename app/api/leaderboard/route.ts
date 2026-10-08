import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { getLeaderboard, type LeaderboardMetric } from "@/lib/store";

const allowed = new Set(["xp", "attempts", "accuracy", "mastery"]);

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  }

  const url = new URL(request.url);
  const raw = url.searchParams.get("metric") ?? "xp";
  const metric = (allowed.has(raw) ? raw : "xp") as LeaderboardMetric;
  const data = await getLeaderboard(metric, 30);

  return NextResponse.json(data);
}
