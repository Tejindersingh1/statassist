"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";

interface StatisticalValidationProps {
  studyId: string;
}

export function StatisticalValidation({ studyId }: StatisticalValidationProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const [config, setConfig] = useState({
    testType: "ttest",
    alpha: 0.05,
    data: "",
    alternativeHypothesis: "two-sided"
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/validation/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          studyId,
          ...config,
          data: config.data.split(",").map(Number),
        }),
      });

      if (!response.ok) {
        throw new Error("Validation failed");
      }

      const data = await response.json();
      setResults(data);
      toast({
        title: "Validation Complete",
        description: "Statistical validation has been completed successfully.",
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      toast({
        title: "Error",
        description: "Failed to perform statistical validation.",
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
            <Label htmlFor="testType">Test Type</Label>
            <Select
              value={config.testType}
              onValueChange={(value) => setConfig({ ...config, testType: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select test type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ttest">T-Test</SelectItem>
                <SelectItem value="chisquare">Chi-Square Test</SelectItem>
                <SelectItem value="anova">ANOVA</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="alpha">Significance Level (α)</Label>
            <Input
              id="alpha"
              type="number"
              value={config.alpha}
              onChange={(e) => setConfig({ ...config, alpha: parseFloat(e.target.value) })}
              min={0.01}
              max={0.1}
              step={0.01}
            />
          </div>

          <div>
            <Label htmlFor="alternativeHypothesis">Alternative Hypothesis</Label>
            <Select
              value={config.alternativeHypothesis}
              onValueChange={(value) => setConfig({ ...config, alternativeHypothesis: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select alternative hypothesis" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="two-sided">Two-sided</SelectItem>
                <SelectItem value="greater">Greater than</SelectItem>
                <SelectItem value="less">Less than</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="data">Data (comma-separated values)</Label>
            <Input
              id="data"
              value={config.data}
              onChange={(e) => setConfig({ ...config, data: e.target.value })}
              placeholder="e.g., 1.2, 3.4, 5.6"
            />
          </div>
        </div>

        <Button type="submit" disabled={loading} className="w-full">
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Validating...
            </>
          ) : (
            "Run Validation"
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
          <h3 className="text-lg font-semibold">Results</h3>
          <div className="grid gap-4">
            <div>
              <Label>Test Statistic</Label>
              <div className="mt-1 text-sm">{results.testStatistic?.toFixed(4)}</div>
            </div>
            <div>
              <Label>P-Value</Label>
              <div className="mt-1 text-sm">{results.pValue?.toFixed(4)}</div>
            </div>
            {results.confidenceInterval && (
              <div>
                <Label>Confidence Interval (95%)</Label>
                <div className="mt-1 text-sm">
                  [{results.confidenceInterval[0]?.toFixed(4)}, {results.confidenceInterval[1]?.toFixed(4)}]
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </Card>
  );
} 