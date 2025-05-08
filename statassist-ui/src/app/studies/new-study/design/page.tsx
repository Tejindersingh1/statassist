import { StudyDesign } from "@/components/analysis/StudyDesign";

export default function StudyDesignPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Study Design</h1>
      <StudyDesign studyId="new" />
    </div>
  );
} 