// Cut plan optimizer for achieving savings goals

export interface CategoryData {
  category: string;
  monthlySpend: number;
  volatility: number;
  essentialness: number;
  pain: number;
  maxCut: number;
  savingsPerPain: number;
}

export interface CutPlanItem {
  category: string;
  proposedCut: number;
  rationale: string;
  microActions: string[];
}

export interface CutPlan {
  monthlyTarget: number;
  shortfall: number;
  plan: CutPlanItem[];
  alternatives: {
    cancelSubscriptions: Array<{ label: string; save: number }>;
  };
}

// Essentialness constants (lower = easier to cut)
const ESSENTIALNESS_MAP: Record<string, number> = {
  'Restaurants': 0.3,
  'Coffee': 0.2,
  'Rideshare': 0.4,
  'Entertainment': 0.3,
  'Subscriptions': 0.5
};

// Micro-action templates
const MICRO_ACTIONS: Record<string, string[]> = {
  'Restaurants': [
    'Cap dining-out to 2 times per week',
    'Swap 1 meal per week to home-cooked'
  ],
  'Coffee': [
    'Brew at home 3 times per week',
    'Keep 2 café visits as treats'
  ],
  'Rideshare': [
    'Replace 2 weekend rides with transit',
    'Consider carpooling for regular trips'
  ],
  'Entertainment': [
    'Skip one ticketed event this month',
    'Use free or low-cost entertainment options'
  ],
  'Subscriptions': [
    'Pause or downgrade 1 subscription plan',
    'Review and cancel unused trial subscriptions'
  ]
};

// Calculate volatility (coefficient of variation)
function calculateVolatility(monthlySpends: number[]): number {
  if (monthlySpends.length === 0) return 0;
  
  const mean = monthlySpends.reduce((sum, val) => sum + val, 0) / monthlySpends.length;
  if (mean === 0) return 0;
  
  const variance = monthlySpends.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / monthlySpends.length;
  const stdDev = Math.sqrt(variance);
  
  return stdDev / mean;
}

// Calculate pain score
function calculatePain(essentialness: number, volatility: number): number {
  const volatilityFactor = 1 - Math.min(1, 1 / (1 + volatility));
  return 0.5 * essentialness + 0.5 * volatilityFactor;
}

// Clamp value between 0 and 1
function clamp01(value: number): number {
  return Math.max(0, Math.min(1, value));
}

// Generate rationale for cut
function generateRationale(category: string, proposedCut: number, monthlySpend: number): string {
  const percentage = Math.round((proposedCut / monthlySpend) * 100);
  
  switch (category) {
    case 'Restaurants':
      return `Reduce dining out by $${Math.round(proposedCut)} (${percentage}%) while maintaining some social meals`;
    case 'Coffee':
      return `Cut coffee spending by $${Math.round(proposedCut)} (${percentage}%) by brewing more at home`;
    case 'Rideshare':
      return `Reduce rideshare costs by $${Math.round(proposedCut)} (${percentage}%) using alternative transportation`;
    case 'Entertainment':
      return `Lower entertainment spending by $${Math.round(proposedCut)} (${percentage}%) with more free activities`;
    case 'Subscriptions':
      return `Trim subscription costs by $${Math.round(proposedCut)} (${percentage}%) by pausing unused services`;
    default:
      return `Reduce ${category.toLowerCase()} spending by $${Math.round(proposedCut)} (${percentage}%)`;
  }
}

// Main optimizer function
export function optimizeCutPlan(
  categorySpends: Record<string, number[]>, // category -> monthly spend history
  currentMonthSpends: Record<string, number>, // category -> current month spend
  shortfall: number,
  graySubscriptions: Array<{ merchant: string; monthlyEstimate: number }> = []
): CutPlan {
  const categories = Object.keys(currentMonthSpends);
  const categoryData: CategoryData[] = [];
  
  // Calculate metrics for each category
  for (const category of categories) {
    const monthlySpend = currentMonthSpends[category];
    const monthlySpends = categorySpends[category] || [];
    const volatility = calculateVolatility(monthlySpends);
    const essentialness = ESSENTIALNESS_MAP[category] || 0.5;
    const pain = calculatePain(essentialness, volatility);
    const maxCut = 0.35 * monthlySpend; // Don't propose extreme cuts
    const savingsPerPain = maxCut / (pain + 0.05);
    
    categoryData.push({
      category,
      monthlySpend,
      volatility,
      essentialness,
      pain,
      maxCut,
      savingsPerPain
    });
  }
  
  // Sort by savings per pain (descending)
  categoryData.sort((a, b) => b.savingsPerPain - a.savingsPerPain);
  
  // Greedy accumulation to cover shortfall
  const plan: CutPlanItem[] = [];
  let remainingShortfall = shortfall;
  
  for (const data of categoryData) {
    if (remainingShortfall <= 0) break;
    
    const proposedCut = Math.min(remainingShortfall, data.maxCut);
    if (proposedCut <= 0) continue;
    
    const rationale = generateRationale(data.category, proposedCut, data.monthlySpend);
    const microActions = MICRO_ACTIONS[data.category] || [
      `Reduce ${data.category.toLowerCase()} spending`,
      'Look for cost-saving alternatives'
    ];
    
    plan.push({
      category: data.category,
      proposedCut: Math.round(proposedCut),
      rationale,
      microActions
    });
    
    remainingShortfall -= proposedCut;
  }
  
  // Generate alternatives (gray subscriptions)
  const alternatives = {
    cancelSubscriptions: graySubscriptions.map(sub => ({
      label: sub.merchant,
      save: Math.round(sub.monthlyEstimate)
    }))
  };
  
  return {
    monthlyTarget: 0, // Will be set by caller
    shortfall: Math.round(shortfall),
    plan,
    alternatives
  };
}

// Helper to calculate total proposed savings
export function calculateTotalProposedSavings(plan: CutPlanItem[]): number {
  return plan.reduce((sum, item) => sum + item.proposedCut, 0);
}

// Helper to check if plan covers shortfall
export function planCoversShortfall(plan: CutPlanItem[], shortfall: number): boolean {
  return calculateTotalProposedSavings(plan) >= shortfall;
}
