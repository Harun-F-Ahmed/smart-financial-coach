import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkSeed() {
  try {
    console.log('🔍 Checking seeded database...\n');
    
    // Get total transaction count
    const totalCount = await prisma.transaction.count();
    console.log(`📊 Total transactions: ${totalCount}\n`);
    
    // Group by merchant and get top 5 by count
    const merchantStats = await prisma.transaction.groupBy({
      by: ['merchant'],
      _count: {
        merchant: true
      },
      orderBy: {
        _count: {
          merchant: 'desc'
        }
      },
      take: 5
    });
    
    console.log('🏪 Top 5 merchants by transaction count:');
    merchantStats.forEach((stat, index) => {
      console.log(`${index + 1}. ${stat.merchant}: ${stat._count.merchant} transactions`);
    });
    
    // Show some sample data
    console.log('\n📋 Sample transactions:');
    const samples = await prisma.transaction.findMany({
      take: 5,
      orderBy: {
        date: 'asc'
      }
    });
    
    samples.forEach(t => {
      console.log(`  ${t.date.toISOString().split('T')[0]} | $${t.amount.toFixed(2)} | ${t.merchant} | ${t.category}`);
    });
    
  } catch (error) {
    console.error('❌ Error checking database:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

checkSeed();
