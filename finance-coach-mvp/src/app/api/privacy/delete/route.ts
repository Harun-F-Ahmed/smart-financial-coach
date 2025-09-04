import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST() {
  try {
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
      { error: 'Failed to delete data' },
      { status: 500 }
    );
  }
}
