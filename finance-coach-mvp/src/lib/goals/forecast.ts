// Forecasting module for savings predictions

export interface MonthlyData {
  month: number; // 0-based index
  income: number;
  expenses: number;
  savings: number;
}

export interface ForecastResult {
  method: 'mean' | 'regression' | 'expSmooth';
  savings: number;
  interval: { low: number; high: number };
  probabilityOnTrack: number;
}

// Simple linear regression implementation
function linearRegression(points: { x: number; y: number }[]): { slope: number; intercept: number } {
  if (points.length === 0) return { slope: 0, intercept: 0 };
  
  const n = points.length;
  const sumX = points.reduce((sum, p) => sum + p.x, 0);
  const sumY = points.reduce((sum, p) => sum + p.y, 0);
  const sumXY = points.reduce((sum, p) => sum + p.x * p.y, 0);
  const sumXX = points.reduce((sum, p) => sum + p.x * p.x, 0);
  
  const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;
  
  return { slope, intercept };
}

// Exponential smoothing with alpha parameter
function exponentialSmoothing(values: number[], alpha: number = 0.5): number {
  if (values.length === 0) return 0;
  if (values.length === 1) return values[0];
  
  let smoothed = values[0];
  for (let i = 1; i < values.length; i++) {
    smoothed = alpha * values[i] + (1 - alpha) * smoothed;
  }
  return smoothed;
}

// Mean forecast
export function meanSavingsForecast(data: MonthlyData[]): number {
  if (data.length === 0) return 0;
  const savings = data.map(d => d.savings);
  return savings.reduce((sum, val) => sum + val, 0) / savings.length;
}

// Regression forecast
export function regressionSavingsForecast(data: MonthlyData[]): number {
  if (data.length < 2) return meanSavingsForecast(data);
  
  const points = data.map((d, i) => ({ x: i, y: d.savings }));
  const { slope, intercept } = linearRegression(points);
  
  // Predict next month (index = data.length)
  return slope * data.length + intercept;
}

// Exponential smoothing forecast
export function expoSmoothingSavingsForecast(data: MonthlyData[]): number {
  if (data.length === 0) return 0;
  
  const savings = data.map(d => d.savings);
  return exponentialSmoothing(savings, 0.5);
}

// Calculate absolute error for backtesting
function calculateError(actual: number, predicted: number): number {
  return Math.abs(actual - predicted);
}

// One-step backtest to select best method
export function selectBestForecastMethod(data: MonthlyData[]): {
  method: 'mean' | 'regression' | 'expSmooth';
  forecast: number;
  errors: number[];
} {
  if (data.length < 2) {
    return {
      method: 'mean',
      forecast: meanSavingsForecast(data),
      errors: []
    };
  }
  
  // Hold out the last month for testing
  const trainData = data.slice(0, -1);
  const testValue = data[data.length - 1].savings;
  
  const methods = [
    { name: 'mean' as const, fn: meanSavingsForecast },
    { name: 'regression' as const, fn: regressionSavingsForecast },
    { name: 'expSmooth' as const, fn: expoSmoothingSavingsForecast }
  ];
  
  const results = methods.map(method => {
    const prediction = method.fn(trainData);
    const error = calculateError(testValue, prediction);
    return { method: method.name, prediction, error };
  });
  
  // Sort by error (ascending)
  results.sort((a, b) => a.error - b.error);
  
  // If tie or few data points, prefer regression, then mean
  if (data.length < 3) {
    const regressionResult = results.find(r => r.method === 'regression');
    if (regressionResult) {
      return {
        method: regressionResult.method,
        forecast: regressionResult.prediction,
        errors: [regressionResult.error]
      };
    }
  }
  
  const best = results[0];
  
  // Calculate all errors for the chosen method
  const allErrors: number[] = [];
  for (let i = 1; i < data.length; i++) {
    const trainData = data.slice(0, i);
    const testValue = data[i].savings;
    const prediction = methods.find(m => m.name === best.method)!.fn(trainData);
    allErrors.push(calculateError(testValue, prediction));
  }
  
  return {
    method: best.method,
    forecast: best.prediction,
    errors: allErrors
  };
}

// Approximate normal CDF for probability calculation
function normalCDF(x: number): number {
  // Approximation using error function
  return 0.5 * (1 + erf(x / Math.sqrt(2)));
}

function erf(x: number): number {
  // Abramowitz and Stegun approximation
  const a1 =  0.254829592;
  const a2 = -0.284496736;
  const a3 =  1.421413741;
  const a4 = -1.453152027;
  const a5 =  1.061405429;
  const p  =  0.3275911;
  
  const sign = x >= 0 ? 1 : -1;
  x = Math.abs(x);
  
  const t = 1.0 / (1.0 + p * x);
  const y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);
  
  return sign * y;
}

// Main forecast function
export function forecastSavings(
  data: MonthlyData[], 
  requiredMonthly: number
): ForecastResult {
  const { method, forecast, errors } = selectBestForecastMethod(data);
  
  // Calculate residual standard deviation
  const sigma = errors.length > 0 
    ? Math.sqrt(errors.reduce((sum, err) => sum + err * err, 0) / errors.length)
    : Math.max(1, requiredMonthly * 0.1);
  
  // 68% confidence interval
  const interval = {
    low: Math.max(0, forecast - sigma),
    high: forecast + sigma
  };
  
  // Probability of being on track
  const zScore = (forecast - requiredMonthly) / sigma;
  const probabilityOnTrack = Math.max(0, Math.min(1, normalCDF(zScore)));
  
  return {
    method,
    savings: Math.round(forecast),
    interval: {
      low: Math.round(interval.low),
      high: Math.round(interval.high)
    },
    probabilityOnTrack: Math.round(probabilityOnTrack * 100) / 100
  };
}
