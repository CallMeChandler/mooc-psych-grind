import LocalDashboard from "@/components/LocalDashboard";
import { questions } from "@/lib/questions";

export default function DashboardPage() {
  return <LocalDashboard questions={questions} />;
}
