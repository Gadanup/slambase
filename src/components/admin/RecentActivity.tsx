import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface ActivityItem {
  id: number | string;
  title: string;
  subtitle: string;
  badge?: {
    label: string;
    variant?: "default" | "outline";
  };
}

interface RecentActivityProps {
  title: string;
  description: string;
  items?: ActivityItem[];
  icon?: LucideIcon;
  emptyMessage?: string;
  colorScheme?: "primary" | "secondary";
}

export function RecentActivity({
  title,
  description,
  items = [],
  icon: Icon = Clock,
  emptyMessage = "No recent activity",
  colorScheme = "primary",
}: RecentActivityProps) {
  const colors = {
    primary: "text-primary-500 border-primary-500",
    secondary: "text-secondary-500 border-secondary-500",
  };

  return (
    <Card className="bg-dark-900 border-dark-800">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Icon className={cn("h-5 w-5", colors[colorScheme].split(" ")[0])} />
          {title}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        {items.length > 0 ? (
          <div className="space-y-3">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-3 bg-dark-800 rounded-lg hover:bg-dark-700 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-dark-100 truncate">
                    {item.title}
                  </p>
                  <p className="text-xs text-dark-500">{item.subtitle}</p>
                </div>
                {item.badge && (
                  <Badge
                    variant={item.badge.variant || "outline"}
                    className={cn(colors[colorScheme])}
                  >
                    {item.badge.label}
                  </Badge>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-dark-500 text-center py-8">{emptyMessage}</p>
        )}
      </CardContent>
    </Card>
  );
}
