'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface PICOT {
  population: string;
  intervention: string;
  comparator: string;
  outcome: string;
  timeframe?: string;
  clarification_needed?: boolean;
}

export default function PicotPage() {
  const [question, setQuestion] = useState('');
  const [details, setDetails] = useState('');
  const [picot, setPicot] = useState<PICOT | null>(null);
  const [analysis, setAnalysis] = useState('');
  const [loading, setLoading] = useState(false);

  const submitQuestion = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/v1/research/picot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question, additional_details: details }),
      });
      if (res.ok) {
        const data = await res.json();
        setPicot(data);
      } else {
        throw new Error('Failed to refine question');
      }
    } finally {
      setLoading(false);
    }
  };

  const finalize = async () => {
    if (!picot) return;
    setLoading(true);
    try {
      const res = await fetch('/api/v1/research/tir', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ picot }),
      });
      if (res.ok) {
        const data = await res.json();
        setAnalysis(data.analysis_plan);
      } else {
        throw new Error('Failed to generate plan');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-8 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Refine Research Question</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="Enter your research question"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
          />
          <Input
            placeholder="Additional details (optional)"
            value={details}
            onChange={(e) => setDetails(e.target.value)}
          />
          <Button onClick={submitQuestion} disabled={loading || !question}>
            Refine to PICOT
          </Button>
        </CardContent>
      </Card>

      {picot && (
        <Card>
          <CardHeader>
            <CardTitle>PICOT</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Input
              value={picot.population}
              onChange={(e) =>
                setPicot({ ...picot, population: e.target.value })
              }
              placeholder="Population"
            />
            <Input
              value={picot.intervention}
              onChange={(e) =>
                setPicot({ ...picot, intervention: e.target.value })
              }
              placeholder="Intervention"
            />
            <Input
              value={picot.comparator}
              onChange={(e) =>
                setPicot({ ...picot, comparator: e.target.value })
              }
              placeholder="Comparator"
            />
            <Input
              value={picot.outcome}
              onChange={(e) => setPicot({ ...picot, outcome: e.target.value })}
              placeholder="Outcome"
            />
            <Input
              value={picot.timeframe || ''}
              onChange={(e) =>
                setPicot({ ...picot, timeframe: e.target.value })
              }
              placeholder="Timeframe"
            />
            <Button onClick={finalize} disabled={loading}>
              Generate Analysis Plan
            </Button>
          </CardContent>
        </Card>
      )}

      {analysis && (
        <Card>
          <CardHeader>
            <CardTitle>Analysis Plan</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="whitespace-pre-wrap">{analysis}</pre>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

