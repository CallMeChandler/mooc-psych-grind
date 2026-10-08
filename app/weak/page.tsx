import WeakQuiz from "@/components/WeakQuiz";
import { questions } from "@/lib/questions";

export default function WeakPage() {
  return <WeakQuiz questions={questions} />;
}
