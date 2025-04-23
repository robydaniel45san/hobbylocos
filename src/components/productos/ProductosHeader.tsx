
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { NuevoProductoModal } from './NuevoProductoModal';
import { useProductos } from "@/hooks/useProductos";

export const ProductosHeader: React.FC = () => {
  // El hook se usa para actualizar productos luego de añadir uno nuevo
  const { fetchProductos } = useProductos();
  const [open, setOpen] = useState(false);

  const handleProductoCreado = () => {
    // Refresca los productos del inventario al agregar uno nuevo
    fetchProductos();
  };

  return (
    <div className="flex justify-between items-center">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Productos Anime</h1>
        <p className="text-muted-foreground">
          Venta mayorista y minorista de figuras, katanas, mochilas, llaveros y artículos de anime.
        </p>
      </div>
      <>
        <Button onClick={() => setOpen(true)}>
          <Plus className="h-4 w-4 mr-1" />
          Nuevo Producto
        </Button>
        <NuevoProductoModal 
          open={open} 
          onOpenChange={setOpen}
          onProductoCreado={handleProductoCreado}
        />
      </>
    </div>
  );
};
