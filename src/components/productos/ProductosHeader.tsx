
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Sparkles } from 'lucide-react';
import { NuevoProductoModal } from './NuevoProductoModal';
import { useProductos } from "@/hooks/useProductos";
import { Producto } from '@/types';

export const ProductosHeader: React.FC = () => {
  const { fetchProductos, setProductos, productos } = useProductos();
  const [open, setOpen] = useState(false);

  const handleProductoCreado = (nuevoProducto: Producto) => {
    setProductos(prevProductos => [nuevoProducto, ...prevProductos]);
    fetchProductos();
  };

  return (
    <div className="flex justify-between items-center mb-8">
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center shadow-lg">
            <Sparkles className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gradient">Productos Anime</h1>
            <p className="text-muted-foreground text-lg">
              Gestiona tu inventario de figuras, katanas, mochilas y artículos de anime
            </p>
          </div>
        </div>
      </div>
      <Button 
        onClick={() => setOpen(true)} 
        className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white shadow-lg hover-lift px-6 py-3 text-sm font-semibold"
      >
        <Plus className="h-4 w-4 mr-2" />
        Nuevo Producto
      </Button>
      <NuevoProductoModal 
        open={open} 
        onOpenChange={setOpen}
        onProductoCreado={handleProductoCreado}
      />
    </div>
  );
};
