import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Types for the subscription detection logic
interface Transaction {
  id: string;
  date: Date;
  amount: number;
  merchant: string;
  category: string;
  accountId: string;
  description: string | null;
}

interface TransactionGroup {
  merchant: string;
  amount: number;
  transactions: Transaction[];
}

interface SubscriptionFeatures {
  n: number;
  periodicityStrength: number;
  amountStability: number;
  domStability: number;
  recencyBoost: number;
}

interface SubscriptionItem {
  merchant: string;
  periodicityDays: number;
  subscriptionType: string;
  monthlyEstimate: number;
  lastCharge: string;
  nextExpected: string;
  isGray: boolean;
  confidence: number;
  features: SubscriptionFeatures;
}

interface SubscriptionsResponse {
  items: SubscriptionItem[];
  minConfidence: number;
  totalDetected: number;
}

// Helper function to check if two amounts are within tolerance
function amountsMatch(amount1: number, amount2: number): boolean {
  const abs1 = Math.abs(amount1);
  const abs2 = Math.abs(amount2);
  const larger = Math.max(abs1, abs2);
  const smaller = Math.min(abs1, abs2);
  
  // Strategy: Use ±2% OR ±$1, whichever is more permissive
  const percentDiff = (larger - smaller) / larger;
  const dollarDiff = larger - smaller;
  
  return percentDiff <= 0.02 || dollarDiff <= 1.0;
}

// Helper function to compute median
function median(values: number[]): number {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0 
    ? (sorted[mid - 1] + sorted[mid]) / 2 
    : sorted[mid];
}

// Helper function to compute standard deviation
function standardDeviation(values: number[]): number {
  if (values.length === 0) return 0;
  const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
  const squaredDiffs = values.map(val => Math.pow(val - mean, 2));
  const avgSquaredDiff = squaredDiffs.reduce((sum, val) => sum + val, 0) / values.length;
  return Math.sqrt(avgSquaredDiff);
}

// Helper function to compute mean absolute deviation
function meanAbsoluteDeviation(values: number[]): number {
  if (values.length === 0) return 0;
  const med = median(values);
  const absDiffs = values.map(val => Math.abs(val - med));
  return absDiffs.reduce((sum, val) => sum + val, 0) / values.length;
}

// Helper function to clamp value between min and max
function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

// Helper function to get day of month from date
function getDayOfMonth(date: Date): number {
  return date.getDate();
}

