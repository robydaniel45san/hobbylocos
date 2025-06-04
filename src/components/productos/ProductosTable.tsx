
import React, { useState } from 'react';
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
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Edit, Trash2 } from 'lucide-react';
import { Producto } from '@/types';
import { ProductoStockBadge } from './ProductoStockBadge';
import { EditarProductoModal } from './EditarProductoModal';

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
  const [productoAEliminar, setProductoAEliminar] = useState<Producto | null>(null);
  const [productoAEditar, setProductoAEditar] = useState<Producto | null>(null);
  const [modalEditarAbierto, setModalEditarAbierto] = useState(false);

  const handleEliminar = async () => {
    if (productoAEliminar) {
      await onEliminarProducto(productoAEliminar.id);
      setProductoAEliminar(null);
    }
  };

  const handleEditar = (producto: Producto) => {
    setProductoAEditar(producto);
    setModalEditarAbierto(true);
  };

  if (loading) {
    return (
      <div className="rounded-md border">
        <div className="p-8 text-center">
          <p className="text-muted-foreground">Cargando productos...</p>
        </div>
      </div>
    );
  }

  return (
    <>
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
                    <div className="flex gap-2 justify-end">
                      <Button 
                        size="sm" 
                        variant="ghost"
                        onClick={() => handleEditar(producto)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="ghost"
                        onClick={() => setProductoAEliminar(producto)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
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

      {/* Modal de confirmación para eliminar */}
      <AlertDialog open={!!productoAEliminar} onOpenChange={() => setProductoAEliminar(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar producto?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Se eliminará permanentemente el producto "{productoAEliminar?.nombre}".
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleEliminar} className="bg-destructive text-destructive-foreground">
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Modal de edición */}
      <EditarProductoModal
        open={modalEditarAbierto}
        onOpenChange={setModalEditarAbierto}
        producto={productoAEditar}
        onProductoActualizado={onActualizarProducto}
      />
    </>
  );
};
