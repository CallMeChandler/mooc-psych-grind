import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { questions } from "@/lib/questions";
import { recordAttempt } from "@/lib/store";
import type { AttemptPayload } from "@/lib/types";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    const body = (await request.json()) as AttemptPayload;

    if (
      !body ||
      !Array.isArray(body.questionResults) ||
      !Number.isFinite(body.score) ||
      !Number.isFinite(body.total)
    ) {
      return NextResponse.json({ error: "Invalid attempt payload" }, { status: 400 });
    }

    if (
      body.total !== body.questionResults.length ||
      body.total <= 0 ||
      body.total > 120 ||
      body.score < 0 ||
      body.score > body.total
    ) {
      return NextResponse.json({ error: "Invalid attempt counts" }, { status: 400 });
    }

    const questionMap = new Map(questions.map((q) => [q.id, q]));

    if (body.questionResults.some((r) => !questionMap.has(r.id) || typeof r.selected !== "string")) {
      return NextResponse.json({ error: "Unknown question id" }, { status: 400 });
    }

    // Never trust the score sent by the browser. Recalculate it from the canonical question bank.
    const safeResults = body.questionResults.map((r) => {
      const q = questionMap.get(r.id)!;
      return { ...r, correct: r.selected === q.answer };
    });

    const safePayload = {
      ...body,
      questionResults: safeResults,
      score: safeResults.filter((r) => r.correct).length,
    };

    const result = await recordAttempt(safePayload, session);
    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ error: "Could not save attempt" }, { status: 500 });
  }
}
