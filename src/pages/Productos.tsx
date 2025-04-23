
import React from 'react';
import { useProductos } from '@/hooks/useProductos';
import { ProductosHeader } from '@/components/productos/ProductosHeader';
import { ProductosFilterBar } from '@/components/productos/ProductosFilterBar';
import { ProductosTable } from '@/components/productos/ProductosTable';

const Productos = () => {
  const { filtro, setFiltro, productos, productosFiltrados } = useProductos();

  return (
    <div className="space-y-6">
      <ProductosHeader />
      <ProductosFilterBar filtro={filtro} setFiltro={setFiltro} productos={productos} />
      <ProductosTable productos={productosFiltrados} />
    </div>
  );
};

export default Productos;
