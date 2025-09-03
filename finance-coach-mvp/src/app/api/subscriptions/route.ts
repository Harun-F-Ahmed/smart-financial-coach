import { NextResponse } from 'next/server';

interface SubscriptionsResponse {
  items: any[];
}

export async function GET() {
  try {
    // Placeholder response
    const response: SubscriptionsResponse = {
      items: []
    };
    
    return NextResponse.json(response, { status: 200 });
    
  } catch (error) {
    console.error('Error in subscriptions API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
