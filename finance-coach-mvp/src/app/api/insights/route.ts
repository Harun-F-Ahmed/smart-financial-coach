import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { 
  parseMonth, getPreviousMonth, getDaysInMonth, getDayOfMonth,
  filterByDateRange, groupByCategory, getExpenseAmounts, sum,
  DISCRETIONARY_CATEGORIES, Transaction
} from '../../../lib/insights/util';
import { generateInsights, InsightsContext } from '../../../lib/insights/engine';

const prisma = new PrismaClient();

interface InsightsResponse {
  month: string;
  insights: any[];
  meta: {
    txCount: number;
    hasPrevMonth: boolean;
    totalExpenses: number;
    discretionaryExpenses: number;
    selection: { generated: number; returned: number };
    debug?: any;
  };
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const month = searchParams.get('month');
    const limit = parseInt(searchParams.get('limit') || '6');
    const extras = (searchParams.get('extras') || 'core') as 'core' | 'all';
    const debug = searchParams.get('debug') === '1';
    
    // Validation
    if (!month || !/^\d{4}-\d{2}$/.test(month)) {
      return NextResponse.json(
        { 
          error: 'Invalid month parameter', 
          hint: 'Use YYYY-MM format (e.g., 2024-01)' 
        },
        { status: 400 }
      );
    }
    
    if (limit < 1 || limit > 20) {
      return NextResponse.json(
        { error: 'Invalid limit parameter', hint: 'Must be between 1 and 20' },
        { status: 400 }
      );
    }
    
    // Date calculations
    const monthStart = parseMonth(month).start;
    const monthEnd = parseMonth(month).end;
    const prevMonthRange = getPreviousMonth(month);
    const daysInMonth = getDaysInMonth(month);
    const dayOfMonth = Math.min(getDayOfMonth(new Date()), daysInMonth);
    
    // Fetch transactions
    const allTransactions = await prisma.transaction.findMany({
      orderBy: { date: 'asc' }
    });
    
    const currentTransactions = filterByDateRange(allTransactions, { start: monthStart, end: monthEnd });
    const prevTransactions = filterByDateRange(allTransactions, { start: prevMonthRange.start, end: prevMonthRange.end });
    
    // Calculate totals
    const totalExpenses = sum(getExpenseAmounts(currentTransactions));
    const discretionaryExpenses = sum(
      DISCRETIONARY_CATEGORIES.flatMap(category => 
        getExpenseAmounts(filterByDateRange(
          allTransactions.filter(t => t.category === category),
          { start: monthStart, end: monthEnd }
        ))
      )
    );
    
    // Create context for insights engine
    const context: InsightsContext = {
      monthStart,
      monthEnd,
      prevMonthStart: prevMonthRange.start,
      prevMonthEnd: prevMonthRange.end,
      currentTransactions,
      prevTransactions,
      totalExpenses,
      discretionaryExpenses,
      daysInMonth,
      dayOfMonth
    };
    
    // Generate insights
    const { insights, debug: debugInfo } = generateInsights(context, limit, extras);
    
    const response: InsightsResponse = {
      month,
      insights,
      meta: {
        txCount: currentTransactions.length,
        hasPrevMonth: prevTransactions.length > 0,
        totalExpenses: Math.round(totalExpenses),
        discretionaryExpenses: Math.round(discretionaryExpenses),
        selection: {
          generated: debugInfo?.generated || 0,
          returned: insights.length
        },
        ...(debug && { debug: debugInfo })
      }
    };
    
    return NextResponse.json(response, { status: 200 });
    
  } catch (error) {
    console.error('Error in insights API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
