export const dynamic = "force-dynamic";

import QuizArena from "@/components/QuizArena";
import { questions } from "@/lib/questions";

export default function ExamPage() {
  // QuizArena shuffles the provided 75-question slice. Randomizing the draw server-side gives a fresh pool on every navigation.
  const draw = [...questions].sort(() => Math.random() - 0.5).slice(0, 75);
  return <QuizArena questions={draw} title="75-question exam simulation" subtitle="Random draw from all 120 · answers stay hidden until the end" mode="exam" immediateFeedback={false} />;
}
