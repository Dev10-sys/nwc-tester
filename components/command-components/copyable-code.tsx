"use client";

import { CopyButton } from "./copy-button";

export function CopyableCode({
  code,
  label,
}: {
  code: string;
  label?: string;
}) {
  return (
    <div className="relative group">
      <code className="block text-xs break-all bg-muted p-2 rounded pr-20">
        {code}
      </code>
      <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <CopyButton text={code} label={label || "Copy"} />
      </div>
    </div>
  );
}
