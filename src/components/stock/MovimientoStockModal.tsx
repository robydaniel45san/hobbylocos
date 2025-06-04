
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Producto } from '@/types';
import { toast } from '@/hooks/use-toast';

interface MovimientoStockModalProps {
  abierto: boolean;
  onCerrar: () => void;
  onCrear: (movimiento: {
    producto_id: string;
    tipo: 'entrada' | 'salida' | 'ajuste';
    cantidad: number;
    motivo: string;
  }) => Promise<boolean>;
}

export function MovimientoStockModal({ abierto, onCerrar, onCrear }: MovimientoStockModalProps) {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [formData, setFormData] = useState({
    producto_id: '',
    tipo: '' as 'entrada' | 'salida' | 'ajuste' | '',
    cantidad: '',
    motivo: ''
  });
  const [loading, setLoading] = useState(false);
  const [productoSeleccionado, setProductoSeleccionado] = useState<Producto | null>(null);

  // Cargar productos
  useEffect(() => {
    if (abierto) {
      cargarProductos();
    }
  }, [abierto]);

  const cargarProductos = async () => {
    try {
      const { supabase } = await import("@/integrations/supabase/client");
      const { data, error } = await supabase
        .from("productos")
        .select("*")
        .eq("activo", true)
        .order("nombre");

      if (error) throw error;
      setProductos(data || []);
    } catch (error) {
      console.error('Error cargando productos:', error);
      toast({
        title: "Error",
        description: "No se pudieron cargar los productos",
        variant: "destructive",
      });
    }
  };

  const handleProductoChange = (productoId: string) => {
    const producto = productos.find(p => p.id === productoId);
    setProductoSeleccionado(producto || null);
    setFormData(prev => ({ ...prev, producto_id: productoId }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.producto_id || !formData.tipo || !formData.cantidad || !formData.motivo) {
      toast({
        title: "Campos requeridos",
        description: "Por favor completa todos los campos",
        variant: "destructive",
      });
      return;
    }

    const cantidad = parseInt(formData.cantidad);
    if (cantidad <= 0) {
      toast({
        title: "Cantidad inválida",
        description: "La cantidad debe ser mayor a 0",
        variant: "destructive",
      });
      return;
    }

    // Validación especial para salidas
    if (formData.tipo === 'salida' && productoSeleccionado && cantidad > productoSeleccionado.stock) {
      toast({
        title: "Stock insuficiente",
        description: `No puedes retirar ${cantidad} unidades. Stock disponible: ${productoSeleccionado.stock}`,
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    
    try {
      const exito = await onCrear({
        producto_id: formData.producto_id,
        tipo: formData.tipo,
        cantidad: formData.tipo === 'ajuste' ? cantidad : cantidad, // Para ajuste, cantidad es el nuevo stock total
        motivo: formData.motivo
      });

      if (exito) {
        onCerrar();
        setFormData({
          producto_id: '',
          tipo: '',
          cantidad: '',
          motivo: ''
        });
        setProductoSeleccionado(null);
      }
    } catch (error) {
      console.error('Error creando movimiento:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTipoDescripcion = (tipo: string) => {
    switch (tipo) {
      case 'entrada':
        return 'Agregar stock al inventario';
      case 'salida':
        return 'Retirar stock del inventario';
      case 'ajuste':
        return 'Ajustar stock a cantidad específica';
      default:
        return '';
    }
  };

  return (
    <Dialog open={abierto} onOpenChange={onCerrar}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Nuevo Movimiento de Stock</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="producto">Producto *</Label>
            <Select value={formData.producto_id} onValueChange={handleProductoChange}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar producto" />
              </SelectTrigger>
              <SelectContent>
                {productos.map((producto) => (
                  <SelectItem key={producto.id} value={producto.id}>
                    {producto.nombre} (Stock: {producto.stock})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {productoSeleccionado && (
              <p className="text-sm text-muted-foreground">
                Stock actual: {productoSeleccionado.stock} unidades
              </p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="tipo">Tipo de Movimiento *</Label>
            <Select 
              value={formData.tipo} 
              onValueChange={(value: 'entrada' | 'salida' | 'ajuste') => 
                setFormData(prev => ({ ...prev, tipo: value }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="entrada">Entrada - Agregar Stock</SelectItem>
                <SelectItem value="salida">Salida - Retirar Stock</SelectItem>
                <SelectItem value="ajuste">Ajuste - Corregir Stock</SelectItem>
              </SelectContent>
            </Select>
            {formData.tipo && (
              <p className="text-sm text-muted-foreground">
                {getTipoDescripcion(formData.tipo)}
              </p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="cantidad">
              {formData.tipo === 'ajuste' ? 'Nuevo Stock Total *' : 'Cantidad *'}
            </Label>
            <Input
              id="cantidad"
              type="number"
              min="1"
              value={formData.cantidad}
              onChange={(e) => setFormData(prev => ({ ...prev, cantidad: e.target.value }))}
              placeholder={formData.tipo === 'ajuste' ? 'Nuevo stock total' : 'Cantidad a mover'}
            />
            {formData.tipo === 'ajuste' && formData.cantidad && productoSeleccionado && (
              <p className="text-sm text-muted-foreground">
                Cambio: {parseInt(formData.cantidad) - productoSeleccionado.stock > 0 ? '+' : ''}
                {parseInt(formData.cantidad) - productoSeleccionado.stock} unidades
              </p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="motivo">Motivo *</Label>
            <Textarea
              id="motivo"
              value={formData.motivo}
              onChange={(e) => setFormData(prev => ({ ...prev, motivo: e.target.value }))}
              placeholder="Describe el motivo del movimiento..."
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={onCerrar}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Creando..." : "Crear Movimiento"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
