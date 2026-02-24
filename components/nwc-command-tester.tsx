"use client";

import * as React from "react";
import { NWCClient } from "@getalby/sdk/nwc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Wallet,
  Zap,
  Send,
  Receipt,
  Search,
  List,
  DollarSign,
  Info,
  Edit,
} from "lucide-react";
import {
  CommandExecution,
  MethodConfig,
  CommandCategory,
  ExecutionCard,
} from "@/components/command-components";
import { StatsDashboard } from "@/components/stats-dashboard";

// Method configurations
const METHOD_CONFIGS: Record<string, MethodConfig> = {
  getInfo: {
    name: "getInfo",
    label: "Get Wallet Info",
    description: "Retrieve wallet details and capabilities",
    icon: Wallet,
    category: "info",
  },
  getBalance: {
    name: "getBalance",
    label: "Get Balance",
    description: "Check current wallet balance",
    icon: Zap,
    category: "info",
  },
  makeInvoice: {
    name: "makeInvoice",
    label: "Make Invoice",
    description: "Create a new Lightning invoice",
    icon: Receipt,
    category: "invoice",
    requiresParams: true,
  },
  payInvoice: {
    name: "payInvoice",
    label: "Pay Invoice",
    description: "Pay a Lightning invoice",
    icon: Send,
    category: "payment",
    requiresParams: true,
  },
  payKeysend: {
    name: "payKeysend",
    label: "Pay Keysend",
    description: "Send a keysend payment",
    icon: DollarSign,
    category: "payment",
    requiresParams: true,
  },
  lookupInvoice: {
    name: "lookupInvoice",
    label: "Lookup Invoice",
    description: "Look up invoice details",
    icon: Search,
    category: "invoice",
    requiresParams: true,
  },
  listTransactions: {
    name: "listTransactions",
    label: "List Transactions",
    description: "Retrieve transaction history",
    icon: List,
    category: "transaction",
  },
  signMessage: {
    name: "signMessage",
    label: "Sign Message",
    description: "Sign a message with your node key",
    icon: Edit,
    category: "info",
    requiresParams: true,
  },
};

