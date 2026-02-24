"use client";

import { Badge } from "@/components/ui/badge";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";
import { CopyableCode } from "./copyable-code";

export function ResponseRenderer({
  command,
  data,
}: {
  command: string;
  data: any;
}) {
  if (!data) return null;

  switch (command) {
    case "getInfo":
      return (
        <div className="space-y-2">
          {data.alias && (
            <div className="flex items-center justify-between py-2 border-b">
              <span className="text-sm font-medium">Wallet Name</span>
              <Badge variant="secondary">{data.alias}</Badge>
            </div>
          )}
          {data.pubkey && (
            <div className="flex flex-col gap-1 py-2 border-b">
              <span className="text-sm font-medium">Public Key</span>
              <CopyableCode code={data.pubkey} />
            </div>
          )}
          {data.methods && (
            <div className="flex flex-col gap-1 py-2">
              <span className="text-sm font-medium">Supported Methods</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {data.methods
                  .filter(Boolean)
                  .map((method: string, i: number) => (
                    <Badge key={i} variant="outline" className="text-xs">
                      {method}
                    </Badge>
                  ))}
              </div>
            </div>
          )}
        </div>
      );

    case "getBalance":
      return (
        <div className="space-y-2">
          <div className="flex items-center justify-between py-2 border-b">
            <span className="text-sm font-medium">Balance</span>
            <Badge variant="default" className="text-base">
              {data.balance?.toLocaleString() || 0} sats
            </Badge>
          </div>
        </div>
      );

    case "makeInvoice":
      return (
        <div className="space-y-2">
          {data.invoice && (
            <div className="flex flex-col gap-1 py-2 border-b">
              <span className="text-sm font-medium">Invoice (bolt11)</span>
              <CopyableCode code={data.invoice} label="Copy Invoice" />
            </div>
          )}
          {data.payment_hash && (
            <div className="flex flex-col gap-1 py-2 border-b">
              <span className="text-sm font-medium">Payment Hash</span>
              <CopyableCode code={data.payment_hash} label="Copy Hash" />
            </div>
          )}
        </div>
      );

    case "payInvoice":
    case "payKeysend":
      return (
        <div className="space-y-2">
          {data.preimage && (
            <div className="flex flex-col gap-1 py-2 border-b">
              <span className="text-sm font-medium">Preimage</span>
              <CopyableCode code={data.preimage} label="Copy Preimage" />
            </div>
          )}
          {data.payment_hash && (
            <div className="flex flex-col gap-1 py-2 border-b">
              <span className="text-sm font-medium">Payment Hash</span>
              <CopyableCode code={data.payment_hash} label="Copy Hash" />
            </div>
          )}
          {data.amount && (
            <div className="flex items-center justify-between py-2 border-b">
              <span className="text-sm font-medium">Amount Paid</span>
              <Badge variant="default">{data.amount} sats</Badge>
            </div>
          )}
          {data.fees_paid !== undefined && (
            <div className="flex items-center justify-between py-2 border-b">
              <span className="text-sm font-medium">Fees Paid</span>
              <Badge variant="outline">{data.fees_paid} sats</Badge>
            </div>
          )}
        </div>
      );

    case "lookupInvoice":
      return (
        <div className="space-y-2">
          {data.settled !== undefined && (
            <div className="flex items-center justify-between py-2 border-b">
              <span className="text-sm font-medium">Status</span>
              <Badge variant={data.settled ? "default" : "secondary"}>
                {data.settled ? "Settled" : "Pending"}
              </Badge>
            </div>
          )}
          {data.amount && (
            <div className="flex items-center justify-between py-2 border-b">
              <span className="text-sm font-medium">Amount</span>
              <Badge variant="outline">{data.amount} sats</Badge>
            </div>
          )}
        </div>
      );

    case "listTransactions":
      if (Array.isArray(data.transactions)) {
        return (
          <div className="space-y-2">
            <div className="text-sm font-medium mb-2">
              {data.transactions.length} transaction(s)
            </div>
            {data.transactions.slice(0, 10).map((tx: any, i: number) => (
              <Collapsible key={i}>
                <CollapsibleTrigger className="w-full">
                  <div className="p-3 bg-muted hover:bg-muted/80 rounded text-xs space-y-1.5 transition-colors cursor-pointer">
                    <div className="flex justify-between items-center">
                      <Badge
                        variant={
                          tx.type === "incoming" ? "default" : "secondary"
                        }
                        className="text-xs"
                      >
                        {tx.type}
                      </Badge>
                      <span className="font-semibold">{tx.amount} sats</span>
                    </div>
                    {tx.description && (
                      <div className="text-muted-foreground text-left line-clamp-1">
                        {tx.description}
                      </div>
                    )}
                    <div className="flex justify-between items-center text-muted-foreground">
                      <span>
                        {tx.created_at
                          ? new Date(tx.created_at * 1000).toLocaleString()
                          : "N/A"}
                      </span>
                      <ChevronDown className="h-3 w-3" />
                    </div>
                  </div>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="p-3 bg-muted/50 rounded-b space-y-2 text-xs border-t">
                    {tx.invoice && (
                      <div className="space-y-1">
                        <span className="text-muted-foreground font-medium">
                          Invoice:
                        </span>
                        <CopyableCode code={tx.invoice} label="Copy Invoice" />
                      </div>
                    )}
                    {tx.payment_hash && (
                      <div className="space-y-1">
                        <span className="text-muted-foreground font-medium">
                          Payment Hash:
                        </span>
                        <CopyableCode
                          code={tx.payment_hash}
                          label="Copy Hash"
                        />
                      </div>
                    )}
                    {tx.preimage && (
                      <div className="space-y-1">
                        <span className="text-muted-foreground font-medium">
                          Preimage:
                        </span>
                        <CopyableCode
                          code={tx.preimage}
                          label="Copy Preimage"
                        />
                      </div>
                    )}
                    {tx.settled_at && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Settled:</span>
                        <span>
                          {new Date(tx.settled_at * 1000).toLocaleString()}
                        </span>
                      </div>
                    )}
                    {tx.expires_at && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Expires:</span>
                        <span>
                          {new Date(tx.expires_at * 1000).toLocaleString()}
                        </span>
                      </div>
                    )}
                    {tx.fees_paid !== undefined && tx.fees_paid > 0 && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Fees:</span>
                        <span>{tx.fees_paid} sats</span>
                      </div>
                    )}
                  </div>
                </CollapsibleContent>
              </Collapsible>
            ))}
            {data.transactions.length > 10 && (
              <p className="text-xs text-muted-foreground">
                ... and {data.transactions.length - 10} more
              </p>
            )}
          </div>
        );
      }
      break;

    case "signMessage":
      return (
        <div className="space-y-2">
          {data.signature && (
            <div className="flex flex-col gap-1 py-2 border-b">
              <span className="text-sm font-medium">Signature</span>
              <CopyableCode code={data.signature} label="Copy Signature" />
            </div>
          )}
        </div>
      );

    default:
      return (
        <pre className="overflow-x-auto whitespace-pre-wrap break-words rounded-md bg-muted p-3 text-xs font-mono">
          {JSON.stringify(data, null, 2)}
        </pre>
      );
  }
}
