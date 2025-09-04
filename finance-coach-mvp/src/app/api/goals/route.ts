import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { processGoalsRequest, GoalsRequest, GoalsResponse } from '../../../lib/goals/index';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { targetAmount, months, by, extras, aiSuggest } = body;
    
    // Validation
    if (typeof targetAmount !== 'number' || targetAmount <= 0) {
      return NextResponse.json(
        { 
          error: 'Invalid targetAmount', 
          hint: 'Must be a positive number' 
        },
        { status: 400 }
      );
    }
    
    if (months !== undefined) {
      if (typeof months !== 'number' || months <= 0 || months > 120) {
        return NextResponse.json(
          { 
            error: 'Invalid months', 
            hint: 'Must be between 1 and 120' 
          },
          { status: 400 }
        );
      }
    }
    
    if (by !== undefined) {
      if (typeof by !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(by)) {
        return NextResponse.json(
          { 
            error: 'Invalid by date', 
            hint: 'Use YYYY-MM-DD format' 
          },
          { status: 400 }
        );
      }
    }
    
    if (!months && !by) {
      return NextResponse.json(
        { 
          error: 'Missing timeline', 
          hint: 'Provide either months or by date' 
        },
        { status: 400 }
      );
    }
    
    if (months && by) {
      return NextResponse.json(
        { 
          error: 'Conflicting timeline', 
          hint: 'Provide either months or by date, not both' 
        },
        { status: 400 }
      );
    }
    
    // Fetch all transactions
    const allTransactions = await prisma.transaction.findMany({
      orderBy: { date: 'asc' }
    });
    
    if (allTransactions.length === 0) {
      return NextResponse.json(
        { 
          error: 'No transaction data', 
          hint: 'Need transaction history to generate goals analysis' 
        },
        { status: 400 }
      );
    }
    
    // TODO: Get gray subscriptions from subscriptions API
    // For now, we'll use an empty array
    const graySubscriptions: Array<{ merchant: string; monthlyEstimate: number }> = [];
    
    // Process the goals request
    const goalsRequest: GoalsRequest = {
      targetAmount,
      months,
      by,
      extras,
      aiSuggest
    };
    
    const response: GoalsResponse = processGoalsRequest(
      goalsRequest,
      allTransactions,
      graySubscriptions
    );
    
    return NextResponse.json(response, { status: 200 });
    
  } catch (error) {
    console.error('Error in goals API:', error);
    
    if (error instanceof Error) {
      return NextResponse.json(
        { 
          error: 'Invalid request', 
          hint: error.message 
        },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
