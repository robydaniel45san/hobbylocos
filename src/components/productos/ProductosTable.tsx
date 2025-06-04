
import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Pencil, Trash2, Eye, Package, AlertTriangle, CheckCircle } from 'lucide-react';
import { EditarProductoModal } from './EditarProductoModal';
import { Producto } from '@/types';

interface ProductosTableProps {
  productos: Producto[];
  onEliminarProducto: (id: string) => void;
  onActualizarProducto: (producto: Producto) => void;
  loading: boolean;
}

export const ProductosTable: React.FC<ProductosTableProps> = ({
  productos,
  onEliminarProducto,
  onActualizarProducto,
  loading
}) => {
  const [editandoProducto, setEditandoProducto] = useState<Producto | null>(null);

  const getStockBadge = (stock: number) => {
    if (stock === 0) {
      return (
        <Badge variant="destructive" className="flex items-center gap-1">
          <AlertTriangle className="h-3 w-3" />
          Sin stock
        </Badge>
      );
    } else if (stock <= 5) {
      return (
        <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 flex items-center gap-1">
          <Package className="h-3 w-3" />
          Stock bajo
        </Badge>
      );
    } else {
      return (
        <Badge variant="default" className="bg-green-100 text-green-800 flex items-center gap-1">
          <CheckCircle className="h-3 w-3" />
          En stock
        </Badge>
      );
    }
  };

  if (loading) {
    return (
      <Card className="glass-effect border-0">
        <CardContent className="p-8">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
            <span className="ml-3 text-muted-foreground">Cargando productos...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (productos.length === 0) {
    return (
      <Card className="glass-effect border-0">
        <CardContent className="p-12 text-center">
          <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-muted-foreground mb-2">No hay productos</h3>
          <p className="text-muted-foreground">Agrega tu primer producto para comenzar</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className="glass-effect border-0 overflow-hidden">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-gray-100">
                <TableHead className="font-semibold text-gray-700 py-4 px-6">Producto</TableHead>
                <TableHead className="font-semibold text-gray-700">Categoría</TableHead>
                <TableHead className="font-semibold text-gray-700">Stock</TableHead>
                <TableHead className="font-semibold text-gray-700">Estado</TableHead>
                <TableHead className="font-semibold text-gray-700">Precio Minorista</TableHead>
                <TableHead className="font-semibold text-gray-700">Precio Mayorista</TableHead>
                <TableHead className="font-semibold text-gray-700 text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {productos.map((producto) => (
                <TableRow key={producto.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                  <TableCell className="py-4 px-6">
                    <div className="font-semibold text-gray-900">{producto.nombre}</div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                      {producto.categoria}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className="font-semibold text-lg">{producto.stock}</span>
                  </TableCell>
                  <TableCell>
                    {getStockBadge(producto.stock)}
                  </TableCell>
                  <TableCell>
                    <span className="font-semibold text-green-600">Bs. {producto.precio_minorista}</span>
                  </TableCell>
                  <TableCell>
                    <span className="font-semibold text-blue-600">Bs. {producto.precio_mayorista}</span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setEditandoProducto(producto)}
                        className="hover:bg-blue-50 hover:text-blue-600"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEliminarProducto(producto.id)}
                        className="hover:bg-red-50 hover:text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {editandoProducto && (
        <EditarProductoModal
          producto={editandoProducto}
          open={!!editandoProducto}
          onOpenChange={(open) => !open && setEditandoProducto(null)}
          onProductoActualizado={onActualizarProducto}
        />
      )}
    </>
  );
};
