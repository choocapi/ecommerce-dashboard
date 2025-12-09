import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  description?: string;
  loading?: boolean;
  className?: string;
}

export function StatsCard({
  title,
  value,
  icon: Icon,
  description,
  loading,
  className,
}: StatsCardProps) {
  return (
    <Card className={cn("relative overflow-hidden", className)}>
      <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className="relative">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary/15 to-primary/5 flex items-center justify-center shadow-md">
            <Icon className="h-5 w-5 text-primary" />
          </div>
        </div>
      </CardHeader>

      <CardContent className="relative">
        {loading ? (
          <div className="h-8 w-24 animate-pulse bg-muted rounded" />
        ) : (
          <div className="space-y-1">
            <div className="text-2xl font-bold tracking-tight text-primary">{value}</div>
            {description && <p className="text-xs text-muted-foreground">{description}</p>}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
