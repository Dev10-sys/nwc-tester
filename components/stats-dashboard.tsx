"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Activity,
  CheckCircle2,
  XCircle,
  Clock,
  TrendingUp,
} from "lucide-react";

type ExecutionStats = {
  total: number;
  successful: number;
  failed: number;
  avgDuration: number;
  lastExecution: string | null;
};

export function StatsDashboard({
  executions,
}: {
  executions: Array<{
    status: "loading" | "success" | "error";
    duration?: number;
    timestamp: string;
  }>;
}) {
  const stats = React.useMemo((): ExecutionStats => {
    const total = executions.length;
    const successful = executions.filter((e) => e.status === "success").length;
    const failed = executions.filter((e) => e.status === "error").length;
    const durations = executions
      .filter((e) => e.duration !== undefined)
      .map((e) => e.duration!);
    const avgDuration =
      durations.length > 0
        ? Math.round(durations.reduce((a, b) => a + b, 0) / durations.length)
        : 0;
    const lastExecution = executions.length > 0 ? executions[0].timestamp : null;

    return { total, successful, failed, avgDuration, lastExecution };
  }, [executions]);

  const successRate =
    stats.total > 0
      ? Math.round((stats.successful / stats.total) * 100)
      : 0;

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
      <Card className="border-2">
        <CardHeader className="pb-2">
          <CardTitle className="text-xs font-medium text-muted-foreground flex items-center gap-1">
            <Activity className="h-3 w-3" />
            Total
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.total}</div>
        </CardContent>
      </Card>

      <Card className="border-2 border-green-200 dark:border-green-900">
        <CardHeader className="pb-2">
          <CardTitle className="text-xs font-medium text-muted-foreground flex items-center gap-1">
            <CheckCircle2 className="h-3 w-3 text-green-600 dark:text-green-400" />
            Success
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">
            {stats.successful}
          </div>
        </CardContent>
      </Card>

      <Card className="border-2 border-red-200 dark:border-red-900">
        <CardHeader className="pb-2">
          <CardTitle className="text-xs font-medium text-muted-foreground flex items-center gap-1">
            <XCircle className="h-3 w-3 text-red-600 dark:text-red-400" />
            Failed
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-600 dark:text-red-400">
            {stats.failed}
          </div>
        </CardContent>
      </Card>

      <Card className="border-2 border-blue-200 dark:border-blue-900">
        <CardHeader className="pb-2">
          <CardTitle className="text-xs font-medium text-muted-foreground flex items-center gap-1">
            <TrendingUp className="h-3 w-3 text-blue-600 dark:text-blue-400" />
            Success Rate
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {successRate}%
          </div>
        </CardContent>
      </Card>

      <Card className="border-2 border-orange-200 dark:border-orange-900">
        <CardHeader className="pb-2">
          <CardTitle className="text-xs font-medium text-muted-foreground flex items-center gap-1">
            <Clock className="h-3 w-3 text-orange-600 dark:text-orange-400" />
            Avg Time
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
            {stats.avgDuration}
            <span className="text-xs ml-1">ms</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
