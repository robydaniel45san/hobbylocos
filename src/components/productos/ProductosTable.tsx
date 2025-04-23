
import React from 'react';
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableRow, 
  TableHead, 
  TableCell 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Producto } from '@/types';
import { ProductoStockBadge } from './ProductoStockBadge';

interface ProductosTableProps {
  productos: Producto[];
}

export const ProductosTable: React.FC<ProductosTableProps> = ({ productos }) => {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nombre</TableHead>
            <TableHead>Categoría</TableHead>
            <TableHead>Stock</TableHead>
            <TableHead>Precio Minorista (Bs)</TableHead>
            <TableHead>Precio Mayorista (Bs)</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {productos.length > 0 ? (
            productos.map((producto) => (
              <TableRow key={producto.id}>
                <TableCell className="font-medium">{producto.nombre}</TableCell>
                <TableCell>{producto.categoria || '-'}</TableCell>
                <TableCell>
                  <ProductoStockBadge stock={producto.stock} />
                </TableCell>
                <TableCell>
                  Bs {producto.precio_minorista.toFixed(2)}
                </TableCell>
                <TableCell>
                  Bs {producto.precio_mayorista.toFixed(2)}
                </TableCell>
                <TableCell>
                  <Badge variant={producto.activo ? "outline" : "secondary"}>
                    {producto.activo ? 'Activo' : 'Inactivo'}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button size="sm" variant="ghost">
                    Editar
                  </Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={7} className="h-24 text-center">
                No se encontraron productos
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};
