// Insights engine with deterministic analysis

import {
  Transaction, DateRange, sum, mean, median, iqr, clamp, roundToWhole,
  filterByDateRange, filterByCategory, groupByMerchant, groupByCategory, groupByWeekday,
  redactMerchant, containsKeywords, isCoffeeTransaction, amountsMatch, isSameDay,
  FEE_KEYWORDS, DISCRETIONARY_CATEGORIES, getExpenseAmounts
} from './util';

export interface Insight {
  id: string;
  title: string;
  detail: string;
  impact: { monthly: number; annual: number };
  confidence: number;
  tags: string[];
  evidence?: object;
}

export interface InsightsContext {
  monthStart: Date;
  monthEnd: Date;
  prevMonthStart: Date;
  prevMonthEnd: Date;
  currentTransactions: Transaction[];
  prevTransactions: Transaction[];
  totalExpenses: number;
  discretionaryExpenses: number;
  daysInMonth: number;
  dayOfMonth: number;
}

// Core Insight 1: Coffee Savings
export function computeCoffeeInsight(context: InsightsContext): Insight | null {
  const coffeeTransactions = context.currentTransactions.filter(isCoffeeTransaction);
  
  if (coffeeTransactions.length === 0) return null;
  
  const cups = coffeeTransactions.length;
  const avgStorePrice = mean(coffeeTransactions.map(t => Math.abs(t.amount)));
  const homePrice = 3.0;
  const monthlySaving = Math.max(0, (avgStorePrice - homePrice) * cups);
  const annualSaving = monthlySaving * 12;
  
  let confidence = 0.4;
  if (cups >= 6) confidence = 0.8;
  else if (cups >= 3) confidence = 0.6;
  
  return {
    id: 'coffee-savings',
    title: 'Brew-at-home saves on coffee',
    detail: `You spent $${roundToWhole(avgStorePrice * cups)} on ${cups} coffee purchases this month. Brewing at home could save $${roundToWhole(monthlySaving)} monthly.`,
    impact: { monthly: roundToWhole(monthlySaving), annual: roundToWhole(annualSaving) },
    confidence,
    tags: ['coffee', 'habits'],
    evidence: { cups, avgStorePrice, homePrice }
  };
}

// Core Insight 2: Top Merchant Shifts (MoM)
export function computeMerchantShift(context: InsightsContext): Insight | null {
  const currentMerchants = groupByMerchant(context.currentTransactions);
  const prevMerchants = groupByMerchant(context.prevTransactions);
  
  let maxIncrease = 0;
  let maxMerchant = '';
  let maxPrevSpend = 0;
  
  for (const [merchant, transactions] of Object.entries(currentMerchants)) {
    const currentSpend = sum(transactions.map(t => Math.abs(t.amount)));
    const prevSpend = sum((prevMerchants[merchant] || []).map(t => Math.abs(t.amount)));
    const increase = currentSpend - prevSpend;
    
    if (increase > maxIncrease) {
      maxIncrease = increase;
      maxMerchant = merchant;
      maxPrevSpend = prevSpend;
    }
  }
  
  if (maxIncrease <= 0) return null;
  
  const confidence = clamp(maxIncrease / 100, 0, 1);
  const redactedMerchant = redactMerchant(maxMerchant);
  
  return {
    id: 'merchant-shift',
    title: `Spending spike at ${redactedMerchant}`,
    detail: `Your spending at ${redactedMerchant} increased by $${roundToWhole(maxIncrease)} this month${maxPrevSpend > 0 ? ` (from $${roundToWhole(maxPrevSpend)} last month)` : ' (new this month)'}.`,
    impact: { monthly: roundToWhole(maxIncrease), annual: roundToWhole(maxIncrease * 12) },
    confidence,
    tags: ['spending', 'merchants'],
    evidence: { merchant: maxMerchant, increase: maxIncrease, prevSpend: maxPrevSpend }
  };
}

