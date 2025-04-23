
import { Producto } from '@/types';

// DEMO realista para tienda mayorista/minorista de figuras y artículos de anime
export const productosDemoData: Producto[] = [
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
