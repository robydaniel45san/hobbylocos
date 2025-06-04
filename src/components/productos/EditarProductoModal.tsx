
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Save, X } from "lucide-react";
import { Producto } from "@/types";

interface EditarProductoModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  producto: Producto | null;
  onProductoActualizado: (id: string, datos: Partial<Producto>) => Promise<boolean>;
}

export const EditarProductoModal: React.FC<EditarProductoModalProps> = ({
  open,
  onOpenChange,
  producto,
  onProductoActualizado,
}) => {
  const [nombre, setNombre] = useState("");
  const [categoria, setCategoria] = useState("");
  const [stock, setStock] = useState(0);
  const [precio_minorista, setPrecioMinorista] = useState(0);
  const [precio_mayorista, setPrecioMayorista] = useState(0);
  const [descripcion, setDescripcion] = useState("");
  const [activo, setActivo] = useState(true);
  const [loading, setLoading] = useState(false);

  // Cargar datos del producto cuando se abre el modal
  useEffect(() => {
    if (producto && open) {
      setNombre(producto.nombre);
      setCategoria(producto.categoria || "");
      setStock(producto.stock);
      setPrecioMinorista(producto.precio_minorista);
      setPrecioMayorista(producto.precio_mayorista);
      setDescripcion(producto.descripcion || "");
      setActivo(producto.activo);
    }
  }, [producto, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!producto) return;

    setLoading(true);
    
    const datosActualizados = {
      nombre,
      categoria: categoria || null,
      stock,
      precio_minorista,
      precio_mayorista,
      descripcion: descripcion || null,
      activo,
    };

    const exito = await onProductoActualizado(producto.id, datosActualizados);
    
    if (exito) {
      onOpenChange(false);
    }
    
    setLoading(false);
  };

  const handleClose = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Editar Producto</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="nombre">Nombre del producto</Label>
              <Input
                id="nombre"
                value={nombre}
                onChange={e => setNombre(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="categoria">Categoría</Label>
              <Input
                id="categoria"
                value={categoria}
                onChange={e => setCategoria(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="stock">Stock</Label>
              <Input
                type="number"
                id="stock"
                value={stock}
                onChange={e => setStock(Number(e.target.value))}
                min={0}
                required
              />
            </div>
            <div>
              <Label htmlFor="precio_minorista">Precio Minorista (Bs)</Label>
              <Input
                type="number"
                id="precio_minorista"
                value={precio_minorista}
                onChange={e => setPrecioMinorista(Number(e.target.value))}
                min={0}
                step={0.01}
                required
              />
            </div>
            <div>
              <Label htmlFor="precio_mayorista">Precio Mayorista (Bs)</Label>
              <Input
                type="number"
                id="precio_mayorista"
                value={precio_mayorista}
                onChange={e => setPrecioMayorista(Number(e.target.value))}
                min={0}
                step={0.01}
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="descripcion">Descripción</Label>
            <Textarea
              id="descripcion"
              value={descripcion}
              onChange={e => setDescripcion(e.target.value)}
              rows={3}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="activo"
              checked={activo}
              onCheckedChange={setActivo}
            />
            <Label htmlFor="activo">Producto activo</Label>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              <X className="h-4 w-4 mr-2" />
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              <Save className="h-4 w-4 mr-2" />
              {loading ? "Guardando..." : "Guardar cambios"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
