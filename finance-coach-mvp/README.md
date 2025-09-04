# Finance Coach MVP

A financial management demo built with Next.js, TypeScript, and Prisma. This hackathon project showcases full-stack development skills with synthetic transaction data analysis.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Set up database
npx prisma migrate dev --name init
npx prisma generate

# Generate sample data
npm run gen:csv
npm run seed

# Start development server
npm run dev
```

Visit `http://localhost:3000` to see the demo.

## ✨ Features

- **Dashboard**: Financial overview with KPIs and charts
- **Insights**: Spending pattern analysis with 11+ detectors
- **Subscriptions**: Automatic recurring charge detection
- **Goals**: Savings planning with forecasting algorithms
- **Privacy Controls**: Data export and deletion

## 🛠 Tech Stack

- **Next.js** - App Router, API Routes
- **TypeScript** - Full type safety
- **Prisma + SQLite** - Database and ORM
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **Recharts** - Data visualizations

## 📊 Analytics Engine

Custom algorithms for:
- Coffee spending pattern detection
- Weekend rideshare spike analysis
- Subscription detection with confidence scoring
- Category anomaly detection
- Savings goal forecasting (mean, regression, exponential smoothing)

## 🔧 API Endpoints

- `GET /api/transactions` - Monthly transaction data
- `GET /api/insights` - Spending analysis
- `GET /api/subscriptions` - Recurring charges
- `POST /api/goals` - Savings planning
- `GET /api/privacy/export` - Data export
- `POST /api/privacy/delete` - Data deletion

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API endpoints
│   ├── dashboard/         # Financial overview
│   ├── insights/          # Spending analysis
│   ├── subscriptions/     # Recurring charges
│   └── goals/             # Savings planning
├── lib/                   # Business logic
│   ├── insights/          # Analytics engine
│   ├── goals/             # Forecasting
│   └── utils/             # Utilities
└── components/            # UI components
```

## 🧪 Development

```bash
npm run dev          # Development server
npm run build        # Production build
npm run lint         # Code linting
npm run gen:csv      # Generate sample data
npm run seed         # Populate database
```

## 📝 Note

This is a **demo application** using synthetic transaction data. No real bank connections or financial data processing. Built for hackathon/portfolio demonstration purposes.

## 📄 License

MIT License