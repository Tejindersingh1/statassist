import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";

interface BayesianAnalysisProps {
  studyId: string;
}

export function BayesianAnalysis({ studyId }: BayesianAnalysisProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const [config, setConfig] = useState({
    modelType: "normal",
    numSamples: 1000,
    priorMean: 0,
    priorSigma: 1,
    data: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/bayesian/analyze", {
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
        throw new Error("Analysis failed");
      }

      const data = await response.json();
      setResults(data);
      toast({
        title: "Analysis Complete",
        description: "Bayesian analysis has been completed successfully.",
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      toast({
        title: "Error",
        description: "Failed to perform Bayesian analysis.",
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
            <Label htmlFor="modelType">Model Type</Label>
            <Select
              value={config.modelType}
              onValueChange={(value) => setConfig({ ...config, modelType: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select model type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="normal">Normal Distribution</SelectItem>
                <SelectItem value="bernoulli">Bernoulli Distribution</SelectItem>
                <SelectItem value="poisson">Poisson Distribution</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="numSamples">Number of Samples</Label>
            <Input
              id="numSamples"
              type="number"
              value={config.numSamples}
              onChange={(e) => setConfig({ ...config, numSamples: parseInt(e.target.value) })}
              min={100}
              max={10000}
            />
          </div>

          <div>
            <Label htmlFor="priorMean">Prior Mean (μ)</Label>
            <Input
              id="priorMean"
              type="number"
              value={config.priorMean}
              onChange={(e) => setConfig({ ...config, priorMean: parseFloat(e.target.value) })}
              step="0.1"
            />
          </div>

          <div>
            <Label htmlFor="priorSigma">Prior Sigma (σ)</Label>
            <Input
              id="priorSigma"
              type="number"
              value={config.priorSigma}
              onChange={(e) => setConfig({ ...config, priorSigma: parseFloat(e.target.value) })}
              min={0}
              step="0.1"
            />
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
              Analyzing...
            </>
          ) : (
            "Run Analysis"
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
              <Label>Posterior Mean</Label>
              <div className="mt-1 text-sm">{results.posteriorMean?.toFixed(4)}</div>
            </div>
            <div>
              <Label>Credible Interval (95%)</Label>
              <div className="mt-1 text-sm">
                [{results.credibleInterval?.[0]?.toFixed(4)}, {results.credibleInterval?.[1]?.toFixed(4)}]
              </div>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
} 