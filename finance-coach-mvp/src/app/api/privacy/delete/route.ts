import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { password } = body;

    // Verify password
    if (password !== 'DELETE') {
      return NextResponse.json({ error: 'Invalid password. Please enter "DELETE" to confirm.' }, { status: 400 });
    }

    // Delete all transactions
    const result = await prisma.transaction.deleteMany({});
    
    return NextResponse.json({
      message: 'All data deleted successfully',
      deletedCount: result.count,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error deleting data:', error);
    return NextResponse.json(
      { error: 'Failed to delete data. Please try again.' },
      { status: 500 }
    );
  }
}
