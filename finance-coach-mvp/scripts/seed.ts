import { PrismaClient } from '@prisma/client';
import { readFileSync } from 'fs';
import { join } from 'path';

const prisma = new PrismaClient();

interface TransactionRow {
  date: string;
  amount: string;
  merchant: string;
  category: string;
  account_id: string;
  description: string;
}

function parseCSV(csvContent: string): TransactionRow[] {
  const lines = csvContent.trim().split('\n');
  const headers = lines[0].split(',').map(h => h.trim());
  const rows: TransactionRow[] = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    const values: string[] = [];
    let current = '';
    let inQuotes = false;
    
    for (let j = 0; j < line.length; j++) {
      const char = line[j];
      
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        values.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    values.push(current.trim());
    
    const row: any = {};
    headers.forEach((header, index) => {
      row[header] = values[index] || '';
    });
    
    rows.push(row as TransactionRow);
  }
  
  return rows;
}

async function seed() {
  try {
    console.log('🌱 Starting database seed...');
    
    // Read CSV file
    const csvPath = join(process.cwd(), 'data', 'transactions.csv');
    const csvContent = readFileSync(csvPath, 'utf-8');
    
    // Parse CSV
    const transactions = parseCSV(csvContent);
    console.log(`📊 Parsed ${transactions.length} transactions from CSV`);
    
    // Clear existing data
    console.log('🗑️  Clearing existing transactions...');
    await prisma.transaction.deleteMany();
    
    // Insert new data
    console.log('💾 Inserting transactions...');
    const inserted = await prisma.transaction.createMany({
      data: transactions.map(row => ({
        date: new Date(row.date),
        amount: parseFloat(row.amount),
        merchant: row.merchant,
        category: row.category,
        accountId: row.account_id,
        description: row.description || null,
      })),
    });
    
    console.log(`✅ Seeded ${inserted.count} transactions`);
    
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

seed();
