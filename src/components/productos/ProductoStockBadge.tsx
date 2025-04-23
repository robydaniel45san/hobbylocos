
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle } from 'lucide-react';

interface ProductoStockBadgeProps {
  stock: number;
}

export const ProductoStockBadge: React.FC<ProductoStockBadgeProps> = ({ stock }) => {
  if (stock === 0) {
    return (
      <Badge variant="destructive" className="flex gap-1 items-center">
        <AlertTriangle className="h-3 w-3" />
        Sin stock
      </Badge>
    );
  } else if (stock <= 5) {
    return (
      <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200 flex gap-1 items-center">
        <AlertTriangle className="h-3 w-3" />
        Stock bajo
      </Badge>
    );
  } else {
    return <span className="text-green-600 font-medium">{stock}</span>;
  }
};
