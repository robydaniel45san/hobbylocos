
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { useCategorias } from '@/hooks/useCategorias';

interface NuevaCategoriaModalProps {
  abierto: boolean;
  onCerrar: () => void;
}

export const NuevaCategoriaModal: React.FC<NuevaCategoriaModalProps> = ({
  abierto,
  onCerrar
}) => {
  const { crearCategoria } = useCategorias();
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    activo: true
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nombre.trim()) {
      return;
    }

    const exito = await crearCategoria(formData);
    
    if (exito) {
      setFormData({ nombre: '', descripcion: '', activo: true });
      onCerrar();
    }
  };

  return (
    <Dialog open={abierto} onOpenChange={onCerrar}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nueva Categoría</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="nombre">Nombre *</Label>
            <Input
              id="nombre"
              value={formData.nombre}
              onChange={(e) => setFormData(prev => ({ ...prev, nombre: e.target.value }))}
              placeholder="Ej: Figuras, Katanas, Mochilas..."
              required
            />
          </div>

          <div>
            <Label htmlFor="descripcion">Descripción</Label>
            <Textarea
              id="descripcion"
              value={formData.descripcion}
              onChange={(e) => setFormData(prev => ({ ...prev, descripcion: e.target.value }))}
              placeholder="Descripción de la categoría..."
              rows={3}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="activo"
              checked={formData.activo}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, activo: checked }))}
            />
            <Label htmlFor="activo">Categoría activa</Label>
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onCerrar} className="flex-1">
              Cancelar
            </Button>
            <Button type="submit" className="flex-1">
              Crear Categoría
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
