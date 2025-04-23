
import React from 'react';
import { Input } from '@/components/ui/input';
import { Search, Calendar } from 'lucide-react';

interface VentasFilterBarProps {
  filtro: string;
  setFiltro: (x: string) => void;
}

export const VentasFilterBar: React.FC<VentasFilterBarProps> = ({ filtro, setFiltro }) => (
  <div className="flex flex-wrap gap-4 items-center justify-between">
    <div className="flex items-center relative max-w-sm">
      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        placeholder="Buscar ventas..."
        className="pl-9 w-full"
        value={filtro}
        onChange={(e) => setFiltro(e.target.value)}
      />
    </div>
    <div className="flex gap-2 items-center">
      <Calendar className="h-4 w-4 text-muted-foreground" />
      <span className="text-sm text-muted-foreground">
        Últimos 30 días
      </span>
    </div>
  </div>
);
