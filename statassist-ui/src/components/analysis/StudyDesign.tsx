"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";

interface StudyDesignProps {
  studyId: string;
}

export function StudyDesign({ studyId }: StudyDesignProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const [config, setConfig] = useState({
    designType: "crossover",
    numGroups: 2,
    numPeriods: 2,
    factors: "",
    adaptationRules: "",
    interimData: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/design/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          studyId,
          ...config,
          factors: config.factors.split(",").map(f => f.trim()),
          interimData: config.interimData ? config.interimData.split(",").map(Number) : [],
        }),
      });

      if (!response.ok) {
        throw new Error("Design generation failed");
      }

      const data = await response.json();
      setResults(data);
      toast({
        title: "Design Generated",
        description: "Study design has been generated successfully.",
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      toast({
        title: "Error",
        description: "Failed to generate study design.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="designType">Design Type</Label>
            <Select
              value={config.designType}
              onValueChange={(value) => setConfig({ ...config, designType: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select design type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="crossover">Crossover Design</SelectItem>
                <SelectItem value="factorial">Factorial Design</SelectItem>
                <SelectItem value="adaptive">Adaptive Design</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="numGroups">Number of Groups</Label>
            <Input
              id="numGroups"
              type="number"
              value={config.numGroups}
              onChange={(e) => setConfig({ ...config, numGroups: parseInt(e.target.value) })}
              min={2}
            />
          </div>

          {config.designType === "crossover" && (
            <div>
              <Label htmlFor="numPeriods">Number of Periods</Label>
              <Input
                id="numPeriods"
                type="number"
                value={config.numPeriods}
                onChange={(e) => setConfig({ ...config, numPeriods: parseInt(e.target.value) })}
                min={2}
              />
            </div>
          )}

          {config.designType === "factorial" && (
            <div>
              <Label htmlFor="factors">Factors (comma-separated)</Label>
              <Input
                id="factors"
                value={config.factors}
                onChange={(e) => setConfig({ ...config, factors: e.target.value })}
                placeholder="e.g., Treatment,Dose,Time"
              />
            </div>
          )}

          {config.designType === "adaptive" && (
            <>
              <div>
                <Label htmlFor="adaptationRules">Adaptation Rules</Label>
                <Input
                  id="adaptationRules"
                  value={config.adaptationRules}
                  onChange={(e) => setConfig({ ...config, adaptationRules: e.target.value })}
                  placeholder="e.g., Sample size re-estimation rules"
                />
              </div>
              <div>
                <Label htmlFor="interimData">Interim Data (comma-separated)</Label>
                <Input
                  id="interimData"
                  value={config.interimData}
                  onChange={(e) => setConfig({ ...config, interimData: e.target.value })}
                  placeholder="e.g., 1.2, 3.4, 5.6"
                />
              </div>
            </>
          )}
        </div>

        <Button type="submit" disabled={loading} className="w-full">
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            "Generate Design"
          )}
        </Button>
      </form>

      {error && (
        <div className="mt-4 p-4 bg-destructive/10 text-destructive rounded-md">
          {error}
        </div>
      )}

      {results && (
        <div className="mt-6 space-y-4">
          <h3 className="text-lg font-semibold">Generated Design</h3>
          <div className="grid gap-4">
            <div>
              <Label>Design Matrix</Label>
              <pre className="mt-2 p-4 bg-muted rounded-md overflow-x-auto">
                {JSON.stringify(results.designMatrix, null, 2)}
              </pre>
            </div>
            {results.metadata && (
              <div>
                <Label>Design Metadata</Label>
                <div className="mt-1 text-sm">
                  <pre className="p-4 bg-muted rounded-md overflow-x-auto">
                    {JSON.stringify(results.metadata, null, 2)}
                  </pre>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </Card>
  );
} 