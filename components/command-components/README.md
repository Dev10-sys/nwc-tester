# Command Components

Modular components for the NWC Command Tester interface.

## Structure

```
command-components/
├── index.ts                  # Main export file
├── types.ts                  # TypeScript type definitions
├── copy-button.tsx           # Copy to clipboard button with feedback
├── copyable-code.tsx         # Code block with hover-to-copy functionality
├── command-button.tsx        # Command button with parameter dialog
├── command-category.tsx      # Card wrapper for command groups
├── response-renderer.tsx     # Custom response rendering per command type
└── execution-card.tsx        # Collapsible execution result display
```

## Components

### Types (`types.ts`)

- `CommandExecution` - Execution result data structure
- `MethodConfig` - NWC method configuration

### CopyButton (`copy-button.tsx`)

Reusable button with copy-to-clipboard functionality and visual feedback.

**Props:**

- `text: string` - Text to copy
- `label?: string` - Button label (default: "Copy")

### CopyableCode (`copyable-code.tsx`)

Code block that shows a copy button on hover.

**Props:**

- `code: string` - Code to display
- `label?: string` - Copy button label

### CommandButton (`command-button.tsx`)

Button that executes NWC commands with optional parameter dialog.

**Props:**

- `method: MethodConfig` - Method configuration
- `isExecuting: boolean` - Disable when executing
- `onExecute: (methodName, params?) => void` - Execute callback

**Features:**

- Auto-opens dialog for methods requiring parameters
- Validates required fields
- Custom input fields per method type

### CommandCategory (`command-category.tsx`)

Card wrapper for grouping related commands.

**Props:**

- `title: string` - Category title
- `icon: LucideIcon` - Category icon
- `methods: MethodConfig[]` - Methods in this category
- `isExecuting: boolean` - Pass to children
- `onExecute: (methodName, params?) => void` - Execute callback

### ResponseRenderer (`response-renderer.tsx`)

Custom response rendering based on command type.

**Props:**

- `command: string` - Command name
- `data: any` - Response data

**Supported Commands:**

- `getInfo` - Wallet info with methods badges
- `getBalance` - Balance display
- `makeInvoice` - Invoice and payment hash with copy
- `payInvoice` / `payKeysend` - Preimage, hash, amount, fees
- `lookupInvoice` - Status and amount
- `listTransactions` - Collapsible transaction list with full details
- `signMessage` - Signature with copy
- Default: JSON pretty-print

### ExecutionCard (`execution-card.tsx`)

Collapsible card showing execution status and results.

**Props:**

- `execution: CommandExecution` - Execution data
- `isExpanded: boolean` - Expand state
- `onToggle: (open: boolean) => void` - Toggle callback

**Features:**

- Status icons (loading/success/error)
- Execution timing
- Copy JSON button
- Custom response rendering

## Usage

```tsx
import {
  CommandExecution,
  MethodConfig,
  CommandCategory,
  ExecutionCard,
} from "@/components/command-components";

// Use in your component
<CommandCategory
  title="Info Commands"
  icon={Info}
  methods={infoMethods}
  isExecuting={isExecuting}
  onExecute={handleExecute}
/>;
```

## Benefits

- **Modular**: Each component in its own file
- **Reusable**: Components can be used independently
- **Maintainable**: Easy to locate and update specific functionality
- **Type-safe**: Centralized type definitions
- **Tree-shakeable**: Only import what you need