// Core Insight 3: Weekend Rideshare Pattern
export function computeWeekendRideshare(context: InsightsContext): Insight | null {
  const rideshareTransactions = filterByCategory(context.currentTransactions, 'Rideshare');
  if (rideshareTransactions.length === 0) return null;
  
  const { weekday, weekend } = groupByWeekday(rideshareTransactions);
  const weekdaySpend = sum(weekday.map(t => Math.abs(t.amount)));
  const weekendSpend = sum(weekend.map(t => Math.abs(t.amount)));
  
  const weekdayDays = 22; // Approximate weekdays in month
  const weekendDays = 8;  // Approximate weekend days in month
  
  const weekdayAvg = weekdayDays > 0 ? weekdaySpend / weekdayDays : 0;
  const weekendAvg = weekendDays > 0 ? weekendSpend / weekendDays : 0;
  
  if (weekendAvg < 1.3 * weekdayAvg) return null;
  
  const savingsPerRide = 10;
  const ridesPerWeekendDay = Math.min(weekend.length / weekendDays, 2);
  const monthlyImpact = Math.min(ridesPerWeekendDay * 2, 4) * savingsPerRide;
  
  const confidence = clamp(rideshareTransactions.length / 10, 0.3, 0.9);
  
  return {
    id: 'weekend-rideshare',
    title: 'Weekend rideshare costs add up',
    detail: `Weekend rideshare spending is ${Math.round((weekendAvg / weekdayAvg) * 100)}% higher than weekdays. Consider public transit for some weekend trips to save $${roundToWhole(monthlyImpact)} monthly.`,
    impact: { monthly: roundToWhole(monthlyImpact), annual: roundToWhole(monthlyImpact * 12) },
    confidence,
    tags: ['rideshare', 'transportation'],
    evidence: { weekdayAvg, weekendAvg, ridesPerWeekendDay }
  };
}

// Core Insight 4: Category Spike / Anomaly
export function computeCategorySpike(context: InsightsContext): Insight | null {
  const currentCategories = groupByCategory(context.currentTransactions);
  const prevCategories = groupByCategory(context.prevTransactions);
  
  let maxSpike = 0;
  let maxCategory = '';
  let spikeAmount = 0;
  
  for (const [category, transactions] of Object.entries(currentCategories)) {
    const currentTotal = sum(transactions.map(t => Math.abs(t.amount)));
    const prevTotal = sum((prevCategories[category] || []).map(t => Math.abs(t.amount)));
    
    // Try IQR method first if we have enough data
    const amounts = transactions.map(t => Math.abs(t.amount));
    let isSpike = false;
    let confidence = 0.7;
    
    if (amounts.length >= 4) {
      const { q3, iqr: iqrValue } = iqr(amounts);
      const threshold = q3 + 1.5 * iqrValue;
      isSpike = currentTotal > threshold;
      confidence = 0.9;
    } else {
      // Fallback to MoM comparison
      const increase = currentTotal - prevTotal;
      isSpike = increase > 0 && increase > maxSpike;
      confidence = 0.7;
    }
    
    if (isSpike && currentTotal > maxSpike) {
      maxSpike = currentTotal;
      maxCategory = category;
      spikeAmount = currentTotal - prevTotal;
    }
  }
  
  if (maxSpike === 0) return null;
  
  return {
    id: 'category-spike',
    title: `Spike in ${maxCategory} this month`,
    detail: `Your ${maxCategory.toLowerCase()} spending increased by $${roundToWhole(spikeAmount)} this month. Consider if this reflects a one-time expense or a new spending pattern.`,
    impact: { monthly: roundToWhole(spikeAmount), annual: roundToWhole(spikeAmount * 12) },
    confidence: 0.8,
    tags: ['spending', 'categories'],
    evidence: { category: maxCategory, spike: spikeAmount }
  };
}

// Core Insight 5: Pace Projection
export function computePaceProjection(context: InsightsContext): Insight | null {
  if (context.dayOfMonth < 5) return null; // Need at least 5 days of data
  
  const currentCategories = groupByCategory(context.currentTransactions);
  let topCategory = '';
  let topSpend = 0;
  
  // Find top spending category
  for (const [category, transactions] of Object.entries(currentCategories)) {
    const spend = sum(transactions.map(t => Math.abs(t.amount)));
    if (spend > topSpend) {
      topSpend = spend;
      topCategory = category;
    }
  }
  
  if (topSpend === 0) return null;
  
  const projected = (topSpend / context.dayOfMonth) * context.daysInMonth;
  const prevCategorySpend = sum(
    filterByCategory(context.prevTransactions, topCategory)
      .map(t => Math.abs(t.amount))
  );
  
  const difference = Math.abs(projected - prevCategorySpend);
  const confidence = clamp(context.dayOfMonth / 15, 0.3, 0.9);
  
  return {
    id: 'pace-projection',
    title: `${topCategory} spending pace`,
    detail: `At your current pace, you'll spend $${roundToWhole(projected)} on ${topCategory.toLowerCase()} this month${prevCategorySpend > 0 ? ` (vs $${roundToWhole(prevCategorySpend)} last month)` : ''}.`,
    impact: { monthly: roundToWhole(difference), annual: roundToWhole(difference * 12) },
    confidence,
    tags: ['projection', 'spending'],
    evidence: { category: topCategory, projected, prevSpend: prevCategorySpend }
  };
}

