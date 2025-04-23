
import React from 'react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

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
        "p-6 transition-all duration-200 hover:shadow-md", 
        onClick && "cursor-pointer", 
        className
      )}
      onClick={onClick}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <h3 className="text-2xl font-bold mt-1">{value}</h3>
          {description && (
            <p className="text-sm text-muted-foreground mt-1">{description}</p>
          )}
          {trend && (
            <div className="flex items-center mt-2">
              <span className={cn(
                "text-sm font-medium",
                trend.isPositive ? "text-green-600" : "text-red-600"
              )}>
                {trend.isPositive ? "+" : "-"}{Math.abs(trend.value)}%
              </span>
              <span className="text-xs text-muted-foreground ml-1">vs mes anterior</span>
            </div>
          )}
        </div>
        {icon && (
          <div className="bg-primary/10 p-3 rounded-lg">
            {icon}
          </div>
        )}
      </div>
    </Card>
  );
}
