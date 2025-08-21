import { Card, CardContent } from "@/components/ui/card";
import type { LucideIcon } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string | number;
  className?: string;
  icon?: LucideIcon;
}

export function MetricCard({
  title,
  value,
  className,
  icon: Icon,
}: MetricCardProps) {
  return (
    <Card className={`${className} py-0 h-32`}>
      <CardContent className="p-4 sm:p-6">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            {Icon && <Icon className="w-4 h-4 text-blue-500" />}
          </div>
          <p className="text-2xl sm:text-3xl font-bold">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
}
