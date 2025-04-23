
import React, { useState } from 'react';
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableRow, 
  TableHead, 
  TableCell 
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, Package, AlertTriangle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Producto } from '@/types';

// DEMO realista para tienda mayorista/minorista de figuras y artículos de anime
const productosDemoData: Producto[] = [
  {
    id: '1',
    nombre: 'Figura Naruto Uzumaki - 20cm',
    categoria: 'Figuras',
    stock: 20,
    precio_unitario: 130.00,
    descripcion: 'Figura coleccionable de Naruto con base, acabado premium.',
    imagen_url: null,
    activo: true
  },
  {
    id: '2',
    nombre: 'Katana decorativa - Kimetsu no Yaiba',
    categoria: 'Katanas',
    stock: 6,
    precio_unitario: 270.00,
    descripcion: 'Katana de Tanjiro Kamado (replica decorativa, 1m).',
    imagen_url: null,
    activo: true
  },
  {
    id: '3',
    nombre: 'Mochila Pokémon Eevee',
    categoria: 'Mochilas',
    stock: 14,
    precio_unitario: 110.00,
    descripcion: 'Mochila escolar con diseño de Eevee. Material resistente.',
    imagen_url: null,
    activo: true
  },
  {
    id: '4',
    nombre: 'Llavero Akatsuki',
    categoria: 'Llaveros',
    stock: 40,
    precio_unitario: 20.00,
    descripcion: 'Llavero metálico con logo de la organización Akatsuki.',
    imagen_url: null,
    activo: true
  },
  {
    id: '5',
    nombre: 'Figura Goku Super Saiyan - 18cm',
    categoria: 'Figuras',
    stock: 4,
    precio_unitario: 125.00,
    descripcion: 'Figura articulada de Goku con efecto de poder.',
    imagen_url: null,
    activo: true
  },
  {
    id: '6',
    nombre: 'Set de Pósters My Hero Academia (5u)',
    categoria: 'Pósters',
    stock: 0,
    precio_unitario: 45.00,
    descripcion: 'Set de 5 pósters tamaño A3, alta resolución.',
    imagen_url: null,
    activo: false
  },
];

const Productos = () => {
  const [filtro, setFiltro] = useState<string>('');
  const [productos, setProductos] = useState<Producto[]>(productosDemoData);

  const productosFiltrados = productos.filter(producto => 
    producto.nombre.toLowerCase().includes(filtro.toLowerCase()) ||
    (producto.categoria && producto.categoria.toLowerCase().includes(filtro.toLowerCase())) ||
    String(producto.stock).includes(filtro) ||
    String(producto.precio_unitario).includes(filtro)
  );

  const renderEstadoStock = (stock: number) => {
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

  return (
    <div className="space-y-6">
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

      <div className="flex justify-between items-center flex-wrap gap-4">
        <div className="flex items-center relative max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar productos de anime..."
            className="pl-9 w-full"
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-4">
          <Card className="border-none shadow-none bg-blue-50">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="bg-app-blue-light rounded-full p-2">
                <Package className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-app-blue-dark">Total Productos</p>
                <p className="font-bold text-lg">{productos.length}</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-none shadow-none bg-red-50">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="bg-red-400 rounded-full p-2">
                <AlertTriangle className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-red-700">Stock Bajo</p>
                <p className="font-bold text-lg">
                  {productos.filter(p => p.stock <= 5).length}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Categoría</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Precio (Bs)</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {productosFiltrados.length > 0 ? (
              productosFiltrados.map((producto) => (
                <TableRow key={producto.id}>
                  <TableCell className="font-medium">{producto.nombre}</TableCell>
                  <TableCell>{producto.categoria || '-'}</TableCell>
                  <TableCell>{renderEstadoStock(producto.stock)}</TableCell>
                  <TableCell>
                    Bs {producto.precio_unitario.toFixed(2)}
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
                <TableCell colSpan={6} className="h-24 text-center">
                  No se encontraron productos
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default Productos;

