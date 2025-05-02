import yaml
import os
import logging
from typing import Dict, Any, List
from app.schemas.recommender import TestRequest, TestResponse, TestRecommendation

# Configure logging
logger = logging.getLogger(__name__)

class TestRecommender:
    """
    Class for recommending statistical tests based on study design and variables
    """
    
    def __init__(self):
        """Initialize the test recommender with rules from YAML file"""
        self.rules = self._load_rules()
        logger.info("Test recommender initialized with rules")
    
    def _load_rules(self) -> Dict[str, Any]:
        """Load test recommendation rules from YAML file"""
        # In a real implementation, this would load from a file
        # For this example, we'll define the rules inline
        rules = {
            "RCT": {
                "Continuous": {
                    "paired": {
                        "test": "Paired t-test",
                        "alternatives": ["Wilcoxon signed-rank test"],
                        "conditions": ["Normally distributed differences"],
                        "explanation": "For a paired RCT with a continuous outcome, a paired t-test is recommended if the differences are normally distributed. Otherwise, consider a Wilcoxon signed-rank test."
                    },
                    "unpaired": {
                        "test": "Independent t-test",
                        "alternatives": ["Mann-Whitney U test"],
                        "conditions": ["Normally distributed data in each group"],
                        "explanation": "For an RCT with a continuous outcome and independent groups, an independent t-test is recommended if the data in each group is normally distributed. Otherwise, consider a Mann-Whitney U test."
                    },
                    "multi_group": {
                        "test": "One-way ANOVA",
                        "alternatives": ["Kruskal-Wallis test"],
                        "conditions": ["Normally distributed data in each group", "Homogeneity of variances"],
                        "explanation": "For an RCT with a continuous outcome and more than two groups, a one-way ANOVA is recommended if the data in each group is normally distributed and variances are homogeneous. Otherwise, consider a Kruskal-Wallis test."
                    }
                },
                "Binary": {
                    "paired": {
                        "test": "McNemar's test",
                        "alternatives": [],
                        "conditions": [],
                        "explanation": "For a paired RCT with a binary outcome, McNemar's test is recommended to analyze the paired proportions."
                    },
                    "unpaired": {
                        "test": "Chi-square test",
                        "alternatives": ["Fisher's exact test"],
                        "conditions": ["Expected cell counts ≥ 5"],
                        "explanation": "For an RCT with a binary outcome, a Chi-square test is recommended if all expected cell counts are at least 5. For smaller sample sizes, use Fisher's exact test."
                    },
                    "multi_group": {
                        "test": "Chi-square test",
                        "alternatives": ["Fisher's exact test"],
                        "conditions": ["Expected cell counts ≥ 5"],
                        "explanation": "For an RCT with a binary outcome and more than two groups, a Chi-square test is recommended if all expected cell counts are at least 5. For smaller sample sizes, use Fisher's exact test."
                    }
                },
                "Categorical": {
                    "paired": {
                        "test": "Stuart-Maxwell test",
                        "alternatives": [],
                        "conditions": [],
                        "explanation": "For a paired RCT with a categorical outcome with more than two categories, the Stuart-Maxwell test is recommended."
                    },
                    "unpaired": {
                        "test": "Chi-square test",
                        "alternatives": ["Fisher's exact test"],
                        "conditions": ["Expected cell counts ≥ 5"],
                        "explanation": "For an RCT with a categorical outcome, a Chi-square test is recommended if all expected cell counts are at least 5. For smaller sample sizes, use Fisher's exact test."
                    },
                    "multi_group": {
                        "test": "Chi-square test",
                        "alternatives": ["Fisher's exact test"],
                        "conditions": ["Expected cell counts ≥ 5"],
                        "explanation": "For an RCT with a categorical outcome and more than two groups, a Chi-square test is recommended if all expected cell counts are at least 5. For smaller sample sizes, use Fisher's exact test."
                    }
                }
            },
            "DiagnosticAccuracy": {
                "Binary": {
                    "default": {
                        "test": "Sensitivity/Specificity analysis",
                        "alternatives": ["ROC curve analysis"],
                        "conditions": [],
                        "explanation": "For a diagnostic accuracy study with a binary outcome, sensitivity and specificity analysis is recommended. ROC curve analysis can provide additional insights into the test performance across different thresholds."
                    }
                },
                "Continuous": {
                    "default": {
                        "test": "ROC curve analysis",
                        "alternatives": ["Bland-Altman plot"],
                        "conditions": [],
                        "explanation": "For a diagnostic accuracy study with a continuous outcome, ROC curve analysis is recommended to evaluate the diagnostic performance across different thresholds. Bland-Altman plots can be used to assess agreement between the index test and reference standard."
                    }
                }
            },
            "Cohort": {
                "Binary": {
                    "default": {
                        "test": "Logistic regression",
                        "alternatives": ["Cox proportional hazards"],
                        "conditions": [],
                        "explanation": "For a cohort study with a binary outcome, logistic regression is recommended to estimate the association between exposure and outcome while adjusting for covariates. If time-to-event is important, consider Cox proportional hazards regression."
                    }
                },
                "Continuous": {
                    "default": {
                        "test": "Multiple linear regression",
                        "alternatives": ["Mixed-effects models"],
                        "conditions": ["Normally distributed residuals", "Homoscedasticity"],
                        "explanation": "For a cohort study with a continuous outcome, multiple linear regression is recommended to estimate the association between exposure and outcome while adjusting for covariates. If there are repeated measures or clustered data, consider mixed-effects models."
                    }
                },
                "Time": {
                    "default": {
                        "test": "Cox proportional hazards",
                        "alternatives": ["Kaplan-Meier with log-rank test"],
                        "conditions": ["Proportional hazards assumption"],
                        "explanation": "For a cohort study with a time-to-event outcome, Cox proportional hazards regression is recommended to estimate the association between exposure and outcome while adjusting for covariates. For unadjusted analyses, consider Kaplan-Meier curves with log-rank tests."
                    }
                }
            }
        }
        return rules
    
    def recommend_test(self, request: TestRequest) -> TestResponse:
        """Recommend statistical tests based on study design and variables"""
        design_type = request.design_type
        outcome_type = request.primary_outcome.get("type", "Unknown")
        paired = request.paired
        groups = request.groups
        
        logger.info(f"Recommending test for {design_type} study with {outcome_type} outcome")
        
        # Get rules for this study design
        design_rules = self.rules.get(design_type)
        if not design_rules:
            return self._default_recommendation(
                f"No recommendations available for {design_type} study design."
            )
        
        # Get rules for this outcome type
        outcome_rules = design_rules.get(outcome_type)
        if not outcome_rules:
            return self._default_recommendation(
                f"No recommendations available for {outcome_type} outcome in {design_type} study."
            )
        
        # Determine which rule set to use based on paired/unpaired and number of groups
        if "default" in outcome_rules:
            rule_set = outcome_rules["default"]
        elif paired and "paired" in outcome_rules:
            rule_set = outcome_rules["paired"]
        elif not paired and groups > 2 and "multi_group" in outcome_rules:
            rule_set = outcome_rules["multi_group"]
        elif not paired and "unpaired" in outcome_rules:
            rule_set = outcome_rules["unpaired"]
        else:
            return self._default_recommendation(
                f"No specific recommendations available for this combination of study design and outcome."
            )
        
        # Create recommendation
        recommendation = TestRecommendation(
            test_name=rule_set["test"],
            alternatives=rule_set.get("alternatives", []),
            conditions=rule_set.get("conditions", []),
            confidence=0.9  # Confidence level is fixed for now
        )
        
        return TestResponse(
            recommended_tests=[recommendation],
            explanation=rule_set.get("explanation", "")
        )
    
    def _default_recommendation(self, explanation: str) -> TestResponse:
        """Return a default recommendation when no specific rule matches"""
        return TestResponse(
            recommended_tests=[
                TestRecommendation(
                    test_name="Consult statistician",
                    alternatives=[],
                    conditions=["Complex study design"],
                    confidence=0.5
                )
            ],
            explanation=explanation + " We recommend consulting with a statistician for appropriate test selection."
        )
