"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  ChevronDown,
  ChevronRight,
  CheckCircle2,
  XCircle,
  Clock,
} from "lucide-react";
import { CommandExecution } from "./types";
import { CopyButton } from "./copy-button";
import { ResponseRenderer } from "./response-renderer";

export function ExecutionCard({
  execution,
  isExpanded,
  onToggle,
}: {
  execution: CommandExecution;
  isExpanded: boolean;
  onToggle: (open: boolean) => void;
}) {
  const getStatusIcon = (status: CommandExecution["status"]) => {
    switch (status) {
      case "loading":
        return <Clock className="h-4 w-4 animate-spin" />;
      case "success":
        return (
          <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
        );
      case "error":
        return <XCircle className="h-4 w-4 text-red-600 dark:text-red-400" />;
    }
  };

  const getStatusText = (status: CommandExecution["status"]) => {
    switch (status) {
      case "loading":
        return "Executing...";
      case "success":
        return "Success";
      case "error":
        return "Failed";
    }
  };

  return (
    <Collapsible open={isExpanded} onOpenChange={onToggle}>
      <Card className="border-2">
        <CollapsibleTrigger className="w-full">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3 flex-1">
                <div className="mt-0.5">{getStatusIcon(execution.status)}</div>
                <div className="flex-1 text-left">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-sm">
                      #{execution.id} {execution.command}
                    </span>
                    <Badge
                      variant={
                        execution.status === "success"
                          ? "default"
                          : execution.status === "error"
                          ? "destructive"
                          : "secondary"
                      }
                      className="text-xs"
                    >
                      {getStatusText(execution.status)}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>{execution.timestamp}</span>
                    {execution.duration && (
                      <>
                        <span>•</span>
                        <span>{execution.duration}ms</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
              <div className="ml-2">
                {isExpanded ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </div>
            </div>
          </CardHeader>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <CardContent className="pt-0">
            {execution.status === "success" && execution.response && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-muted-foreground">
                    RESPONSE
                  </span>
                  <CopyButton
                    text={JSON.stringify(execution.response, null, 2)}
                    label="Copy JSON"
                  />
                </div>
                <ResponseRenderer
                  command={execution.command}
                  data={execution.response}
                />
              </div>
            )}
            {execution.status === "error" && execution.error && (
              <div className="space-y-2">
                <span className="text-xs font-semibold text-muted-foreground">
                  ERROR
                </span>
                <div className="p-3 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-md">
                  <p className="text-sm text-red-600 dark:text-red-400">
                    {execution.error}
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
}
