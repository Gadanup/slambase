import { LucideIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: number;
  description: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  colorScheme?: "primary" | "secondary";
}

export function StatsCard({
  title,
  value,
  description,
  icon: Icon,
  trend,
  colorScheme = "primary",
}: StatsCardProps) {
  const colors = {
    primary: "text-primary-500",
    secondary: "text-secondary-500",
  };

  return (
    <Card className="bg-dark-900 border-dark-800 card-hover">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-dark-300">
          {title}
        </CardTitle>
        <Icon className={cn("h-4 w-4", colors[colorScheme])} />
      </CardHeader>
      <CardContent>
        <div className={cn("text-3xl font-bold", colors[colorScheme])}>
          {value}
        </div>
        <div className="flex items-center gap-2 mt-1">
          {trend && (
            <span
              className={cn(
                "text-xs font-medium",
                trend.isPositive ? "text-green-500" : "text-red-500"
              )}
            >
              {trend.isPositive ? "+" : "-"}
              {Math.abs(trend.value)}%
            </span>
          )}
          <p className="text-xs text-dark-400">{description}</p>
        </div>
      </CardContent>
    </Card>
  );
}
