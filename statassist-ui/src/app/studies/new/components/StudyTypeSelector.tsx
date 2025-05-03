import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Users, Activity, BarChart2 } from 'lucide-react';

type StudyType = 'RCT' | 'DiagnosticAccuracy' | 'Cohort' | 'CrossSectional' | 'CaseControl';

interface StudyTypeSelectorProps {
  onSelect: (type: StudyType) => void;
  selectedType: StudyType | null;
}

export function StudyTypeSelector({ onSelect, selectedType }: StudyTypeSelectorProps) {
  const studyTypes = [
    {
      id: 'RCT',
      title: 'Randomized Controlled Trial',
      description: 'Compare outcomes between intervention and control groups with random assignment.',
      examples: 'Drug efficacy, treatment comparison',
      icon: <Activity className="h-8 w-8 text-blue-600" />
    },
    {
      id: 'DiagnosticAccuracy',
      title: 'Diagnostic Accuracy Study',
      description: 'Evaluate how well a diagnostic test identifies a target condition.',
      examples: 'Sensitivity/specificity, ROC analysis',
      icon: <BarChart2 className="h-8 w-8 text-blue-600" />
    },
    {
      id: 'Cohort',
      title: 'Cohort Study',
      description: 'Follow groups of people over time to study outcomes associated with exposures.',
      examples: 'Risk factors, prognostic studies',
      icon: <Users className="h-8 w-8 text-blue-600" />
    },
    {
      id: 'CrossSectional',
      title: 'Cross-Sectional Study',
      description: 'Examine the relationship between variables at a single point in time.',
      examples: 'Prevalence studies, surveys',
      icon: <BarChart2 className="h-8 w-8 text-blue-600" />
    },
    {
      id: 'CaseControl',
      title: 'Case-Control Study',
      description: 'Compare subjects with a condition to those without to identify risk factors.',
      examples: 'Rare disease studies, retrospective analysis',
      icon: <Users className="h-8 w-8 text-blue-600" />
    }
  ];

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Select Study Type</h1>
        <p className="text-gray-600">
          Choose the type of study you want to design. This will determine the workflow and statistical methods.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {studyTypes.map((type) => (
          <Card 
            key={type.id}
            className={`cursor-pointer transition-all hover:shadow-md ${
              selectedType === type.id ? 'ring-2 ring-blue-500 shadow-md' : ''
            }`}
            onClick={() => onSelect(type.id as StudyType)}
          >
            <CardHeader className="relative pb-2">
              {selectedType === type.id && (
                <div className="absolute top-4 right-4">
                  <CheckCircle className="h-5 w-5 text-blue-600" />
                </div>
              )}
              <div className="mb-2">{type.icon}</div>
              <CardTitle className="text-lg">{type.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">{type.description}</p>
              <p className="text-sm">
                <span className="font-semibold">Examples:</span> {type.examples}
              </p>
            </CardContent>
            <CardFooter>
              <Button 
                variant={selectedType === type.id ? "default" : "outline"} 
                className={`w-full ${selectedType === type.id ? 'bg-blue-600 hover:bg-blue-700' : 'text-blue-600 border-blue-200 hover:border-blue-600'}`}
                onClick={() => onSelect(type.id as StudyType)}
              >
                {selectedType === type.id ? 'Selected' : 'Select This Type'}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <div className="flex justify-end mt-8">
        <Button 
          className="bg-blue-600 hover:bg-blue-700 px-6 py-6 text-base"
          disabled={!selectedType}
          onClick={() => selectedType && onSelect(selectedType)}
        >
          Continue to Design
        </Button>
      </div>
    </div>
  );
}