export function NWCCommandTester() {
  const [nwcClient, setNwcClient] = React.useState<NWCClient | null>(null);
  const [nwcUrl, setNwcUrl] = React.useState("");
  const [connectionError, setConnectionError] = React.useState<string | null>(
    null
  );
  const [executions, setExecutions] = React.useState<CommandExecution[]>([]);
  const [isExecuting, setIsExecuting] = React.useState(false);
  const [expandedId, setExpandedId] = React.useState<number | null>(null);
  const executionIdRef = React.useRef(0);

  React.useEffect(() => {
    // First check bc:config from Bitcoin Connect
    const bcConfig = localStorage.getItem("bc:config");
    if (bcConfig) {
      try {
        const config = JSON.parse(bcConfig);
        if (config.nwcUrl) {
          setNwcUrl(config.nwcUrl);
          handleConnect(config.nwcUrl);
          return;
        }
      } catch (e) {
        console.log("Could not parse bc:config:", e);
      }
    }

    // Fallback to manual NWC URL
    const storedUrl =
      localStorage.getItem("nwc:url") || localStorage.getItem("alby:nwc:url");
    if (storedUrl) {
      setNwcUrl(storedUrl);
      handleConnect(storedUrl);
    }
  }, []);

  const handleConnect = async (url: string) => {
    try {
      setConnectionError(null);
      const client = new NWCClient({ nostrWalletConnectUrl: url });
      setNwcClient(client);
      localStorage.setItem("nwc:url", url);

      // Auto-fetch wallet info
      executeCommand("getInfo");
    } catch (err: any) {
      setConnectionError(err.message || "Failed to connect");
      setNwcClient(null);
    }
  };

  const handleDisconnect = () => {
    if (nwcClient) {
      nwcClient.close();
    }
    setNwcClient(null);
    setNwcUrl("");
    setExecutions([]);
    localStorage.removeItem("nwc:url");
    localStorage.removeItem("bc:config");
    setNwcClient(null);

    // Reload page to reset
    window.location.reload();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (nwcUrl.trim()) {
      handleConnect(nwcUrl.trim());
    }
  };

  const executeCommand = async (methodName: string, params?: any) => {
    if (!nwcClient) return;

    const executionId = executionIdRef.current++;
    const startTime = Date.now();

    setIsExecuting(true);
    setExecutions((prev) => [
      {
        id: executionId,
        timestamp: new Date().toLocaleTimeString(),
        command: methodName,
        status: "loading",
        request: params,
      },
      ...prev,
    ]);
    setExpandedId(executionId);

    try {
      let result;

      // Call the NWC client method with appropriate parameters
      if (typeof (nwcClient as any)[methodName] === "function") {
        switch (methodName) {
          case "makeInvoice":
            result = await (nwcClient as any).makeInvoice({
              amount: params.amount,
              description: params.description || "",
            });
            break;

          case "payInvoice":
            result = await (nwcClient as any).payInvoice({
              invoice: params.invoice,
            });
            break;

          case "payKeysend":
            result = await (nwcClient as any).payKeysend({
              destination: params.pubkey,
              amount: params.amount,
            });
            break;

          case "lookupInvoice":
            result = await (nwcClient as any).lookupInvoice({
              payment_hash: params.payment_hash,
            });
            break;

          case "signMessage":
            result = await (nwcClient as any).signMessage({
              message: params.message,
            });
            break;

          case "listTransactions":
            result = await (nwcClient as any).listTransactions({
              from: 0,
              until: Math.floor(Date.now() / 1000),
              limit: 50,
              offset: 0,
              unpaid: false,
            });
            break;

          default:
            result = await (nwcClient as any)[methodName]();
        }
        console.log("Result:", result);
      } else {
        throw new Error(`Method ${methodName} not available`);
      }

      const duration = Date.now() - startTime;
      setExecutions((prev) =>
        prev.map((exec) =>
          exec.id === executionId
            ? { ...exec, status: "success", response: result, duration }
            : exec
        )
      );
    } catch (error: any) {
      const duration = Date.now() - startTime;
      setExecutions((prev) =>
        prev.map((exec) =>
          exec.id === executionId
            ? {
                ...exec,
                status: "error",
                error: error?.message || String(error),
                duration,
              }
            : exec
        )
      );
    } finally {
      setIsExecuting(false);
    }
  };

  const clearLogs = () => {
    setExecutions([]);
    setExpandedId(null);
  };

  // Get methods by category
  const getMethodsByCategory = (category: MethodConfig["category"]) => {
    return Object.values(METHOD_CONFIGS).filter((m) => m.category === category);
  };

  return (
    <div className="space-y-6">
      {!nwcClient ? (
        <Card>
          <CardHeader>
            <CardTitle>Connect via Nostr Wallet Connect</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Enter your NWC connection string to connect to your Lightning
              wallet.
            </p>
            <form onSubmit={handleSubmit} className="space-y-3">
              <Input
                type="text"
                placeholder="nostr+walletconnect://..."
                value={nwcUrl}
                onChange={(e) => setNwcUrl(e.target.value)}
                className="font-mono text-sm"
              />
              {connectionError && (
                <p className="text-sm text-red-500">{connectionError}</p>
              )}
              <Button type="submit" disabled={!nwcUrl.trim()}>
                Connect
              </Button>
            </form>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Statistics Dashboard */}
          {executions.length > 0 && (
            <StatsDashboard executions={executions} />
          )}

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_600px] gap-6">
            {/* Left Column: Commands */}
            <div className="space-y-4">
              {/* Header Card */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Wallet className="h-5 w-5 text-blue-500" />
                      <CardTitle className="text-lg">Wallet Commands</CardTitle>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleDisconnect}
                    >
                      Disconnect
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Execute NWC commands on your wallet
                  </p>
                </CardHeader>
              </Card>

              {/* Command Categories - Each in its own card */}
              <CommandCategory
                title="Wallet Information"
                icon={Info}
                methods={getMethodsByCategory("info")}
                isExecuting={isExecuting}
                onExecute={executeCommand}
              />
              <CommandCategory
                title="Invoice Operations"
                icon={Receipt}
                methods={getMethodsByCategory("invoice")}
                isExecuting={isExecuting}
                onExecute={executeCommand}
              />
              <CommandCategory
                title="Payment Operations"
                icon={Send}
                methods={getMethodsByCategory("payment")}
                isExecuting={isExecuting}
                onExecute={executeCommand}
              />
              <CommandCategory
                title="Transaction History"
                icon={List}
                methods={getMethodsByCategory("transaction")}
                isExecuting={isExecuting}
                onExecute={executeCommand}
              />
            </div>

            {/* Right Column: Execution Console */}
            <div className="lg:sticky lg:top-6 lg:self-start">
              <Card className="lg:min-h-[calc(100vh-140px)]">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Zap className="h-5 w-5 text-yellow-500" />
                      Execution Console
                    </CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      Real-time command output
                    </p>
                  </div>
                  {executions.length > 0 && (
                    <Button variant="ghost" size="sm" onClick={clearLogs}>
                      Clear All
                    </Button>
                  )}
                </CardHeader>
                <CardContent>
                  <ScrollArea className="lg:h-[calc(100vh-260px)] h-[600px] w-full">
                    {executions.length === 0 ? (
                      <div className="flex flex-col items-center justify-center h-32 text-center">
                        <Zap className="h-8 w-8 text-muted-foreground mb-2" />
                        <p className="text-sm text-muted-foreground">
                          No commands executed yet
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Click a command to get started
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {executions.map((execution) => (
                          <ExecutionCard
                            key={execution.id}
                            execution={execution}
                            isExpanded={expandedId === execution.id}
                            onToggle={(open) =>
                              setExpandedId(open ? execution.id : null)
                            }
                          />
                        ))}
                      </div>
                    )}
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
