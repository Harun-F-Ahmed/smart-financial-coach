import { NextRequest, NextResponse } from 'next/server';

interface TransactionResponse {
  month: string;
  items: any[];
  rollups: {
    categories: any[];
  };
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const month = searchParams.get('month');
    
    // Basic validation
    if (!month || !/^\d{4}-\d{2}$/.test(month)) {
      return NextResponse.json(
        { error: 'Invalid month parameter. Use YYYY-MM format.' },
        { status: 400 }
      );
    }
    
    // Placeholder response
    const response: TransactionResponse = {
      month,
      items: [],
      rollups: {
        categories: []
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
