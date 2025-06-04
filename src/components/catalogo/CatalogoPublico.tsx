
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Search, ShoppingCart, Heart, Filter } from 'lucide-react';
import { useProductos } from '@/hooks/useProductos';

export const CatalogoPublico = () => {
  const { productosFiltrados, filtro, setFiltro } = useProductos();
  const [categoriaFiltro, setCategoriaFiltro] = useState('todas');
  const [ordenPor, setOrdenPor] = useState('nombre');
  const [carrito, setCarrito] = useState<string[]>([]);

  const productosVisibles = productosFiltrados
    .filter(p => p.activo)
    .filter(p => categoriaFiltro === 'todas' || p.categoria === categoriaFiltro)
    .sort((a, b) => {
      switch (ordenPor) {
        case 'precio_asc':
          return a.precio_minorista - b.precio_minorista;
        case 'precio_desc':
          return b.precio_minorista - a.precio_minorista;
        case 'stock':
          return b.stock - a.stock;
        default:
          return a.nombre.localeCompare(b.nombre);
      }
    });

  const categorias = [...new Set(productosFiltrados.map(p => p.categoria).filter(Boolean))];

  const agregarAlCarrito = (productoId: string) => {
    setCarrito(prev => [...prev, productoId]);
  };

  const formatearPrecio = (precio: number) => {
    return new Intl.NumberFormat('es-BO', {
      style: 'currency',
      currency: 'BOB',
      minimumFractionDigits: 0
    }).format(precio);
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-orange-500 bg-clip-text text-transparent">
          Hobby Store - Catálogo Anime
        </h1>
        <p className="text-lg text-muted-foreground">
          Descubre nuestra colección de productos anime
        </p>
      </div>

      <div className="flex flex-wrap gap-4 items-center justify-between">
        <div className="flex items-center gap-4 flex-1">
          <div className="relative max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar productos..."
              className="pl-9"
              value={filtro}
              onChange={(e) => setFiltro(e.target.value)}
            />
          </div>

          <Select value={categoriaFiltro} onValueChange={setCategoriaFiltro}>
            <SelectTrigger className="w-48">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Categoría" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todas">Todas las categorías</SelectItem>
              {categorias.map(categoria => (
                <SelectItem key={categoria} value={categoria || ''}>
                  {categoria}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={ordenPor} onValueChange={setOrdenPor}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Ordenar por" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="nombre">Nombre A-Z</SelectItem>
              <SelectItem value="precio_asc">Precio: Menor a Mayor</SelectItem>
              <SelectItem value="precio_desc">Precio: Mayor a Menor</SelectItem>
              <SelectItem value="stock">Stock Disponible</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon">
            <Heart className="h-4 w-4" />
          </Button>
          <Button variant="outline" className="relative">
            <ShoppingCart className="h-4 w-4 mr-2" />
            Carrito
            {carrito.length > 0 && (
              <Badge variant="destructive" className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                {carrito.length}
              </Badge>
            )}
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {productosVisibles.map((producto) => (
          <Card key={producto.id} className="group hover:shadow-lg transition-shadow">
            <CardHeader className="p-4">
              <div className="aspect-square bg-gradient-to-br from-purple-100 to-orange-100 rounded-lg mb-3 flex items-center justify-center">
                {producto.imagen_url ? (
                  <img 
                    src={producto.imagen_url} 
                    alt={producto.nombre}
                    className="w-full h-full object-cover rounded-lg"
                  />
                ) : (
                  <div className="text-4xl">🎌</div>
                )}
              </div>
              <CardTitle className="text-lg leading-tight">{producto.nombre}</CardTitle>
              {producto.categoria && (
                <Badge variant="secondary" className="w-fit">
                  {producto.categoria}
                </Badge>
              )}
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-primary">
                    {formatearPrecio(producto.precio_minorista)}
                  </span>
                  <Badge variant={producto.stock > 5 ? "default" : producto.stock > 0 ? "secondary" : "destructive"}>
                    {producto.stock > 0 ? `${producto.stock} disponibles` : 'Agotado'}
                  </Badge>
                </div>

                {producto.descripcion && (
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {producto.descripcion}
                  </p>
                )}

                <Button 
                  className="w-full" 
                  disabled={producto.stock === 0}
                  onClick={() => agregarAlCarrito(producto.id)}
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  {producto.stock === 0 ? 'Agotado' : 'Agregar al Carrito'}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {productosVisibles.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>No se encontraron productos con los filtros seleccionados</p>
        </div>
      )}
    </div>
  );
};