export async function GET(request: NextRequest): Promise<NextResponse<SubscriptionsResponse | { error: string }>> {
  try {
    // Get minimum confidence threshold from query parameter (default 0.6)
    const { searchParams } = new URL(request.url);
    const minConfidenceParam = searchParams.get('minConfidence');
    const MIN_CONFIDENCE = minConfidenceParam ? parseFloat(minConfidenceParam) : 0.6;
    
    // Validate confidence threshold
    if (MIN_CONFIDENCE < 0 || MIN_CONFIDENCE > 1) {
      return NextResponse.json(
        { error: 'minConfidence must be between 0 and 1' },
        { status: 400 }
      );
    }
    
    // Fetch all transactions from the database
    const transactions = await prisma.transaction.findMany({
      orderBy: { date: 'asc' }
    });

    if (transactions.length === 0) {
      return NextResponse.json({ 
        items: [], 
        minConfidence: MIN_CONFIDENCE, 
        totalDetected: 0 
      });
    }

    // Group transactions by merchant and amount (within tolerance)
    // Only consider expense transactions (negative amounts) for subscription detection
    const expenseTransactions = transactions.filter(t => t.amount < 0);
    const groups: TransactionGroup[] = [];
    
    for (const transaction of expenseTransactions) {
      let addedToGroup = false;
      
      // Try to find an existing group for this merchant+amount combination
      for (const group of groups) {
        if (group.merchant === transaction.merchant && 
            amountsMatch(group.amount, transaction.amount)) {
          group.transactions.push(transaction);
          addedToGroup = true;
          break;
        }
      }
      
      // If no matching group found, create a new one
      if (!addedToGroup) {
        groups.push({
          merchant: transaction.merchant,
          amount: transaction.amount,
          transactions: [transaction]
        });
      }
    }


    // Process each group to detect subscriptions
    const subscriptions: SubscriptionItem[] = [];
    
    for (const group of groups) {
      if (group.transactions.length < 2) continue;
      
      // Sort transactions by date
      const sortedTransactions = group.transactions.sort((a, b) => 
        a.date.getTime() - b.date.getTime()
      );
      
      // Compute inter-arrival deltas (days)
      const deltas: number[] = [];
      for (let i = 1; i < sortedTransactions.length; i++) {
        const diffTime = sortedTransactions[i].date.getTime() - sortedTransactions[i-1].date.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        deltas.push(diffDays);
      }
      
      const medianInterval = median(deltas);
      const madInterval = meanAbsoluteDeviation(deltas);
      
      
      // Check if this group qualifies as a subscription
      // Support multiple subscription patterns:
      // - Weekly: 6-8 days
      // - Bi-weekly: 13-15 days  
      // - Monthly: 28-32 days
      // - Quarterly: 85-95 days
      // - Annual: 360-370 days
      const isWeekly = medianInterval >= 6 && medianInterval <= 8;
      const isBiWeekly = medianInterval >= 13 && medianInterval <= 15;
      const isMonthly = medianInterval >= 28 && medianInterval <= 32;
      const isQuarterly = medianInterval >= 85 && medianInterval <= 95;
      const isAnnual = medianInterval >= 360 && medianInterval <= 370;
      
      if (group.transactions.length >= 3 && (isWeekly || isBiWeekly || isMonthly || isQuarterly || isAnnual)) {
        // Compute features for confidence scoring
        const n = group.transactions.length;
        
        // Periodicity strength: how consistent the intervals are
        const periodicityStrength = clamp(1 - (madInterval / medianInterval), 0, 1);
        
        // Amount stability: how consistent the amounts are
        const amounts = group.transactions.map(t => Math.abs(t.amount));
        const amountMean = amounts.reduce((sum, val) => sum + val, 0) / amounts.length;
        const amountStd = standardDeviation(amounts);
        const amountCV = amountMean > 0 ? amountStd / amountMean : 0;
        const amountStability = clamp(1 - amountCV, 0, 1);
        
        // Day of month stability: how consistent the billing day is
        const daysOfMonth = group.transactions.map(t => getDayOfMonth(t.date));
        const domStd = standardDeviation(daysOfMonth);
        const domStability = clamp(1 - (domStd / 15), 0, 1);
        
        // Recency boost: recent activity gets a boost
        const lastCharge = sortedTransactions[sortedTransactions.length - 1].date;
        const daysSinceLastCharge = Math.ceil((Date.now() - lastCharge.getTime()) / (1000 * 60 * 60 * 24));
        const recencyBoost = daysSinceLastCharge <= 40 ? 1 : daysSinceLastCharge <= 90 ? 0.5 : 0;
        
        // Compute confidence score
        const confidence = 0.45 * periodicityStrength + 
                          0.25 * amountStability + 
                          0.15 * domStability + 
                          0.10 * Math.min(1, n / 4) + 
                          0.05 * recencyBoost;
        
        // Determine if this is a gray charge
        const firstSeenWithin30d = group.transactions.length === 1 && 
          daysSinceLastCharge <= 30;
        
        const hasTrialKeywords = group.transactions.some(t => 
          t.description && /trial|renewal|promo/i.test(t.description)
        );
        
        const isGray = firstSeenWithin30d || 
                      hasTrialKeywords || 
                      (group.transactions.length <= 2 && confidence >= 0.6);
        
        // Determine subscription type
        let subscriptionType = 'custom';
        if (isWeekly) subscriptionType = 'weekly';
        else if (isBiWeekly) subscriptionType = 'bi-weekly';
        else if (isMonthly) subscriptionType = 'monthly';
        else if (isQuarterly) subscriptionType = 'quarterly';
        else if (isAnnual) subscriptionType = 'annual';
        
        // Calculate next expected date
        const nextExpectedDate = new Date(lastCharge);
        nextExpectedDate.setDate(nextExpectedDate.getDate() + medianInterval);
        
        // Only include subscriptions above minimum confidence threshold
        if (confidence >= MIN_CONFIDENCE) {
          subscriptions.push({
            merchant: group.merchant,
            periodicityDays: Math.round(medianInterval),
            subscriptionType,
            monthlyEstimate: Math.abs(group.amount),
            lastCharge: lastCharge.toISOString().split('T')[0],
            nextExpected: nextExpectedDate.toISOString().split('T')[0],
            isGray,
            confidence: Math.round(confidence * 100) / 100,
            features: {
              n,
              periodicityStrength: Math.round(periodicityStrength * 100) / 100,
              amountStability: Math.round(amountStability * 100) / 100,
              domStability: Math.round(domStability * 100) / 100,
              recencyBoost: Math.round(recencyBoost * 100) / 100
            }
          });
        }
      }
    }
    
    // Sort by confidence descending
    subscriptions.sort((a, b) => b.confidence - a.confidence);
    
    return NextResponse.json({ 
      items: subscriptions,
      minConfidence: MIN_CONFIDENCE,
      totalDetected: subscriptions.length
    });
    
  } catch (error) {
    console.error('Error in subscriptions API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
