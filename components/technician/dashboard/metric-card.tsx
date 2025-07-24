import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  title: string;
  value: string | number;
  className?: string;
  icon?: React.ComponentType<{ className?: string }>;
}

export function MetricCard({ title, value, className, icon: Icon }: MetricCardProps) {
  return (
    <Card className={cn("p-4 space-y-2", className)}>
      <div className="flex items-center justify-between">
        <h3 className="text-sm text-muted-foreground">{title}</h3>
        {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
      </div>
      <p className="text-2xl font-bold">{value}</p>
    </Card>
  );
}