import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BayesianAnalysis } from "@/components/analysis/BayesianAnalysis";
import { StatisticalValidation } from "@/components/analysis/StatisticalValidation";
import { StudyDesign } from "@/components/analysis/StudyDesign";

export default function AnalysisPage() {
  return (
    <div className="container py-8">
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold">Statistical Analysis</h1>
          <p className="text-muted-foreground mt-2">
            Perform advanced statistical analysis on your research data
          </p>
        </div>

        <Tabs defaultValue="bayesian" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="bayesian">Bayesian Analysis</TabsTrigger>
            <TabsTrigger value="validation">Statistical Validation</TabsTrigger>
            <TabsTrigger value="design">Study Design</TabsTrigger>
          </TabsList>
          
          <div className="mt-6">
            <TabsContent value="bayesian">
              <BayesianAnalysis studyId="current" />
            </TabsContent>
            
            <TabsContent value="validation">
              <StatisticalValidation studyId="current" />
            </TabsContent>
            
            <TabsContent value="design">
              <StudyDesign studyId="current" />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
} 