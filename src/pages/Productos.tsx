
import React from 'react';
import { useProductos } from '@/hooks/useProductos';
import { ProductosHeader } from '@/components/productos/ProductosHeader';
import { ProductosFilterBar } from '@/components/productos/ProductosFilterBar';
import { ProductosTable } from '@/components/productos/ProductosTable';

const Productos = () => {
  const { 
    filtro, 
    setFiltro, 
    productos, 
    setProductos, 
    productosFiltrados,
    fetchProductos,
    eliminarProducto,
    actualizarProducto,
    loading,
    error
  } = useProductos();

  return (
    <div className="space-y-6">
      <ProductosHeader />
      <ProductosFilterBar 
        filtro={filtro} 
        setFiltro={setFiltro} 
        productos={productos} 
      />
      {error && (
        <div className="bg-destructive/15 text-destructive px-4 py-3 rounded-md">
          <p className="font-medium">Error al cargar productos</p>
          <p className="text-sm">{error}</p>
        </div>
      )}
      <ProductosTable 
        productos={productosFiltrados}
        onEliminarProducto={eliminarProducto}
        onActualizarProducto={actualizarProducto}
        loading={loading}
      />
    </div>
  );
};

export default Productos;
