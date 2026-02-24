"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { MethodConfig } from "./types";

export function CommandButton({
  method,
  isExecuting,
  onExecute,
}: {
  method: MethodConfig;
  isExecuting: boolean;
  onExecute: (methodName: string, params?: any) => void;
}) {
  const Icon = method.icon;
  const [showDialog, setShowDialog] = React.useState(false);
  const [params, setParams] = React.useState<any>({});

  const handleClick = () => {
    if (method.requiresParams) {
      setShowDialog(true);
    } else {
      onExecute(method.name);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onExecute(method.name, params);
    setShowDialog(false);
    setParams({});
  };

  const renderParamInputs = () => {
    switch (method.name) {
      case "makeInvoice":
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="amount">Amount (sats) *</Label>
              <Input
                id="amount"
                type="number"
                placeholder="1000"
                value={params.amount || ""}
                onChange={(e) =>
                  setParams({ ...params, amount: parseInt(e.target.value) })
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                placeholder="Payment for..."
                value={params.description || ""}
                onChange={(e) =>
                  setParams({ ...params, description: e.target.value })
                }
              />
            </div>
          </>
        );

      case "payInvoice":
        return (
          <div className="space-y-2">
            <Label htmlFor="invoice">Invoice (bolt11) *</Label>
            <Textarea
              id="invoice"
              placeholder="lnbc..."
              value={params.invoice || ""}
              onChange={(e) =>
                setParams({ ...params, invoice: e.target.value })
              }
              className="font-mono text-sm break-all whitespace-pre-wrap"
              rows={6}
              required
            />
          </div>
        );

      case "payKeysend":
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="pubkey">Destination Pubkey *</Label>
              <Input
                id="pubkey"
                placeholder="02..."
                value={params.pubkey || ""}
                onChange={(e) =>
                  setParams({ ...params, pubkey: e.target.value })
                }
                className="font-mono text-sm break-all"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="amount">Amount (sats) *</Label>
              <Input
                id="amount"
                type="number"
                placeholder="1000"
                value={params.amount || ""}
                onChange={(e) =>
                  setParams({ ...params, amount: parseInt(e.target.value) })
                }
                required
              />
            </div>
          </>
        );

      case "lookupInvoice":
        return (
          <div className="space-y-2">
            <Label htmlFor="payment_hash">Payment Hash *</Label>
            <Input
              id="payment_hash"
              placeholder="64-character hex string"
              value={params.payment_hash || ""}
              onChange={(e) =>
                setParams({ ...params, payment_hash: e.target.value })
              }
              className="font-mono text-sm break-all"
              required
            />
          </div>
        );

      case "signMessage":
        return (
          <div className="space-y-2">
            <Label htmlFor="message">Message to Sign *</Label>
            <Textarea
              id="message"
              placeholder="Enter message..."
              value={params.message || ""}
              onChange={(e) =>
                setParams({ ...params, message: e.target.value })
              }
              rows={4}
              required
            />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <>
      <Button
        onClick={handleClick}
        disabled={isExecuting}
        variant="outline"
        className="justify-start h-auto py-3 flex-col items-start hover:text-orange-600 dark:hover:text-orange-400 hover:border-orange-300 dark:hover:border-orange-400 transition-colors"
      >
        <div className="flex items-center gap-2 mb-1">
          <Icon className="h-4 w-4" />
          <span className="font-semibold text-sm">{method.label}</span>
        </div>
        <span className="text-xs text-muted-foreground text-left">
          {method.description}
        </span>
      </Button>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Icon className="h-5 w-5" />
                {method.label}
              </DialogTitle>
              <DialogDescription>{method.description}</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">{renderParamInputs()}</div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowDialog(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Execute</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
