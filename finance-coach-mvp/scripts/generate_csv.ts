import { writeFileSync } from 'fs';
import { join } from 'path';

interface Transaction {
  date: string;
  amount: number;
  merchant: string;
  category: string;
  account_id: string;
  description: string;
}

function generateTransactions(): Transaction[] {
  const transactions: Transaction[] = [];
  const startDate = new Date('2024-01-01');
  const endDate = new Date('2024-03-31');
  
  // Coffee merchants and amounts
  const coffeeMerchants = ['Starbucks', 'Dunkin', 'Local Coffee'];
  const coffeeAmounts = [3.5, 4.25, 5.5];
  
  // Rideshare merchants and amounts
  const rideshareMerchants = ['Uber', 'Lyft'];
  const rideshareAmounts = [12, 18, 24, 30];
  
  // Grocery amounts
  const groceryAmounts = [55, 72, 96, 120];
  
  // Restaurant merchants and amounts
  const restaurantMerchants = ['Chipotle', 'Sweetgreen', 'Local Bistro'];
  const restaurantAmounts = [25, 32, 45, 60];
  
  // Subscription amounts
  const subscriptions = [
    { merchant: 'Netflix', amount: 15.99, category: 'Subscriptions' },
    { merchant: 'Spotify', amount: 10.99, category: 'Subscriptions' },
    { merchant: 'Apple iCloud', amount: 2.99, category: 'Subscriptions' }
  ];
  
  let currentDate = new Date(startDate);
  
  while (currentDate <= endDate) {
    const dateStr = currentDate.toISOString().split('T')[0];
    const dayOfWeek = currentDate.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    const isFriday = dayOfWeek === 5;
    const isFirstOrFifteenth = currentDate.getDate() === 1 || currentDate.getDate() === 15;
    
    // Payroll deposits (1st and 15th)
    if (isFirstOrFifteenth) {
      transactions.push({
        date: dateStr,
        amount: 1800,
        merchant: 'Employer',
        category: 'Income',
        account_id: 'acc_001',
        description: 'Salary deposit'
      });
    }
    
    // Monthly subscriptions (around the 15th-20th of each month)
    if (currentDate.getDate() >= 15 && currentDate.getDate() <= 20) {
      subscriptions.forEach(sub => {
        transactions.push({
          date: dateStr,
          amount: -sub.amount,
          merchant: sub.merchant,
          category: sub.category,
          account_id: 'acc_001',
          description: 'Monthly subscription'
        });
      });
    }
    
    // Coffee purchases (most days, 0-2 per day)
    const coffeeCount = Math.random() < 0.8 ? (Math.random() < 0.6 ? 1 : 2) : 0;
    for (let i = 0; i < coffeeCount; i++) {
      const merchant = coffeeMerchants[Math.floor(Math.random() * coffeeMerchants.length)];
      const amount = coffeeAmounts[Math.floor(Math.random() * coffeeAmounts.length)];
      transactions.push({
        date: dateStr,
        amount: -amount,
        merchant,
        category: 'Coffee',
        account_id: 'acc_001',
        description: 'Coffee purchase'
      });
    }
    
    // Weekend rideshare spikes
    if (isWeekend && Math.random() < 0.7) {
      const merchant = rideshareMerchants[Math.floor(Math.random() * rideshareMerchants.length)];
      const amount = rideshareAmounts[Math.floor(Math.random() * rideshareAmounts.length)];
      transactions.push({
        date: dateStr,
        amount: -amount,
        merchant,
        category: 'Rideshare',
        account_id: 'acc_001',
        description: 'Weekend ride'
      });
    }
    
    // Weekly groceries (every 7-10 days)
    if (currentDate.getDate() % 7 === 0 || currentDate.getDate() % 10 === 0) {
      const amount = groceryAmounts[Math.floor(Math.random() * groceryAmounts.length)];
      transactions.push({
        date: dateStr,
        amount: -amount,
        merchant: 'Whole Foods',
        category: 'Groceries',
        account_id: 'acc_001',
        description: 'Grocery shopping'
      });
    }
    
    // Friday restaurants
    if (isFriday && Math.random() < 0.8) {
      const merchant = restaurantMerchants[Math.floor(Math.random() * restaurantMerchants.length)];
      const amount = restaurantAmounts[Math.floor(Math.random() * restaurantAmounts.length)];
      transactions.push({
        date: dateStr,
        amount: -amount,
        merchant,
        category: 'Restaurants',
        account_id: 'acc_001',
        description: 'Friday dinner'
      });
    }
    
    // Move to next day
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  // Add anomaly: expensive restaurant charge last month
  transactions.push({
    date: '2024-02-15',
    amount: -210,
    merchant: 'Fancy Restaurant',
    category: 'Restaurants',
    account_id: 'acc_001',
    description: 'Birthday dinner celebration'
  });
  
  // Add gray charge: forgotten trial in newest month
  transactions.push({
    date: '2024-03-25',
    amount: -7.99,
    merchant: 'MagApp Pro',
    category: 'Subscriptions',
    account_id: 'acc_001',
    description: 'Forgotten trial → paid'
  });
  
  // Sort by date ascending
  return transactions.sort((a, b) => a.date.localeCompare(b.date));
}

function main() {
  try {
    console.log('📊 Generating synthetic transaction data...');
    
    const transactions = generateTransactions();
    const csvContent = [
      'date,amount,merchant,category,account_id,description',
      ...transactions.map(t => 
        `${t.date},${t.amount},${t.merchant},${t.category},${t.account_id},${t.description}`
      )
    ].join('\n');
    
    const outputPath = join(process.cwd(), 'data', 'transactions.csv');
    writeFileSync(outputPath, csvContent, 'utf-8');
    
    console.log(`✅ Generated ${transactions.length} transactions`);
    console.log(`📁 Saved to: ${outputPath}`);
    
    // Summary statistics
    const income = transactions.filter(t => t.amount > 0).reduce((sum, t) => sum + t.amount, 0);
    const expenses = transactions.filter(t => t.amount < 0).reduce((sum, t) => sum + Math.abs(t.amount), 0);
    const net = income - expenses;
    
    console.log(`💰 Income: $${income.toFixed(2)}`);
    console.log(`💸 Expenses: $${expenses.toFixed(2)}`);
    console.log(`📈 Net: $${net.toFixed(2)}`);
    
  } catch (error) {
    console.error('❌ Error generating CSV:', error);
    process.exit(1);
  }
}

main();
