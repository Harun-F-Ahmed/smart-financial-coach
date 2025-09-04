import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface Transaction {
  id: string;
  date: Date;
  amount: number;
  merchant: string;
  category: string;
  accountId: string;
  description: string | null;
}

interface CategoryRollup {
  category: string;
  total: number;
}

interface DailySpend {
  date: string;
  spend: number;
}

interface TransactionResponse {
  month: string;
  items: Transaction[];
  rollups: {
    totals: {
      income: number;
      expenses: number;
      savings: number;
    };
    byCategory: CategoryRollup[];
    dailySpend: DailySpend[];
  };
  meta: {
    txCount: number;
  };
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const month = searchParams.get('month');
    
    // Validate month parameter
    if (!month || !/^\d{4}-\d{2}$/.test(month)) {
      return NextResponse.json(
        { error: 'Invalid month parameter. Use YYYY-MM format.' },
        { status: 400 }
      );
    }

    // Parse month and compute date range
    const [year, monthNum] = month.split('-').map(Number);
    const monthStart = new Date(year, monthNum - 1, 1); // month is 0-indexed
    const monthEnd = new Date(year, monthNum, 1); // first day of next month
    
    // Fetch transactions for the month
    const transactions = await prisma.transaction.findMany({
      where: {
        date: {
          gte: monthStart,
          lt: monthEnd
        }
      },
      orderBy: {
        date: 'asc'
      }
    });

    // Calculate totals
    const income = transactions
      .filter(t => t.amount > 0)
      .reduce((sum, t) => sum + t.amount, 0);
    
    const expenses = Math.abs(transactions
      .filter(t => t.amount < 0)
      .reduce((sum, t) => sum + t.amount, 0));
    
    const savings = income - expenses;

    // Group by category (expenses only)
    const categoryMap = new Map<string, number>();
    transactions
      .filter(t => t.amount < 0) // Only include expenses
      .forEach(t => {
        const current = categoryMap.get(t.category) || 0;
        categoryMap.set(t.category, current + Math.abs(t.amount));
      });

    const byCategory: CategoryRollup[] = Array.from(categoryMap.entries())
      .map(([category, total]) => ({ category, total }))
      .sort((a, b) => b.total - a.total);

    // Calculate daily spend (sum of absolute values of negative amounts per day)
    const dailySpendMap = new Map<string, number>();
    transactions
      .filter(t => t.amount < 0)
      .forEach(t => {
        const dateStr = t.date.toISOString().split('T')[0];
        const current = dailySpendMap.get(dateStr) || 0;
        dailySpendMap.set(dateStr, current + Math.abs(t.amount));
      });

    const dailySpend: DailySpend[] = Array.from(dailySpendMap.entries())
      .map(([date, spend]) => ({ date, spend }))
      .sort((a, b) => a.date.localeCompare(b.date));

    const response: TransactionResponse = {
      month,
      items: transactions,
      rollups: {
        totals: {
          income,
          expenses,
          savings
        },
        byCategory,
        dailySpend
      },
      meta: {
        txCount: transactions.length
      }
    };
    
    return NextResponse.json(response, { status: 200 });
    
  } catch (error) {
    console.error('Error in transactions API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
