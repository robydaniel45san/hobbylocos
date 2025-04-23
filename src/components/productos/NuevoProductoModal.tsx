
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { Producto } from "@/types";
import { Label } from "@/components/ui/label";
import { Save } from "lucide-react";

interface NuevoProductoModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onProductoCreado: (producto: Producto) => void;
}

export const NuevoProductoModal: React.FC<NuevoProductoModalProps> = ({
  open,
  onOpenChange,
  onProductoCreado,
}) => {
  const [nombre, setNombre] = useState("");
  const [categoria, setCategoria] = useState("");
  const [stock, setStock] = useState(0);
  const [precio_minorista, setPrecioMinorista] = useState(0);
  const [precio_mayorista, setPrecioMayorista] = useState(0);
  const [descripcion, setDescripcion] = useState("");
  const [loading, setLoading] = useState(false);
  const [errores, setErrores] = useState<{ [key: string]: string }>({});

  const validar = () => {
    const errs: { [key: string]: string } = {};
    if (!nombre.trim()) errs.nombre = "El nombre es obligatorio.";
    if (!categoria.trim()) errs.categoria = "La categoría es obligatoria.";
    if (stock < 0) errs.stock = "El stock no puede ser negativo.";
    if (precio_minorista < 0) errs.precio_minorista = "El precio debe ser mayor o igual a cero.";
    if (precio_mayorista < 0) errs.precio_mayorista = "El precio debe ser mayor o igual a cero.";
    return errs;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const v = validar();
    setErrores(v);
    if (Object.keys(v).length > 0) return;
    setLoading(true);
    try {
      const { supabase } = await import("@/integrations/supabase/client");
      const { data, error } = await supabase
        .from("productos")
        .insert([
          {
            nombre,
            categoria,
            stock,
            precio_minorista,
            precio_mayorista,
            descripcion,
            activo: true,
          },
        ])
        .select()
        .single();

      if (error) {
        toast({
          title: "Error",
          description: "No se pudo crear el producto: " + error.message,
          variant: "destructive",
        });
      } else if (data) {
        toast({
          title: "Producto agregado",
          description: `Se agregó "${data.nombre}" correctamente.`,
        });
        onProductoCreado(data);
        onOpenChange(false);
        setNombre("");
        setCategoria("");
        setStock(0);
        setPrecioMinorista(0);
        setPrecioMayorista(0);
        setDescripcion("");
        setErrores({});
      }
    } catch (err: any) {
      toast({
        title: "Error inesperado",
        description: err?.message || "Ocurrió un error desconocido.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Agregar Nuevo Producto</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Nombre */}
          <div>
            <Label htmlFor="nombre">Nombre del producto <span className="text-destructive">*</span></Label>
            <Input
              id="nombre"
              required
              placeholder="Ej: Katana Demon Slayer"
              value={nombre}
              onChange={e => setNombre(e.target.value)}
              className={errores.nombre ? "border-destructive" : ""}
            />
            {errores.nombre && <p className="text-destructive text-xs mt-1">{errores.nombre}</p>}
          </div>
          {/* Categoría */}
          <div>
            <Label htmlFor="categoria">Categoría <span className="text-destructive">*</span></Label>
            <Input
              id="categoria"
              required
              placeholder="Ej: Figuras, Katanas, Mochilas..."
              value={categoria}
              onChange={e => setCategoria(e.target.value)}
              className={errores.categoria ? "border-destructive" : ""}
            />
            {errores.categoria && <p className="text-destructive text-xs mt-1">{errores.categoria}</p>}
            <p className="text-xs text-muted-foreground mt-1">Describe el tipo de producto para facilitar la búsqueda y organización.</p>
          </div>
          {/* Stock */}
          <div>
            <Label htmlFor="stock">Stock inicial <span className="text-destructive">*</span></Label>
            <Input
              type="number"
              id="stock"
              placeholder="Cantidad en inventario"
              value={stock}
              onChange={e => setStock(Number(e.target.value))}
              min={0}
              required
              className={errores.stock ? "border-destructive" : ""}
            />
            {errores.stock && <p className="text-destructive text-xs mt-1">{errores.stock}</p>}
            <p className="text-xs text-muted-foreground mt-1">Cantidad disponible del producto actualmente.</p>
          </div>
          {/* Precio minorista */}
          <div>
            <Label htmlFor="precio_minorista">Precio minorista (Bs) <span className="text-destructive">*</span></Label>
            <Input
              type="number"
              id="precio_minorista"
              placeholder="Precio de venta al por menor"
              value={precio_minorista}
              onChange={e => setPrecioMinorista(Number(e.target.value))}
              min={0}
              step={0.01}
              required
              className={errores.precio_minorista ? "border-destructive" : ""}
            />
            {errores.precio_minorista && <p className="text-destructive text-xs mt-1">{errores.precio_minorista}</p>}
            <p className="text-xs text-muted-foreground mt-1">Precio para clientes minoristas.</p>
          </div>
          {/* Precio mayorista */}
          <div>
            <Label htmlFor="precio_mayorista">Precio mayorista (Bs) <span className="text-destructive">*</span></Label>
            <Input
              type="number"
              id="precio_mayorista"
              placeholder="Precio de venta al por mayor"
              value={precio_mayorista}
              onChange={e => setPrecioMayorista(Number(e.target.value))}
              min={0}
              step={0.01}
              required
              className={errores.precio_mayorista ? "border-destructive" : ""}
            />
            {errores.precio_mayorista && <p className="text-destructive text-xs mt-1">{errores.precio_mayorista}</p>}
            <p className="text-xs text-muted-foreground mt-1">Precio especial para compras en cantidad.</p>
          </div>
          {/* Descripción */}
          <div>
            <Label htmlFor="descripcion">Descripción</Label>
            <Textarea
              id="descripcion"
              placeholder="Agrega detalles como materiales, tamaño, licencias o cualquier información relevante..."
              value={descripcion}
              onChange={e => setDescripcion(e.target.value)}
              rows={2}
            />
            <p className="text-xs text-muted-foreground mt-1">
              Información adicional que ayude a diferenciar este producto para el cliente o el equipo de ventas.
            </p>
          </div>
          <DialogFooter>
            <Button type="submit" className="flex gap-1 items-center" disabled={loading}>
              <Save className="h-4 w-4" />
              {loading ? "Guardando..." : "Guardar producto"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
