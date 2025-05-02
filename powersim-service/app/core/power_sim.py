import numpy as np
import logging
from typing import List, Dict, Any
from app.schemas.power import PowerResponse, PowerResult, PowerCurvePoint

# Configure logging
logger = logging.getLogger(__name__)

class PowerSimulator:
    """
    Class for calculating statistical power using simulation methods
    """
    
    def __init__(self):
        """Initialize the power simulator"""
        logger.info("Power simulator initialized")
    
    def calculate_power(
        self, 
        test_type: str, 
        effect_size: float, 
        alpha: float, 
        sample_sizes: List[int], 
        groups: int = 2, 
        simulations: int = 1000
    ) -> PowerResponse:
        """
        Calculate statistical power for various tests using simulation methods
        
        Args:
            test_type: Type of statistical test
            effect_size: Expected effect size
            alpha: Significance level
            sample_sizes: List of sample sizes to calculate power for
            groups: Number of groups
            simulations: Number of simulations to run
            
        Returns:
            PowerResponse object with results and power curve
        """
        logger.info(f"Calculating power for {test_type} with effect size {effect_size}")
        
        # Calculate power for each sample size
        results = []
        for n in sample_sizes:
            power = self._calculate_power_for_sample_size(
                test_type=test_type,
                effect_size=effect_size,
                alpha=alpha,
                sample_size=n,
                groups=groups,
                simulations=simulations
            )
            results.append(PowerResult(sample_size=n, power=power))
        
        # Generate power curve
        power_curve = self._generate_power_curve(
            test_type=test_type,
            effect_size=effect_size,
            alpha=alpha,
            min_n=min(10, min(sample_sizes)),
            max_n=max(120, max(sample_sizes)),
            step=10,
            groups=groups,
            simulations=simulations
        )
        
        # Generate explanation
        explanation = self._generate_explanation(
            test_type=test_type,
            effect_size=effect_size,
            alpha=alpha,
            results=results,
            groups=groups
        )
        
        return PowerResponse(
            results=results,
            power_curve=power_curve,
            explanation=explanation
        )
    
    def _calculate_power_for_sample_size(
        self, 
        test_type: str, 
        effect_size: float, 
        alpha: float, 
        sample_size: int, 
        groups: int,
        simulations: int
    ) -> float:
        """Calculate power for a specific sample size using simulation"""
        if test_type == "Independent t-test":
            return self._simulate_ttest_power(
                effect_size=effect_size,
                alpha=alpha,
                sample_size=sample_size,
                simulations=simulations
            )
        elif test_type == "Paired t-test":
            return self._simulate_paired_ttest_power(
                effect_size=effect_size,
                alpha=alpha,
                sample_size=sample_size,
                simulations=simulations
            )
        elif test_type == "Chi-square test":
            return self._simulate_chisquare_power(
                effect_size=effect_size,
                alpha=alpha,
                sample_size=sample_size,
                groups=groups,
                simulations=simulations
            )
        elif test_type == "One-way ANOVA":
            return self._simulate_anova_power(
                effect_size=effect_size,
                alpha=alpha,
                sample_size=sample_size,
                groups=groups,
                simulations=simulations
            )
        else:
            # For unsupported tests, use a simplified approximation
            return self._approximate_power(
                effect_size=effect_size,
                sample_size=sample_size
            )
    
    def _generate_power_curve(
        self, 
        test_type: str, 
        effect_size: float, 
        alpha: float, 
        min_n: int, 
        max_n: int, 
        step: int,
        groups: int,
        simulations: int
    ) -> List[PowerCurvePoint]:
        """Generate a power curve across a range of sample sizes"""
        power_curve = []
        for n in range(min_n, max_n + 1, step):
            power = self._calculate_power_for_sample_size(
                test_type=test_type,
                effect_size=effect_size,
                alpha=alpha,
                sample_size=n,
                groups=groups,
                simulations=simulations // 10  # Use fewer simulations for the curve
            )
            power_curve.append(PowerCurvePoint(sample_size=n, power=power))
        
        return power_curve
    
    def _generate_explanation(
        self, 
        test_type: str, 
        effect_size: float, 
        alpha: float, 
        results: List[PowerResult],
        groups: int
    ) -> str:
        """Generate an explanation of the power calculation results"""
        # Find the sample size needed for 80% power
        n_80 = None
        for i, result in enumerate(results):
            if result.power >= 0.8:
                if i > 0:
                    # Interpolate between this and previous sample size
                    prev = results[i-1]
                    slope = (result.power - prev.power) / (result.sample_size - prev.sample_size)
                    n_80 = prev.sample_size + (0.8 - prev.power) / slope
                else:
                    n_80 = result.sample_size
                break
        
        if n_80:
            n_80_text = f"approximately {int(n_80)} participants"
            if groups > 1:
                n_80_text += f" per group"
        else:
            n_80_text = "a larger sample size than provided"
        
        explanation = f"With an effect size of {effect_size}, significance level of {alpha}, and "
        if groups > 1:
            explanation += f"{groups} groups, "
        explanation += f"you would need {n_80_text} to achieve 80% power. "
        
        explanation += "Your specified sample sizes would yield powers of "
        power_texts = [f"{int(result.power * 100)}%" for result in results]
        explanation += ", ".join(power_texts[:-1]) + f" and {power_texts[-1]} respectively."
        
        return explanation
    
    # Simulation methods for different tests
    
    def _simulate_ttest_power(
        self, 
        effect_size: float, 
        alpha: float, 
        sample_size: int, 
        simulations: int
    ) -> float:
        """Simulate power for independent t-test using Monte Carlo simulation"""
        significant_count = 0
        
        for _ in range(simulations):
            # Generate data for two groups
            group1 = np.random.normal(0, 1, sample_size)
            group2 = np.random.normal(effect_size, 1, sample_size)
            
            # Perform t-test
            t_stat = (np.mean(group2) - np.mean(group1)) / np.sqrt(
                (np.var(group1, ddof=1) + np.var(group2, ddof=1)) / sample_size
            )
            
            # Calculate p-value (two-tailed)
            p_value = 2 * (1 - self._t_cdf(abs(t_stat), 2 * sample_size - 2))
            
            # Check if significant
            if p_value < alpha:
                significant_count += 1
        
        return significant_count / simulations
    
    def _simulate_paired_ttest_power(
        self, 
        effect_size: float, 
        alpha: float, 
        sample_size: int, 
        simulations: int
    ) -> float:
        """Simulate power for paired t-test using Monte Carlo simulation"""
        significant_count = 0
        
        for _ in range(simulations):
            # Generate paired data
            baseline = np.random.normal(0, 1, sample_size)
            followup = baseline + np.random.normal(effect_size, 1, sample_size)
            differences = followup - baseline
            
            # Perform paired t-test
            t_stat = np.mean(differences) / (np.std(differences, ddof=1) / np.sqrt(sample_size))
            
            # Calculate p-value (two-tailed)
            p_value = 2 * (1 - self._t_cdf(abs(t_stat), sample_size - 1))
            
            # Check if significant
            if p_value < alpha:
                significant_count += 1
        
        return significant_count / simulations
    
    def _simulate_chisquare_power(
        self, 
        effect_size: float, 
        alpha: float, 
        sample_size: int, 
        groups: int,
        simulations: int
    ) -> float:
        """Simulate power for chi-square test using Monte Carlo simulation"""
        significant_count = 0
        
        # Convert Cohen's w to probabilities
        # For simplicity, we'll use a balanced design with equal expected counts
        # and adjust one group's probability based on effect size
        base_prob = 1.0 / groups
        adjusted_prob = base_prob + effect_size * np.sqrt(base_prob * (1 - base_prob))
        
        # Ensure probabilities sum to 1
        probs = [base_prob] * groups
        probs[0] = adjusted_prob
        probs = np.array(probs)
        probs = probs / np.sum(probs)
        
        for _ in range(simulations):
            # Generate multinomial data
            observed = np.random.multinomial(sample_size, probs)
            expected = np.ones(groups) * sample_size / groups
            
            # Calculate chi-square statistic
            chi2_stat = np.sum((observed - expected) ** 2 / expected)
            
            # Calculate p-value
            p_value = 1 - self._chi2_cdf(chi2_stat, groups - 1)
            
            # Check if significant
            if p_value < alpha:
                significant_count += 1
        
        return significant_count / simulations
    
    def _simulate_anova_power(
        self, 
        effect_size: float, 
        alpha: float, 
        sample_size: int, 
        groups: int,
        simulations: int
    ) -> float:
        """Simulate power for one-way ANOVA using Monte Carlo simulation"""
        significant_count = 0
        
        for _ in range(simulations):
            # Generate data for multiple groups
            data = []
            for i in range(groups):
                # Effect size is distributed across groups
                group_mean = effect_size * (i / (groups - 1) - 0.5) if groups > 1 else 0
                group_data = np.random.normal(group_mean, 1, sample_size)
                data.append(group_data)
            
            # Calculate ANOVA F-statistic
            grand_mean = np.mean([np.mean(group) for group in data])
            between_ss = sum([sample_size * (np.mean(group) - grand_mean) ** 2 for group in data])
            within_ss = sum([np.sum((group - np.mean(group)) ** 2) for group in data])
            
            between_df = groups - 1
            within_df = groups * (sample_size - 1)
            
            between_ms = between_ss / between_df
            within_ms = within_ss / within_df
            
            f_stat = between_ms / within_ms
            
            # Calculate p-value
            p_value = 1 - self._f_cdf(f_stat, between_df, within_df)
            
            # Check if significant
            if p_value < alpha:
                significant_count += 1
        
        return significant_count / simulations
    
    def _approximate_power(self, effect_size: float, sample_size: int) -> float:
        """
        Approximate power using a simplified formula
        This is a very rough approximation and should only be used when
        proper simulation is not available
        """
        # This is a very simplified approximation based on the relationship
        # between power, effect size, and sample size
        power = 1 - np.exp(-effect_size * np.sqrt(sample_size) / 2)
        return max(0, min(1, power))  # Clamp between 0 and 1
    
    # Statistical distribution functions
    # These are simplified approximations of the cumulative distribution functions
    
    def _t_cdf(self, t: float, df: int) -> float:
        """Approximate CDF of t-distribution"""
        # This is a simplified approximation
        x = df / (t * t + df)
        return 1 - 0.5 * (x ** (df / 2))
    
    def _chi2_cdf(self, chi2: float, df: int) -> float:
        """Approximate CDF of chi-square distribution"""
        # This is a simplified approximation
        return 1 - np.exp(-(chi2 - df) / np.sqrt(2 * df))
    
    def _f_cdf(self, f: float, df1: int, df2: int) -> float:
        """Approximate CDF of F-distribution"""
        # This is a simplified approximation
        return 1 - np.exp(-(f - 1) * df1 / np.sqrt(2))
