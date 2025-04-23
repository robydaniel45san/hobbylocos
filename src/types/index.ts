
// Interfaces de entidades principales
export interface Producto {
  id: string;
  nombre: string;
  categoria: string | null;
  stock: number;
  precio_minorista: number;
  precio_mayorista: number;
  descripcion: string | null;
  imagen_url: string | null;
  activo: boolean;
  created_at?: string;
}

export interface Cliente {
  id: string;
  nombre_completo: string;
  celular: string | null;
  correo: string | null;
  direccion: string | null;
  departamento: string | null;
  provincia: string | null;
  notas: string | null;
  created_at?: string;
}

export type EstadoVenta = 'reserva' | 'espera' | 'realizado';

export interface Venta {
  id: string;
  cliente_id: string | null;
  fecha: string;
  total: number;
  estado: EstadoVenta;
  created_at?: string;
  cliente?: Cliente;
  detalles?: DetalleVenta[];
  envio?: Envio;
}

export interface DetalleVenta {
  id: string;
  venta_id: string;
  producto_id: string;
  cantidad: number;
  precio_unitario: number;
  subtotal: number;
  producto?: Producto;
}

export type EstadoEnvio = 'pendiente' | 'enviado' | 'entregado';

export interface Envio {
  id: string;
  venta_id: string;
  fecha_envio: string | null;
  departamento: string | null;
  provincia: string | null;
  empresa_envio: string | null;
  costo: number | null;
  estado: EstadoEnvio;
  created_at?: string;
}

// Interfaces para estadísticas y dashboard
export interface VentasPorMes {
  mes: string;
  total: number;
}

export interface VentasPorEstado {
  estado: EstadoVenta;
  total: number;
  cantidad: number;
}

export interface ProductoMasVendido {
  id: string;
  nombre: string;
  cantidad: number;
  total: number;
}

// Añadir tipo de moneda boliviana
export type Moneda = 'Bs';  // Bolivianos
