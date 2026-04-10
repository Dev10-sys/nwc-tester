"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ThemeToggle } from "@/components/theme-toggle";
import { Wallet, LockKeyhole } from "lucide-react";

// Dynamic imports to prevent SSR issues with Bitcoin Connect
const NWCConnectForm = dynamic(
  () =>
    import("@/components/nwc-connect-form").then((mod) => ({
      default: mod.NWCConnectForm,
    })),
  {
    ssr: false,
    loading: () => (
      <div className="p-4 text-sm text-muted-foreground">Loading...</div>
    ),
  }
);

const NWCCommandTester = dynamic(
  () =>
    import("@/components/nwc-command-tester").then((mod) => ({
      default: mod.NWCCommandTester,
    })),
  {
    ssr: false,
    loading: () => (
      <div className="p-4 text-sm text-muted-foreground">Loading...</div>
    ),
  }
);

const ZapInterface = dynamic(
  () =>
    import("@/components/zap-interface").then((mod) => ({
      default: mod.ZapInterface,
    })),
  {
    ssr: false,
    loading: () => (
      <div className="p-4 text-sm text-muted-foreground">Loading...</div>
    ),
  }
);

export default function Page() {
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [activeTab, setActiveTab] = useState("connect");

  useEffect(() => {
    // Check if wallet is connected
    const checkConnection = () => {
      const bcConfig = localStorage.getItem("bc:config");
      if (bcConfig) {
        try {
          const config = JSON.parse(bcConfig);
          setIsWalletConnected(!!config.nwcUrl);
        } catch (e) {
          setIsWalletConnected(false);
        }
      } else {
        setIsWalletConnected(false);
      }
    };

    checkConnection();

    // Listen for storage changes
    const handleStorageChange = () => {
      checkConnection();
    };

    // Listen for disconnect events
    const handleDisconnect = () => {
      setIsWalletConnected(false);
      setActiveTab("connect");
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("bc:disconnected", handleDisconnect);

    // Check periodically for connection status
    const interval = setInterval(checkConnection, 1000);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("bc:disconnected", handleDisconnect);
      clearInterval(interval);
    };
  }, []);

  const handleTabChange = (value: string) => {
    if ((value === "commands" || value === "zap") && !isWalletConnected) {
      // Don't allow switching to these tabs without wallet connection
      return;
    }
    setActiveTab(value);
  };

  return (
    <main className="min-h-[100svh] p-6 bg-gradient-to-br from-background via-background to-muted/20">
      <div className="w-full max-w-[1800px] mx-auto space-y-6">
        <header className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold text-balance bg-gradient-to-r from-orange-500 to-yellow-500 bg-clip-text text-transparent">
              NWC Tester
            </h1>
            <p className="text-muted-foreground text-pretty text-lg max-w-2xl">
              Connect and test your Nostr Wallet Connect (NWC) integrations in real-time.
            </p>
          </div>
          <ThemeToggle />
        </header>

        <Tabs
          value={activeTab}
          onValueChange={handleTabChange}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-3 h-12">
            <TabsTrigger value="connect" className="text-base">
              Wallet Info
            </TabsTrigger>
            <TabsTrigger
              value="commands"
              disabled={!isWalletConnected}
              className="relative text-base"
            >
              Test Commands
              {!isWalletConnected && (
                <LockKeyhole className="h-3 w-3 ml-1.5 opacity-50" />
              )}
            </TabsTrigger>
            <TabsTrigger
              value="zap"
              disabled={!isWalletConnected}
              className="relative text-base"
            >
              Quick Zap
              {!isWalletConnected && (
                <LockKeyhole className="h-3 w-3 ml-1.5 opacity-50" />
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="connect" className="space-y-4">
            <Card className="border-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wallet className="h-5 w-5 text-orange-500" />
                  Connect NWC Wallet
                </CardTitle>
                <CardDescription>
                  Connect your Lightning wallet to unlock advanced testing features and payment capabilities.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <NWCConnectForm />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="commands" className="space-y-4">
            {isWalletConnected ? (
              <NWCCommandTester />
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <LockKeyhole className="h-5 w-5" />
                    Wallet Connection Required
                  </CardTitle>
                  <CardDescription>
                    Please connect your wallet in the "Wallet Info" tab to test
                    NWC commands.
                  </CardDescription>
                </CardHeader>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="zap" className="space-y-4">
            {isWalletConnected ? (
              <ZapInterface />
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <LockKeyhole className="h-5 w-5" />
                    Wallet Connection Required
                  </CardTitle>
                  <CardDescription>
                    Please connect your wallet in the "Wallet Info" tab to send
                    zaps.
                  </CardDescription>
                </CardHeader>
              </Card>
            )}
          </TabsContent>
        </Tabs>

        <Separator />
        <footer className="text-sm text-muted-foreground text-center space-y-2 py-8">
          <div className="flex items-center justify-center gap-2 opacity-70">
            <span>NWC Tester</span>
            <span>•</span>
            <span>Lightning Network Testing Utility</span>
          </div>
        </footer>
      </div>
    </main>
  );
}
