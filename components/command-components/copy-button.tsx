"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Copy, Check } from "lucide-react";

export function CopyButton({
  text,
  label = "Copy",
}: {
  text: string;
  label?: string;
}) {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Button variant="ghost" size="sm" className="h-7 px-2" onClick={handleCopy}>
      {copied ? (
        <>
          <Check className="h-3.5 w-3.5 text-green-600 dark:text-green-400" />
          <span className="ml-1 text-xs text-green-600 dark:text-green-400">
            Copied!
          </span>
        </>
      ) : (
        <>
          <Copy className="h-3.5 w-3.5" />
          <span className="ml-1 text-xs">{label}</span>
        </>
      )}
    </Button>
  );
}
