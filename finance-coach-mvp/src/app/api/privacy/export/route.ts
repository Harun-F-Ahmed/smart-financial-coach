import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    // Fetch all transactions
    const transactions = await prisma.transaction.findMany({
      orderBy: { date: 'asc' }
    });

    // Convert to CSV format
    const csvHeader = 'id,date,amount,merchant,category,accountId,description\n';
    const csvRows = transactions.map(tx => 
      `${tx.id},${tx.date.toISOString().split('T')[0]},${tx.amount},"${tx.merchant}","${tx.category}","${tx.accountId}","${tx.description || ''}"`
    ).join('\n');
    
    const csvContent = csvHeader + csvRows;

    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="finance-data-${new Date().toISOString().split('T')[0]}.csv"`
      }
    });
  } catch (error) {
    console.error('Error exporting data:', error);
    return NextResponse.json(
      { error: 'Failed to export data' },
      { status: 500 }
    );
  }
}
