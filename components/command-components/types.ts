import { LucideIcon } from "lucide-react";

export type CommandExecution = {
  id: number;
  timestamp: string;
  command: string;
  status: "loading" | "success" | "error";
  request?: any;
  response?: any;
  error?: string;
  duration?: number;
};

export type MethodConfig = {
  name: string;
  label: string;
  description: string;
  icon: LucideIcon;
  category: "info" | "payment" | "invoice" | "transaction";
  requiresParams?: boolean;
};
