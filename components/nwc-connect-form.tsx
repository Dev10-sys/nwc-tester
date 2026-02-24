"use client";

import * as React from "react";
import { Button as BCButton, init } from "@getalby/bitcoin-connect-react";
import { NWCClient } from "@getalby/sdk/nwc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

// Initialize Bitcoin Connect
if (typeof window !== "undefined") {
  init({
    appName: "NWC Tester",
  });
}

type WalletInfo = {
  pubkey?: string;
  alias?: string;
  methods?: string[];
  balance?: number;
  nwcUrl?: string;
};

export function NWCConnectForm() {
  const [walletInfo, setWalletInfo] = React.useState<WalletInfo | null>(null);
  const [nwcClient, setNwcClient] = React.useState<NWCClient | null>(null);
  const [isMounted, setIsMounted] = React.useState(false);

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleConnect = async (weblnProvider: any) => {
    try {
      // Get NWC URL from the WebLN provider
      const nwcUrl = weblnProvider.nostrWalletConnectUrl;

      if (!nwcUrl) {
        console.error("No NWC URL found in provider");
        return;
      }

      // Create NWC client directly
      const client = new NWCClient({ nostrWalletConnectUrl: nwcUrl });
      setNwcClient(client);

      // Store NWC URL in localStorage
      localStorage.setItem("nwc:url", nwcUrl);

      // Get wallet info using NWC client
      const info: WalletInfo = { nwcUrl };

      try {
        const walletData = await client.getInfo();
        info.pubkey = walletData.pubkey;
        info.alias = walletData.alias;
        info.methods = walletData.methods;
      } catch (e) {
        console.log("Could not fetch wallet info:", e);
      }

      try {
        const balanceData = await client.getBalance();
        info.balance = balanceData.balance;
      } catch (e) {
        console.log("Could not fetch balance:", e);
      }

      setWalletInfo(info);
    } catch (error) {
      console.error("Connection error:", error);
    }
  };

  const handleDisconnect = () => {
    // Close NWC client
    if (nwcClient) {
      nwcClient.close();
    }

    // Remove Bitcoin Connect config
    localStorage.removeItem("bc:config");

    setNwcClient(null);
    setWalletInfo(null);

    // Reload page to reset
    window.location.reload();
  };

  if (!isMounted) {
    return null;
  }

  return (
    <div className="space-y-6">
      {!nwcClient ? (
        <Card>
          <CardHeader>
            <CardTitle>Connect Your Lightning Wallet</CardTitle>
          </CardHeader>
          <CardContent>
            <BCButton onConnected={handleConnect} />
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Wallet Connected via NWC</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            {walletInfo?.alias && (
              <div className="grid gap-1">
                <span className="text-muted-foreground">Wallet Name</span>
                <Badge variant="secondary">{walletInfo.alias}</Badge>
              </div>
            )}
            {walletInfo?.pubkey && (
              <div className="grid gap-1">
                <span className="text-muted-foreground">Public Key</span>
                <code className="break-all text-xs">{walletInfo.pubkey}</code>
              </div>
            )}
            {walletInfo?.balance !== undefined && (
              <div className="grid gap-1">
                <span className="text-muted-foreground">Balance</span>
                <Badge variant="default" className="text-base">
                  {walletInfo.balance.toLocaleString()} sats
                </Badge>
              </div>
            )}
            {walletInfo?.methods && walletInfo.methods.length > 0 && (
              <div className="grid gap-1">
                <span className="text-muted-foreground">Supported Methods</span>
                <div className="flex flex-wrap gap-1">
                  {walletInfo.methods.filter(Boolean).map((method, i) => (
                    <Badge key={i} variant="outline" className="text-xs">
                      {method}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            {walletInfo?.nwcUrl && (
              <div className="grid gap-1">
                <span className="text-muted-foreground">
                  NWC Connection String
                </span>
                <code className="break-all text-xs bg-muted p-2 rounded">
                  {walletInfo.nwcUrl}
                </code>
              </div>
            )}
            <Separator />
            <Button variant="outline" onClick={handleDisconnect}>
              Disconnect
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
