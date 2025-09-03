# Implementation Plan — Smart Financial Coach MVP

## Problem & Users
People struggle to see where money goes and how to change habits. MVP serves students/young adults and gig workers who need clear, private, actionable nudges.

## MVP Scope
1) Insights: plain-English spend patterns (coffee total + save-at-home, top merchants shift, weekend rideshare trend)
2) Subscriptions: detect ~monthly recurrences (28–32 days) and gray charges
3) Goal Forecast: target $ and months → on-track check + suggested cuts

## Architecture
Next.js (TS) UI → API routes → Prisma + SQLite. Seeded synthetic CSV; no external connectors.
- Data model: Transaction{id, date, amount±, merchant, category, accountId, description?}

## Key Methods
- Subscriptions: group by (merchant, amount±2% or ±$1) → sort → median inter-arrival ∈ [28,32] with ≥3 → subscription; simple rules for gray charges
- Insights: heuristics to generate human-readable tips
- Goals: required monthly save vs. current average; propose cuts from discretionary categories until shortfall covered

## Responsible AI & Privacy
Synthetic data only; no PII leaves device; heuristics may have false positives; not financial advice.

## Acceptance Criteria
- 3 months seed loads cleanly
- Subscriptions table surfaces recurring items with next expected date
- ≥5 concrete insights for current month
- Goals page returns on-track/shortfall with cuts that cover gap
