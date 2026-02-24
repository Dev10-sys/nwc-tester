# NWC Tester

A testing platform for Nostr Wallet Connect (NWC) with Lightning Network integration.

## Features

- Connect Lightning wallets via Bitcoin Connect or manual NWC URL
- Execute all NWC commands (getInfo, getBalance, makeInvoice, payInvoice, payKeysend, lookupInvoice, listTransactions, signMessage)
- Real-time command execution monitoring
- Transaction history with detailed information
- Quick payment interface
- Light/dark theme support

## Tech Stack

- Next.js 15 with App Router
- TypeScript
- Tailwind CSS
- Radix UI components
- Alby SDK for NWC integration
- Bitcoin Connect for wallet connections

## Installation

```bash
git clone https://github.com/Dev10-sys/nwc-tester.git
cd nwc-tester
npm install
npm run dev
```

Open http://localhost:3000

## Usage

1. Connect your Lightning wallet using Bitcoin Connect or paste your NWC connection string
2. Test NWC commands from the Test Commands tab
3. View transaction history and wallet information
4. Send quick payments using the Quick Zap feature

## Deployment

Deploy to Vercel:

```bash
npm run build
```

The app works out of the box with no environment variables needed.

## License

MIT
