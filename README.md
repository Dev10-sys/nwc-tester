# NWC Tester

A professional-grade testing platform for Nostr Wallet Connect (NWC) with Lightning Network integration.

## Features

- Connect Lightning wallets via Bitcoin Connect or manual NWC URL
- Execute all NWC commands (getInfo, getBalance, makeInvoice, payInvoice, payKeysend, lookupInvoice, listTransactions, signMessage)
- Real-time command execution monitoring
- Transaction history with detailed information
- Quick payment interface
- Light/dark theme support
- Responsive design for desktop and mobile

## Tech Stack

- Next.js 15 with App Router
- TypeScript
- Tailwind CSS
- Radix UI components
- Alby SDK for NWC integration
- Bitcoin Connect for wallet connections

## Getting Started

### Local Development

1. Clone the repository:
```bash
git clone https://github.com/Dev10-sys/nwc-tester.git
cd nwc-tester
```

2. Install dependencies:
```bash
pnpm install
```

3. Start the development server:
```bash
pnpm run dev
```

## Live Demo

Visit the deployed application: https://nwc-tester.vercel.app/

### Available Scripts

- `pnpm run dev` - Start development server (localhost:3000)
- `pnpm run build` - Build for production
- `pnpm run start` - Start production server
- `pnpm run lint` - Run ESLint
- `pnpm run lint:fix` - Fix linting issues
- `pnpm run type-check` - Check TypeScript types
- `pnpm run format` - Format code with Prettier

## Usage

1. Connect your Lightning wallet using Bitcoin Connect or paste your NWC connection string
2. Test NWC commands from the Test Commands tab
3. View transaction history and wallet information
4. Send quick payments using the Quick Zap feature

## Deployment

### Deploy to Vercel

The app is configured for easy deployment to Vercel with zero environment variables needed:

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Vercel will automatically detect Next.js and deploy

Live deployment: https://nwc-tester.vercel.app/

## License

MIT
