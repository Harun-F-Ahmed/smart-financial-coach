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
  const startDate = new Date('2023-01-01');
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
  
  // Subscription amounts - different frequencies
  const monthlySubscriptions = [
    { merchant: 'Netflix', amount: 15.99, category: 'Subscriptions' },
    { merchant: 'Spotify', amount: 10.99, category: 'Subscriptions' },
    { merchant: 'Apple iCloud', amount: 2.99, category: 'Subscriptions' }
  ];
  
  const weeklySubscriptions = [
    { merchant: 'Blue Apron', amount: 12.99, category: 'Subscriptions' },
    { merchant: 'HelloFresh', amount: 14.99, category: 'Subscriptions' }
  ];
  
  const biWeeklySubscriptions = [
    { merchant: 'Gym Membership', amount: 25.00, category: 'Subscriptions' },
    { merchant: 'Cleaning Service', amount: 45.00, category: 'Subscriptions' }
  ];
  
  const quarterlySubscriptions = [
    { merchant: 'Adobe Creative', amount: 52.99, category: 'Subscriptions' },
    { merchant: 'Microsoft 365', amount: 29.99, category: 'Subscriptions' }
  ];
  
  const annualSubscriptions = [
    { merchant: 'Amazon Prime', amount: 139.00, category: 'Subscriptions' },
    { merchant: 'Costco Membership', amount: 60.00, category: 'Subscriptions' }
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
    
    // Monthly subscriptions (Netflix on 15th, Spotify on 16th, iCloud on 17th)
    if (currentDate.getDate() === 15) {
      transactions.push({
        date: dateStr,
        amount: -monthlySubscriptions[0].amount,
        merchant: monthlySubscriptions[0].merchant,
        category: monthlySubscriptions[0].category,
        account_id: 'acc_001',
        description: 'Monthly subscription'
      });
    }
    if (currentDate.getDate() === 16) {
      transactions.push({
        date: dateStr,
        amount: -monthlySubscriptions[1].amount,
        merchant: monthlySubscriptions[1].merchant,
        category: monthlySubscriptions[1].category,
        account_id: 'acc_001',
        description: 'Monthly subscription'
      });
    }
    if (currentDate.getDate() === 17) {
      transactions.push({
        date: dateStr,
        amount: -monthlySubscriptions[2].amount,
        merchant: monthlySubscriptions[2].merchant,
        category: monthlySubscriptions[2].category,
        account_id: 'acc_001',
        description: 'Monthly subscription'
      });
    }
    
    // Weekly subscriptions (Blue Apron on Mondays, HelloFresh on Wednesdays)
    if (currentDate.getDay() === 1) { // Monday
      transactions.push({
        date: dateStr,
        amount: -weeklySubscriptions[0].amount,
        merchant: weeklySubscriptions[0].merchant,
        category: weeklySubscriptions[0].category,
        account_id: 'acc_001',
        description: 'Weekly subscription'
      });
    }
    if (currentDate.getDay() === 3) { // Wednesday
      transactions.push({
        date: dateStr,
        amount: -weeklySubscriptions[1].amount,
        merchant: weeklySubscriptions[1].merchant,
        category: weeklySubscriptions[1].category,
        account_id: 'acc_001',
        description: 'Weekly subscription'
      });
    }
    
    // Bi-weekly subscriptions (Gym on 1st and 15th, Cleaning on 3rd and 17th)
    if (currentDate.getDate() === 1 || currentDate.getDate() === 15) {
      transactions.push({
        date: dateStr,
        amount: -biWeeklySubscriptions[0].amount,
        merchant: biWeeklySubscriptions[0].merchant,
        category: biWeeklySubscriptions[0].category,
        account_id: 'acc_001',
        description: 'Bi-weekly subscription'
      });
    }
    if (currentDate.getDate() === 3 || currentDate.getDate() === 17) {
      transactions.push({
        date: dateStr,
        amount: -biWeeklySubscriptions[1].amount,
        merchant: biWeeklySubscriptions[1].merchant,
        category: biWeeklySubscriptions[1].category,
        account_id: 'acc_001',
        description: 'Bi-weekly subscription'
      });
    }
    
    // Quarterly subscriptions (Adobe on Jan 1, Microsoft on Jan 15)
    if ((currentDate.getMonth() === 0 && currentDate.getDate() === 1) || 
        (currentDate.getMonth() === 3 && currentDate.getDate() === 1) ||
        (currentDate.getMonth() === 6 && currentDate.getDate() === 1) ||
        (currentDate.getMonth() === 9 && currentDate.getDate() === 1)) {
      transactions.push({
        date: dateStr,
        amount: -quarterlySubscriptions[0].amount,
        merchant: quarterlySubscriptions[0].merchant,
        category: quarterlySubscriptions[0].category,
        account_id: 'acc_001',
        description: 'Quarterly subscription'
      });
    }
    if ((currentDate.getMonth() === 0 && currentDate.getDate() === 15) || 
        (currentDate.getMonth() === 3 && currentDate.getDate() === 15) ||
        (currentDate.getMonth() === 6 && currentDate.getDate() === 15) ||
        (currentDate.getMonth() === 9 && currentDate.getDate() === 15)) {
      transactions.push({
        date: dateStr,
        amount: -quarterlySubscriptions[1].amount,
        merchant: quarterlySubscriptions[1].merchant,
        category: quarterlySubscriptions[1].category,
        account_id: 'acc_001',
        description: 'Quarterly subscription'
      });
    }
    
    // Annual subscriptions (Amazon Prime on Jan 1, Costco on Feb 1)
    if (currentDate.getMonth() === 0 && currentDate.getDate() === 1) {
      transactions.push({
        date: dateStr,
        amount: -annualSubscriptions[0].amount,
        merchant: annualSubscriptions[0].merchant,
        category: annualSubscriptions[0].category,
        account_id: 'acc_001',
        description: 'Annual subscription'
      });
    }
    if (currentDate.getMonth() === 1 && currentDate.getDate() === 1) {
      transactions.push({
        date: dateStr,
        amount: -annualSubscriptions[1].amount,
        merchant: annualSubscriptions[1].merchant,
        category: annualSubscriptions[1].category,
        account_id: 'acc_001',
        description: 'Annual subscription'
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