// Core Insight 6: Discretionary Share & Cut Targets
export function computeDiscretionaryCuts(context: InsightsContext): Insight | null {
  const discretionarySpend = context.discretionaryExpenses;
  const totalExpenses = context.totalExpenses;
  
  if (totalExpenses === 0) return null;
  
  const discretionaryShare = discretionarySpend / totalExpenses;
  
  if (discretionaryShare <= 0.35) return null;
  
  const suggestedCut = discretionarySpend * 0.12; // 12% of discretionary
  const actionList: Record<string, number> = {};
  
  // Suggest cuts by category
  for (const category of DISCRETIONARY_CATEGORIES) {
    const categorySpend = sum(
      filterByCategory(context.currentTransactions, category)
        .map(t => Math.abs(t.amount))
    );
    if (categorySpend > 0) {
      actionList[category] = Math.min(categorySpend * 0.15, suggestedCut / 3);
    }
  }
  
  const confidence = clamp(discretionaryShare, 0.4, 0.9);
  
  return {
    id: 'discretionary-cuts',
    title: 'High discretionary spending detected',
    detail: `${Math.round(discretionaryShare * 100)}% of your spending is discretionary. Consider reducing by $${roundToWhole(suggestedCut)} monthly to improve savings.`,
    impact: { monthly: roundToWhole(suggestedCut), annual: roundToWhole(suggestedCut * 12) },
    confidence,
    tags: ['budgeting', 'savings'],
    evidence: { discretionaryShare, actionList }
  };
}

// Bonus Insight 7: No-Spend Day Streak
export function computeNoSpendStreak(context: InsightsContext): Insight | null {
  const discretionaryTransactions = context.currentTransactions.filter(t => 
    DISCRETIONARY_CATEGORIES.includes(t.category)
  );
  
  const daysWithSpending = new Set(
    discretionaryTransactions.map(t => t.date.toDateString())
  );
  
  const noSpendDays = context.daysInMonth - daysWithSpending.size;
  
  if (noSpendDays < 6) return null;
  
  const medianDailySpend = median(
    discretionaryTransactions.map(t => Math.abs(t.amount))
  );
  const monthlySavings = medianDailySpend * 4; // Add 1 no-spend day per week
  
  const confidence = clamp(noSpendDays / 10, 0.4, 0.8);
  
  return {
    id: 'no-spend-streak',
    title: 'Great no-spend day streak',
    detail: `You had ${noSpendDays} no-spend days this month. Adding one more no-spend day per week could save $${roundToWhole(monthlySavings)} monthly.`,
    impact: { monthly: roundToWhole(monthlySavings), annual: roundToWhole(monthlySavings * 12) },
    confidence,
    tags: ['habits', 'savings'],
    evidence: { noSpendDays, medianDailySpend }
  };
}

// Bonus Insight 8: Fee Detector
export function computeFeeDetector(context: InsightsContext): Insight | null {
  const feeTransactions = context.currentTransactions.filter(t => 
    containsKeywords(t.merchant, FEE_KEYWORDS) || 
    containsKeywords(t.description, FEE_KEYWORDS)
  );
  
  if (feeTransactions.length === 0) return null;
  
  const totalFees = sum(feeTransactions.map(t => Math.abs(t.amount)));
  const confidence = clamp(feeTransactions.length / 5, 0.5, 0.9);
  
  return {
    id: 'fee-detector',
    title: 'Bank fees detected',
    detail: `You paid $${roundToWhole(totalFees)} in fees this month. Review your account to avoid unnecessary charges.`,
    impact: { monthly: roundToWhole(totalFees), annual: roundToWhole(totalFees * 12) },
    confidence,
    tags: ['fees', 'banking'],
    evidence: { feeCount: feeTransactions.length, totalFees }
  };
}

// Bonus Insight 9: Duplicate/Possible Error Charges
export function computeDuplicateCharges(context: InsightsContext): Insight | null {
  const duplicates: Transaction[][] = [];
  const processed = new Set<string>();
  
  for (let i = 0; i < context.currentTransactions.length; i++) {
    const t1 = context.currentTransactions[i];
    if (processed.has(t1.id)) continue;
    
    const sameDaySameMerchant = context.currentTransactions.filter(t2 => 
      t2.id !== t1.id &&
      !processed.has(t2.id) &&
      isSameDay(t1.date, t2.date) &&
      t1.merchant === t2.merchant &&
      amountsMatch(t1.amount, t2.amount, 1.0)
    );
    
    if (sameDaySameMerchant.length > 0) {
      duplicates.push([t1, ...sameDaySameMerchant]);
      processed.add(t1.id);
      sameDaySameMerchant.forEach(t => processed.add(t.id));
    }
  }
  
  if (duplicates.length === 0) return null;
  
  const totalSuspected = sum(duplicates.map(group => 
    sum(group.map(t => Math.abs(t.amount)))
  ));
  
  const confidence = clamp(duplicates.length / 3, 0.5, 0.8);
  
  return {
    id: 'duplicate-charges',
    title: 'Possible duplicate charges',
    detail: `Found ${duplicates.length} potential duplicate charges totaling $${roundToWhole(totalSuspected)}. Review these transactions for accuracy.`,
    impact: { monthly: roundToWhole(totalSuspected), annual: roundToWhole(totalSuspected * 12) },
    confidence,
    tags: ['duplicates', 'review'],
    evidence: { duplicateGroups: duplicates.length, totalSuspected }
  };
}

