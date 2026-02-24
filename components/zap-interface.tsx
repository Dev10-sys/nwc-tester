"use client";

import * as React from "react";
import { QRCodeSVG } from "qrcode.react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Zap, Check, Copy, AlertCircle } from "lucide-react";
import { NWCClient } from "@getalby/sdk/nwc";

const LIGHTNING_ADDRESS = "your-address@getalby.com";
const ZAP_AMOUNTS = [21, 100, 500, 1000, 5000];

export function ZapInterface() {
  const [nwcClient, setNwcClient] = React.useState<NWCClient | null>(null);
  const [isZapping, setIsZapping] = React.useState(false);
  const [zapResult, setZapResult] = React.useState<{
    success: boolean;
    amount?: number;
    message?: string;
  } | null>(null);
  const [copied, setCopied] = React.useState(false);

  React.useEffect(() => {
    // Check for bc:config from Bitcoin Connect
    const checkConnection = () => {
      const bcConfig = localStorage.getItem("bc:config");
      if (bcConfig) {
        try {
          const config = JSON.parse(bcConfig);
          if (config.nwcUrl) {
            const client = new NWCClient({
              nostrWalletConnectUrl: config.nwcUrl,
            });
            setNwcClient(client);
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
        const client = new NWCClient({ nostrWalletConnectUrl: storedUrl });
        setNwcClient(client);
      }
    };

    checkConnection();

    // Listen for connection/disconnection events
    const handleStorageChange = () => {
      checkConnection();
    };

    const handleDisconnect = () => {
      if (nwcClient) {
        nwcClient.close();
      }
      setNwcClient(null);
      setZapResult(null);
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("bc:disconnected", handleDisconnect);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("bc:disconnected", handleDisconnect);
    };
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(LIGHTNING_ADDRESS);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleZap = async (amount: number) => {
    if (!nwcClient) {
      setZapResult({
        success: false,
        message: "Please connect your wallet first in the 'Wallet Info' tab",
      });
      return;
    }

    setIsZapping(true);
    setZapResult(null);

    try {
      // Fetch invoice from Lightning Address
      const [username, domain] = LIGHTNING_ADDRESS.split("@");
      const lnurlResponse = await fetch(
        `https://${domain}/.well-known/lnurlp/${username}`
      );
      const lnurlData = await lnurlResponse.json();

      if (!lnurlData.callback) {
        throw new Error("Invalid Lightning address");
      }

      // Request invoice
      const amountMsat = amount * 1000;
      const invoiceResponse = await fetch(
        `${lnurlData.callback}?amount=${amountMsat}`
      );
      const invoiceData = await invoiceResponse.json();

      if (!invoiceData.pr) {
        throw new Error("Failed to get invoice");
      }

      // Pay invoice using NWC client directly
      console.log("Paying invoice:", invoiceData.pr);
      const result = await nwcClient.payInvoice({ invoice: invoiceData.pr });
      console.log("Payment result:", result);

      setZapResult({
        success: true,
        amount,
        message: `Successfully zapped ${amount} sats!`,
      });
    } catch (error: any) {
      console.error("Zap error:", error);
      setZapResult({
        success: false,
        amount,
        message: error.message || "Failed to send zap",
      });
    } finally {
      setIsZapping(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <div className="rounded-lg bg-gradient-to-br from-orange-500/10 to-yellow-500/10 border border-orange-500/20 p-6 text-center">
        <h3 className="text-2xl font-bold mb-2">Support Development</h3>
        <p className="text-muted-foreground mb-4">
          Enjoying NWC Tester? Send a zap to support continued development!
        </p>
      </div>

      {/* Quick Zap Buttons */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold">Quick Zap</h4>
              {!nwcClient && (
                <Badge variant="outline" className="text-yellow-600">
                  Wallet not connected
                </Badge>
              )}
            </div>

            <div className="grid grid-cols-5 gap-3">
              {ZAP_AMOUNTS.map((amount) => (
                <Button
                  key={amount}
                  variant="outline"
                  className="h-20 flex flex-col gap-1 hover:bg-orange-500/10 hover:border-orange-500"
                  onClick={() => handleZap(amount)}
                  disabled={isZapping || !nwcClient}
                >
                  {isZapping ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <>
                      <Zap className="h-5 w-5 text-orange-500" />
                      <span className="font-bold">{amount}</span>
                      <span className="text-xs text-muted-foreground">
                        sats
                      </span>
                    </>
                  )}
                </Button>
              ))}
            </div>

            {/* Result Message */}
            {zapResult && (
              <div
                className={`rounded-lg p-4 flex items-start gap-3 ${
                  zapResult.success
                    ? "bg-green-500/10 border border-green-500/20"
                    : "bg-red-500/10 border border-red-500/20"
                }`}
              >
                {zapResult.success ? (
                  <Check className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                )}
                <div className="flex-1">
                  <p
                    className={`font-semibold ${
                      zapResult.success
                        ? "text-green-900 dark:text-green-200"
                        : "text-red-900 dark:text-red-200"
                    }`}
                  >
                    {zapResult.message}
                  </p>
                  {!zapResult.success && !nwcClient && (
                    <p className="text-xs mt-1 text-muted-foreground">
                      Go to the "Wallet Info" tab and connect your wallet to
                      enable quick zaps.
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Lightning Address with QR Code */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* QR Code */}
            <div className="flex flex-col items-center justify-center p-4 bg-white rounded-lg border">
              <QRCodeSVG
                value={`lightning:${LIGHTNING_ADDRESS}`}
                size={200}
                level="M"
                includeMargin
              />
              <p className="text-xs text-muted-foreground mt-2">
                Scan with Lightning wallet
              </p>
            </div>

            {/* Lightning Address */}
            <div className="flex flex-col justify-center space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Lightning Address</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Copy and paste into any Lightning wallet
                </p>
              </div>

              <div className="flex items-center gap-2">
                <code className="flex-1 bg-muted px-3 py-2 rounded text-sm break-all">
                  {LIGHTNING_ADDRESS}
                </code>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCopy}
                  className="flex-shrink-0"
                >
                  {copied ? (
                    <>
                      <Check className="h-4 w-4 text-green-600" />
                      <span className="ml-1 text-xs">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4" />
                      <span className="ml-1 text-xs">Copy</span>
                    </>
                  )}
                </Button>
              </div>

              <div className="text-xs text-muted-foreground space-y-1">
                <p>• Works with any Lightning wallet</p>
                <p>• Instant payment confirmation</p>
                <p>• No KYC or account needed</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Thank You Note */}
      <div className="text-center text-sm text-muted-foreground space-y-2">
        <p className="text-lg">🙏</p>
        <p>Your support helps maintain and improve this open-source project!</p>
        <p className="text-xs">
          NWC Tester • Built with Next.js 15 & Bitcoin Connect
        </p>
      </div>
    </div>
  );
}
