
import React from 'react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
  onClick?: () => void;
}

export function StatCard({
  title,
  value,
  description,
  icon,
  trend,
  className,
  onClick
}: StatCardProps) {
  return (
    <Card 
      className={cn(
        "glass-card border-white/10 p-6 transition-all duration-300 hover:bg-white/5 hover-lift", 
        onClick && "cursor-pointer", 
        className
      )}
      onClick={onClick}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-muted-foreground mb-1">{title}</p>
          <h3 className="text-2xl font-bold text-foreground mb-1">{value}</h3>
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
          {trend && (
            <div className="flex items-center mt-2 gap-1">
              {trend.isPositive ? (
                <TrendingUp className="h-4 w-4 text-green-500" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-500" />
              )}
              <span className={cn(
                "text-sm font-medium",
                trend.isPositive ? "text-green-600" : "text-red-600"
              )}>
                {trend.isPositive ? "+" : "-"}{Math.abs(trend.value).toFixed(1)}%
              </span>
              <span className="text-xs text-muted-foreground">vs mes anterior</span>
            </div>
          )}
        </div>
        {icon && (
          <div className="bg-gradient-to-br from-purple-500/20 to-blue-500/20 p-3 rounded-xl">
            {icon}
          </div>
        )}
      </div>
    </Card>
  );
}
