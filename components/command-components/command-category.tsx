"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { MethodConfig } from "./types";
import { CommandButton } from "./command-button";

export function CommandCategory({
  title,
  icon: Icon,
  methods,
  isExecuting,
  onExecute,
}: {
  title: string;
  icon: LucideIcon;
  methods: MethodConfig[];
  isExecuting: boolean;
  onExecute: (methodName: string, params?: any) => void;
}) {
  if (methods.length === 0) return null;

  return (
    <Card>
      <CardHeader>
        <h3 className="text-base font-semibold flex items-center gap-2">
          <Icon className="h-5 w-5" />
          {title}
        </h3>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          {methods.map((method) => (
            <CommandButton
              key={method.name}
              method={method}
              isExecuting={isExecuting}
              onExecute={onExecute}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
