# NWC Tester

A modern, feature-rich Nostr Wallet Connect (NWC) testing platform with advanced Bitcoin Lightning integration and real-time command execution.

## Key Features

- Advanced NWC Protocol - Complete implementation of Nostr Wallet Connect with enhanced error handling
- Seamless Wallet Integration - One-click connection with Bitcoin Connect and manual NWC support
- Interactive Command Suite - Execute all NWC methods with intelligent parameter validation
- Live Execution Dashboard - Real-time command monitoring with detailed response analytics
- Modern Component Architecture - Scalable, type-safe React components with optimal performance
- Lightning Payments - Instant payment processing with QR code generation
- Adaptive Theme System - Polished UI with automatic light/dark mode switching
- Transaction Analytics - Comprehensive transaction history with filtering and export capabilities

## Supported NWC Commands

### Information & Diagnostics

- `getInfo` - Retrieve comprehensive wallet details, capabilities, and supported methods
- `getBalance` - Real-time wallet balance with millisatoshi precision
- `signMessage` - Cryptographically sign messages using your node's private key

### Invoice Management

- `makeInvoice` - Generate Lightning invoices with custom amounts and descriptions
- `lookupInvoice` - Query invoice status, payment details, and settlement information

### Payment Operations

- `payInvoice` - Execute Lightning invoice payments with automatic routing
- `payKeysend` - Send spontaneous payments directly to node public keys

### Transaction Analytics

- `listTransactions` - Comprehensive transaction history with filtering, pagination, and detailed metadata

## Technology Stack

- Framework: Next.js 15.2.4 (App Router, React Server Components)
- Language: TypeScript 5+ with strict type checking
- Styling: Tailwind CSS v4 with custom design tokens
- UI Library: Radix UI primitives + shadcn/ui components
- NWC Integration: @getalby/sdk v6.0.1 (official Alby SDK)
- Wallet Connect: @getalby/bitcoin-connect-react v3.11.0
- QR Generation: qrcode.react v4.2.0
- Analytics: Vercel Analytics for performance monitoring
- Package Manager: pnpm 10.17.1+ (fast, disk-efficient)
- Fonts: Geist Sans & Geist Mono (optimized variable fonts)

## Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/nwc-tester.git
cd nwc-tester

# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start
```

Navigate to http://localhost:3000 to access the application.

## Architecture

```
nwc-tester/
├── app/                          # Next.js 15 App Router
│   ├── layout.tsx               # Root layout with providers
│   ├── page.tsx                 # Main application interface
│   └── globals.css              # Global styling
├── components/
│   ├── command-components/      # Command execution modules
│   ├── nwc-command-tester.tsx   # Command testing interface
│   ├── nwc-connect-form.tsx     # Wallet connection UI
│   ├── zap-interface.tsx        # Payment interface
│   ├── theme-provider.tsx       # Theme management
│   ├── theme-toggle.tsx         # Theme switcher
│   └── ui/                      # Radix UI components
├── hooks/                        # Custom React hooks
├── lib/
│   └── utils.ts                 # Helper functions
└── public/                      # Static assets
```

## Usage Guide

### Step 1: Wallet Connection

Navigate to the "Wallet Info" tab and choose your connection method:

Option A: Bitcoin Connect (Recommended)
- Click the "Connect Wallet" button
- Select your Lightning wallet provider (Alby, Mutiny, LND, etc.)
- Authorize the connection in your wallet
- Wallet info and balance will display automatically

Option B: Manual NWC Connection
- Obtain your NWC connection string from your wallet
- Paste the nostr+walletconnect:// URL
- Click "Connect" to establish the connection

### Step 2: Execute Commands

Switch to the "Test Commands" tab to access the command suite:

- Browse commands organized by category (Info, Invoice, Payment, Transaction)
- Click any command button to execute
- For commands requiring parameters, fill in the dialog form
- View real-time execution results in the console panel
- Copy responses, invoices, and hashes with one click

### Step 3: Send Lightning Payments

Use the "Quick Zap" tab for instant payments:

- Select a preset amount (21, 100, 500, 1000, or 5000 sats)
- Confirm the payment in the dialog
- Track payment status in real-time
- Alternative: Scan the QR code or copy the Lightning address for manual payments

## Advanced Features

### Smart Connection Detection

The application intelligently detects wallet connections from multiple sources:
- Bitcoin Connect configuration (bc:config in localStorage)
- Manual NWC URL input (nwc:url in localStorage)
- Automatic reconnection on page reload
- Real-time connection status monitoring

### Enhanced Transaction Display

Transaction history includes:
- Expandable/collapsible transaction cards for better readability
- One-click copy buttons for invoices, payment hashes, and preimages
- Detailed timestamps with millisecond precision
- Fee breakdown and routing information
- Color-coded transaction types (incoming/outgoing)
- Transaction filtering and search capabilities

### Developer-Friendly Features

- Complete TypeScript type safety across all components
- Comprehensive error handling with user-friendly messages
- Request/response logging for debugging
- Execution timing for performance analysis
- Copy-to-clipboard functionality on all code blocks
- Responsive design optimized for all screen sizes

## Deployment

### Deploy to Vercel (Recommended)

1. Click the "Deploy" button or visit Vercel
2. Connect your GitHub account
3. Configure your project name
4. Deploy - no environment variables needed

### Manual Deployment

```bash
# Build the production bundle
pnpm build

# Start the production server
pnpm start

# Or use a process manager
pm2 start npm --name "lightning-tester" -- start
```

### Docker Deployment

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install --frozen-lockfile
COPY . .
RUN pnpm build
EXPOSE 3000
CMD ["pnpm", "start"]
```

### Environment Configuration

No environment variables required. The application works out of the box with:
- Client-side wallet connections
- Local storage for connection persistence
- No backend API dependencies

## License

MIT License - Free to use, modify, and distribute.

See LICENSE file for full details.

## Acknowledgments

- Alby - Excellent NWC SDK and Bitcoin Connect library
- Vercel - Seamless deployment platform
- Radix UI - Accessible component primitives
- shadcn/ui - Beautiful component library
- Lightning Network Community - For building the future of payments
