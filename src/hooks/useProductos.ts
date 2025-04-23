
import { useState } from 'react';
import { Producto } from '@/types';
import { productosDemoData } from '@/data/productosData';

export const useProductos = () => {
  const [filtro, setFiltro] = useState<string>('');
  const [productos, setProductos] = useState<Producto[]>(productosDemoData);

  const productosFiltrados = productos.filter(producto => 
    producto.nombre.toLowerCase().includes(filtro.toLowerCase()) ||
    (producto.categoria && producto.categoria.toLowerCase().includes(filtro.toLowerCase())) ||
    String(producto.stock).includes(filtro) ||
    String(producto.precio_minorista).includes(filtro) ||
    String(producto.precio_mayorista).includes(filtro)
  );

  return {
    filtro,
    setFiltro,
    productos,
    setProductos,
    productosFiltrados
  };
};
