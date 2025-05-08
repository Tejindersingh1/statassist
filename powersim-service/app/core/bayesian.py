from typing import Dict, List, Optional, Union
import numpy as np
import pymc as pm
import arviz as az
from app.schemas.bayesian import BayesianAnalysisConfig

class BayesianAnalysis:
    def __init__(self, config: BayesianAnalysisConfig):
        self.config = config
        self.model = None
        self.trace = None

    def build_model(self, data: np.ndarray) -> None:
        """Build the PyMC model based on the configuration"""
        with pm.Model() as self.model:
            if self.config.model_type == "normal":
                # Normal distribution model
                mu = pm.Normal("mu", **self.config.prior_params)
                sigma = pm.HalfNormal("sigma", sigma=1)
                y = pm.Normal("y", mu=mu, sigma=sigma, observed=data)
            
            elif self.config.model_type == "binomial":
                # Binomial distribution model
                p = pm.Beta("p", **self.config.prior_params)
                y = pm.Binomial("y", n=len(data), p=p, observed=data)
            
            elif self.config.model_type == "poisson":
                # Poisson distribution model
                lambda_ = pm.Gamma("lambda_", **self.config.prior_params)
                y = pm.Poisson("y", mu=lambda_, observed=data)

    def run_analysis(self, data: np.ndarray) -> Dict:
        """Run the Bayesian analysis and return results"""
        self.build_model(data)
        
        with self.model:
            self.trace = pm.sample(
                draws=self.config.n_samples,
                chains=self.config.n_chains,
                tune=self.config.n_tune,
                return_inferencedata=True
            )
        
        # Generate summary statistics
        summary = az.summary(self.trace)
        
        # Generate diagnostics
        diagnostics = {
            "r_hat": az.rhat(self.trace).to_dict(),
            "effective_sample_size": az.ess(self.trace).to_dict(),
            "divergences": self.trace.sample_stats.diverging.sum().item()
        }
        
        return {
            "summary": summary.to_dict(),
            "diagnostics": diagnostics,
            "trace": self.trace
        }

    def get_posterior_predictive(self, n_samples: int = 1000) -> np.ndarray:
        """Generate posterior predictive samples"""
        if self.trace is None:
            raise ValueError("Must run analysis before generating predictions")
        
        with self.model:
            ppc = pm.sample_posterior_predictive(
                self.trace,
                var_names=["y"],
                return_inferencedata=True
            )
        
        return ppc.posterior_predictive["y"].values 