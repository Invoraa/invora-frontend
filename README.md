# invora-frontend

> On-chain invoice and payment platform — Frontend

Built with **Next.js 14**, **Tailwind CSS**, and **Stellar Wallets Kit**. Deployed on Vercel.

## Features

- 🧾 Create and send on-chain invoices
- 🔒 Escrow-backed payments via Soroban contracts
- 🎯 Milestone-based payment releases
- 💱 USDC and XLM support
- 🌐 Stellar Testnet & Mainnet support

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router) |
| Styling | Tailwind CSS |
| Blockchain | Stellar SDK + Stellar Wallets Kit |
| State | Zustand |
| Forms | React Hook Form + Zod |
| Deploy | Vercel |

## Getting Started

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local

# Start development server
npm run dev
```

## Environment Variables

See `.env.example` for required variables.

## Project Structure

```
src/
├── app/          # Next.js App Router pages
├── components/   # Reusable UI components
├── lib/          # Stellar SDK helpers
├── hooks/        # Custom React hooks
├── types/        # TypeScript type definitions
└── store/        # Zustand state stores
```

## Related Repos

- [invora-backend](https://github.com/Invoraa/invora-backend) — Serverless API
- [invora-contracts](https://github.com/Invoraa/invora-contracts) — Soroban smart contracts

## Contributing

Open source under the MIT License. PRs welcome!