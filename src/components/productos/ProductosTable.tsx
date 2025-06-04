
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Pencil, Trash2, Package } from 'lucide-react';
import { Producto } from '@/types';
import { ProductoStockBadge } from './ProductoStockBadge';
import { EditarProductoModal } from './EditarProductoModal';
import { useState } from 'react';

interface ProductosTableProps {
  productos: Producto[];
  onEliminarProducto: (id: string) => Promise<boolean>;
  onActualizarProducto: (id: string, datos: Partial<Producto>) => Promise<boolean>;
  loading?: boolean;
}

export const ProductosTable: React.FC<ProductosTableProps> = ({
  productos,
  onEliminarProducto,
  onActualizarProducto,
  loading = false
}) => {
  const [editandoProducto, setEditandoProducto] = useState<Producto | null>(null);

  const handleEditar = (producto: Producto) => {
    setEditandoProducto(producto);
  };

  const handleActualizar = async (datosActualizados: Partial<Producto>) => {
    if (editandoProducto) {
      const success = await onActualizarProducto(editandoProducto.id, datosActualizados);
      if (success) {
        setEditandoProducto(null);
      }
      return success;
    }
    return false;
  };

  if (loading) {
    return (
      <div className="glass-card rounded-xl p-8">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
          <span className="ml-3 text-muted-foreground">Cargando productos...</span>
        </div>
      </div>
    );
  }

  if (productos.length === 0) {
    return (
      <div className="glass-card rounded-xl p-12 text-center">
        <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
        <h3 className="text-xl font-semibold text-muted-foreground mb-2">No hay productos</h3>
        <p className="text-muted-foreground">Agrega tu primer producto para comenzar</p>
      </div>
    );
  }

  return (
    <>
      <div className="glass-card rounded-xl overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-white/10 hover:bg-white/5">
              <TableHead className="text-foreground font-semibold">Producto</TableHead>
              <TableHead className="text-foreground font-semibold">Categoría</TableHead>
              <TableHead className="text-foreground font-semibold">Stock</TableHead>
              <TableHead className="text-foreground font-semibold">Precio Minorista</TableHead>
              <TableHead className="text-foreground font-semibold">Precio Mayorista</TableHead>
              <TableHead className="text-foreground font-semibold">Estado</TableHead>
              <TableHead className="text-right text-foreground font-semibold">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {productos.map((producto) => (
              <TableRow 
                key={producto.id} 
                className="border-white/10 hover:bg-white/5 transition-colors group"
              >
                <TableCell className="font-medium">
                  <div className="flex items-center space-x-3">
                    {producto.imagen_url ? (
                      <img 
                        src={producto.imagen_url} 
                        alt={producto.nombre}
                        className="w-10 h-10 rounded-lg object-cover shadow-sm"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center">
                        <Package className="h-5 w-5 text-purple-500" />
                      </div>
                    )}
                    <div>
                      <div className="font-semibold text-foreground">{producto.nombre}</div>
                      {producto.descripcion && (
                        <div className="text-sm text-muted-foreground line-clamp-1">
                          {producto.descripcion}
                        </div>
                      )}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  {producto.categoria ? (
                    <Badge variant="outline" className="glass-effect border-purple-200">
                      {producto.categoria}
                    </Badge>
                  ) : (
                    <span className="text-muted-foreground text-sm">Sin categoría</span>
                  )}
                </TableCell>
                <TableCell>
                  <ProductoStockBadge stock={producto.stock} />
                </TableCell>
                <TableCell className="font-medium">
                  Bs {producto.precio_minorista.toFixed(2)}
                </TableCell>
                <TableCell className="font-medium">
                  Bs {producto.precio_mayorista.toFixed(2)}
                </TableCell>
                <TableCell>
                  <Badge 
                    variant={producto.activo ? "default" : "secondary"}
                    className={producto.activo 
                      ? "bg-green-500/15 text-green-700 border-green-200 hover:bg-green-500/20" 
                      : "bg-gray-500/15 text-gray-700 border-gray-200"
                    }
                  >
                    {producto.activo ? 'Activo' : 'Inactivo'}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleEditar(producto)}
                      className="hover:bg-blue-500/10 hover:text-blue-600"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => onEliminarProducto(producto.id)}
                      className="hover:bg-red-500/10 hover:text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {editandoProducto && (
        <EditarProductoModal
          producto={editandoProducto}
          open={true}
          onOpenChange={(open) => !open && setEditandoProducto(null)}
          onProductoActualizado={handleActualizar}
        />
      )}
    </>
  );
};
