import MixBuilder from "@/components/MixBuilder";
import { questions } from "@/lib/questions";

export default function MixPage() {
  return <MixBuilder questions={questions} />;
}
