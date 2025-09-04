import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Check if AI features are enabled server-side
    const aiEnabled = process.env.AI_FEATURES_ENABLED === 'true';
    
    return NextResponse.json({
      aiEnabled,
      timestamp: new Date().toISOString(),
      version: '1.0.0'
    });
  } catch (error) {
    console.error('Error checking privacy status:', error);
    return NextResponse.json(
      { error: 'Failed to check privacy status' },
      { status: 500 }
    );
  }
}
