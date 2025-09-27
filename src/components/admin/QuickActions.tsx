import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LucideIcon, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface QuickAction {
  title: string;
  description: string;
  href: string;
  icon: LucideIcon;
  colorScheme?: "primary" | "secondary";
}

interface QuickActionsProps {
  actions: QuickAction[];
}

export function QuickActions({ actions }: QuickActionsProps) {
  return (
    <Card className="bg-dark-900 border-dark-800">
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
        <CardDescription>Jump to common tasks</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {actions.map((action) => {
            const Icon = action.icon;
            const colorScheme = action.colorScheme || "primary";
            const iconColor =
              colorScheme === "primary"
                ? "text-primary-500"
                : "text-secondary-500";
            const plusColor =
              colorScheme === "primary"
                ? "group-hover:text-primary-500"
                : "group-hover:text-secondary-500";

            return (
              <Link key={action.href} href={action.href}>
                <div className="p-4 bg-dark-800 hover:bg-dark-700 rounded-lg transition-all cursor-pointer group">
                  <div className="flex items-center justify-between mb-2">
                    <Icon
                      className={cn(
                        "h-6 w-6 group-hover:scale-110 transition-transform",
                        iconColor
                      )}
                    />
                    <Plus
                      className={cn(
                        "h-4 w-4 text-dark-500 transition-colors",
                        plusColor
                      )}
                    />
                  </div>
                  <p className="font-semibold text-dark-100">{action.title}</p>
                  <p className="text-sm text-dark-400">{action.description}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