// Bonus Insight 10: New or Rising Subscriptions (simplified)
export function computeNewOrRisingSubscriptions(context: InsightsContext): Insight | null {
  const subscriptionTransactions = filterByCategory(context.currentTransactions, 'Subscriptions');
  const prevSubscriptionTransactions = filterByCategory(context.prevTransactions, 'Subscriptions');
  
  if (subscriptionTransactions.length === 0) return null;
  
  const currentTotal = sum(subscriptionTransactions.map(t => Math.abs(t.amount)));
  const prevTotal = sum(prevSubscriptionTransactions.map(t => Math.abs(t.amount)));
  
  const increase = currentTotal - prevTotal;
  if (increase <= 0) return null;
  
  const confidence = clamp(increase / 50, 0.4, 0.8);
  
  return {
    id: 'new-subscriptions',
    title: 'New or increased subscriptions',
    detail: `Your subscription spending increased by $${roundToWhole(increase)} this month. Review if all services are still needed.`,
    impact: { monthly: roundToWhole(increase), annual: roundToWhole(increase * 12) },
    confidence,
    tags: ['subscriptions', 'review'],
    evidence: { currentTotal, prevTotal, increase }
  };
}

// Bonus Insight 11: Cash "Drips"
export function computeCashDrips(context: InsightsContext): Insight | null {
  const dripTransactions = context.currentTransactions.filter(t => 
    Math.abs(t.amount) < 10 && 
    DISCRETIONARY_CATEGORIES.includes(t.category)
  );
  
  if (dripTransactions.length < 8) return null; // Need at least 8 small transactions
  
  const amounts = dripTransactions.map(t => Math.abs(t.amount));
  const medianDrip = median(amounts);
  const suggestedReduction = Math.min(3, Math.floor(dripTransactions.length / 4));
  const monthlyImpact = suggestedReduction * medianDrip;
  
  const confidence = clamp(dripTransactions.length / 15, 0.4, 0.7);
  
  return {
    id: 'cash-drips',
    title: 'Small purchases add up',
    detail: `You made ${dripTransactions.length} small purchases under $10. Skipping ${suggestedReduction} per week could save $${roundToWhole(monthlyImpact)} monthly.`,
    impact: { monthly: roundToWhole(monthlyImpact), annual: roundToWhole(monthlyImpact * 12) },
    confidence,
    tags: ['small-purchases', 'habits'],
    evidence: { dripCount: dripTransactions.length, medianDrip, suggestedReduction }
  };
}

// Ranking and selection
export function rankAndSelectInsights(
  insights: Insight[], 
  totalMonthlyExpenses: number, 
  limit: number
): Insight[] {
  const scoredInsights = insights.map(insight => {
    const monthlyNormalized = Math.min(
      insight.impact.monthly / (totalMonthlyExpenses * 0.25), 
      1
    );
    const score = monthlyNormalized * 0.6 + insight.confidence * 0.4;
    return { insight, score };
  });
  
  return scoredInsights
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(item => item.insight);
}

// Main engine function
export function generateInsights(
  context: InsightsContext,
  limit: number = 6,
  extras: 'core' | 'all' = 'core'
): { insights: Insight[]; debug?: any } {
  const coreInsights = [
    computeCoffeeInsight(context),
    computeMerchantShift(context),
    computeWeekendRideshare(context),
    computeCategorySpike(context),
    computePaceProjection(context),
    computeDiscretionaryCuts(context)
  ].filter(Boolean) as Insight[];
  
  let allInsights = [...coreInsights];
  
  if (extras === 'all') {
    const bonusInsights = [
      computeNoSpendStreak(context),
      computeFeeDetector(context),
      computeDuplicateCharges(context),
      computeNewOrRisingSubscriptions(context),
      computeCashDrips(context)
    ].filter(Boolean) as Insight[];
    
    allInsights = [...coreInsights, ...bonusInsights];
  }
  
  const selectedInsights = rankAndSelectInsights(allInsights, context.totalExpenses, limit);
  
  return {
    insights: selectedInsights,
    debug: {
      generated: allInsights.length,
      core: coreInsights.length,
      bonus: extras === 'all' ? allInsights.length - coreInsights.length : 0
    }
  };
}
