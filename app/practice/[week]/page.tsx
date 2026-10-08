import { notFound } from "next/navigation";
import QuizArena from "@/components/QuizArena";
import { getWeekQuestions } from "@/lib/questions";

export default async function PracticeWeekPage({ params }: { params: Promise<{ week: string }> }) {
  const { week: raw } = await params;
  const week = Number(raw);
  if (!Number.isInteger(week) || week < 1 || week > 12) notFound();
  const questions = getWeekQuestions(week);
  return <QuizArena questions={questions} title={`Week ${week} · Assignment ${week}`} subtitle="10 questions · instant feedback · shuffled each run" mode="week" week={week} />;
}
