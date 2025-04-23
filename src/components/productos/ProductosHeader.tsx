
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export const ProductosHeader: React.FC = () => {
  return (
    <div className="flex justify-between items-center">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Productos Anime</h1>
        <p className="text-muted-foreground">
          Venta mayorista y minorista de figuras, katanas, mochilas, llaveros y artículos de anime.
        </p>
      </div>
      <Button>
        <Plus className="h-4 w-4 mr-1" />
        Nuevo Producto
      </Button>
    </div>
  );
};
