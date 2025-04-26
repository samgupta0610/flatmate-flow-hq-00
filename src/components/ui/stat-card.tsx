
import { Card, CardContent } from "./card";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  trend?: "up" | "down" | "neutral";
  className?: string;
}

export function StatCard({ title, value, trend, className }: StatCardProps) {
  const trendColors = {
    up: "text-green-600",
    down: "text-red-600",
    neutral: "text-gray-600"
  };

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardContent className="p-6">
        <p className="text-sm font-medium text-maideasy-text-secondary">{title}</p>
        <p className={cn(
          "text-2xl font-bold mt-2",
          trend && trendColors[trend]
        )}>
          {value}
        </p>
      </CardContent>
    </Card>
  );
}
