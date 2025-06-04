
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Package, AlertTriangle, TrendingDown, RefreshCw, Settings, History } from 'lucide-react';
import { useProductos } from '@/hooks/useProductos';
import { toast } from '@/hooks/use-toast';

interface MovimientoStock {
  id: string;
  producto_id: string;
  tipo: 'entrada' | 'salida' | 'ajuste';
  cantidad: number;
  razon: string;
  fecha: Date;
  usuario?: string;
}

interface AlertaStock {
  producto_id: string;
  nombre: string;
  stock_actual: number;
  stock_minimo: number;
  dias_agotamiento: number;
  prioridad: 'alta' | 'media' | 'baja';
}

export function ControlInventario() {
  const { productos, actualizarProducto } = useProductos();
  const [alertasStock, setAlertasStock] = useState<AlertaStock[]>([]);
  const [movimientos, setMovimientos] = useState<MovimientoStock[]>([]);
  const [stockMinimo, setStockMinimo] = useState<{ [key: string]: number }>({});

  useEffect(() => {
    generarAlertasStock();
    cargarMovimientos();
  }, [productos]);

  const generarAlertasStock = () => {
    const alertas: AlertaStock[] = productos
      .filter(p => p.activo && p.stock <= 10)
      .map(producto => {
        const diasAgotamiento = Math.max(0, Math.floor(producto.stock / 2)); // Simulación
        let prioridad: 'alta' | 'media' | 'baja' = 'baja';
        
        if (producto.stock <= 2) prioridad = 'alta';
        else if (producto.stock <= 5) prioridad = 'media';

        return {
          producto_id: producto.id,
          nombre: producto.nombre,
          stock_actual: producto.stock,
          stock_minimo: 5, // Por defecto
          dias_agotamiento: diasAgotamiento,
          prioridad
        };
      })
      .sort((a, b) => {
        const prioridadOrder = { alta: 3, media: 2, baja: 1 };
        return prioridadOrder[b.prioridad] - prioridadOrder[a.prioridad];
      });

    setAlertasStock(alertas);
  };

  const cargarMovimientos = () => {
    // Simulación de movimientos recientes
    const movimientosSimulados: MovimientoStock[] = [
      {
        id: '1',
        producto_id: productos[0]?.id || '',
        tipo: 'entrada',
        cantidad: 50,
        razon: 'Compra a proveedor',
        fecha: new Date(Date.now() - 1000 * 60 * 60 * 24),
        usuario: 'Admin'
      },
      {
        id: '2',
        producto_id: productos[1]?.id || '',
        tipo: 'salida',
        cantidad: 3,
        razon: 'Venta cliente',
        fecha: new Date(Date.now() - 1000 * 60 * 60 * 2),
        usuario: 'Sistema'
      }
    ];
    setMovimientos(movimientosSimulados);
  };

  const aplicarReposicionAutomatica = async (productId: string, cantidad: number) => {
    try {
      const producto = productos.find(p => p.id === productId);
      if (producto) {
        await actualizarProducto(productId, {
          stock: producto.stock + cantidad
        });

        // Registrar movimiento
        const nuevoMovimiento: MovimientoStock = {
          id: Date.now().toString(),
          producto_id: productId,
          tipo: 'entrada',
          cantidad,
          razon: 'Reposición automática',
          fecha: new Date(),
          usuario: 'Sistema'
        };
        setMovimientos(prev => [nuevoMovimiento, ...prev]);

        toast({
          title: "Stock repuesto",
          description: `Se agregaron ${cantidad} unidades automáticamente`,
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo reponer el stock automáticamente",
        variant: "destructive",
      });
    }
  };

  const configurarStockMinimo = async (productId: string, minimo: number) => {
    setStockMinimo(prev => ({ ...prev, [productId]: minimo }));
    toast({
      title: "Configuración actualizada",
      description: "Stock mínimo configurado correctamente",
    });
  };

  const getPrioridadColor = (prioridad: string) => {
    switch (prioridad) {
      case 'alta':
        return 'bg-red-500/15 text-red-700 border-red-200';
      case 'media':
        return 'bg-yellow-500/15 text-yellow-700 border-yellow-200';
      default:
        return 'bg-blue-500/15 text-blue-700 border-blue-200';
    }
  };

  const getTipoMovimientoColor = (tipo: string) => {
    switch (tipo) {
      case 'entrada':
        return 'text-green-600';
      case 'salida':
        return 'text-red-600';
      default:
        return 'text-blue-600';
    }
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="alertas" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="alertas">Alertas de Stock</TabsTrigger>
          <TabsTrigger value="movimientos">Movimientos</TabsTrigger>
          <TabsTrigger value="configuracion">Configuración</TabsTrigger>
        </TabsList>

        <TabsContent value="alertas" className="space-y-4">
          <Card className="glass-card border-white/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-orange-500" />
                Alertas de Stock Bajo
                <Badge variant="destructive" className="ml-2">
                  {alertasStock.length}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {alertasStock.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Package className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p>No hay alertas de stock</p>
                  </div>
                ) : (
                  alertasStock.map((alerta) => (
                    <div key={alerta.producto_id} className="p-4 rounded-lg glass-effect border border-white/10">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-medium text-foreground">{alerta.nombre}</h4>
                            <Badge 
                              variant="outline" 
                              className={getPrioridadColor(alerta.prioridad)}
                            >
                              {alerta.prioridad.toUpperCase()}
                            </Badge>
                          </div>
                          <div className="grid grid-cols-3 gap-4 text-sm">
                            <div>
                              <span className="text-muted-foreground">Stock actual:</span>
                              <p className="font-medium text-red-600">{alerta.stock_actual} unidades</p>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Stock mínimo:</span>
                              <p className="font-medium">{alerta.stock_minimo} unidades</p>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Días para agotarse:</span>
                              <p className="font-medium text-orange-600">{alerta.dias_agotamiento} días</p>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col gap-2">
                          <Button
                            size="sm"
                            onClick={() => aplicarReposicionAutomatica(alerta.producto_id, 20)}
                            className="bg-green-500 hover:bg-green-600"
                          >
                            <RefreshCw className="h-4 w-4 mr-1" />
                            Reponer
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="glass-effect"
                          >
                            <Settings className="h-4 w-4 mr-1" />
                            Configurar
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="movimientos" className="space-y-4">
          <Card className="glass-card border-white/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="h-5 w-5" />
                Historial de Movimientos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {movimientos.map((movimiento) => (
                  <div key={movimiento.id} className="p-3 rounded-lg glass-effect border border-white/10">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`font-medium capitalize ${getTipoMovimientoColor(movimiento.tipo)}`}>
                            {movimiento.tipo}
                          </span>
                          <span className="text-sm text-muted-foreground">•</span>
                          <span className="font-medium">{movimiento.cantidad} unidades</span>
                        </div>
                        <p className="text-sm text-muted-foreground">{movimiento.razon}</p>
                        <p className="text-xs text-muted-foreground">
                          {movimiento.fecha.toLocaleString()} • {movimiento.usuario}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="configuracion" className="space-y-4">
          <Card className="glass-card border-white/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Configuración de Inventario
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label className="text-base font-medium">Stock Mínimo por Producto</Label>
                  <p className="text-sm text-muted-foreground mb-3">
                    Configura el stock mínimo para recibir alertas automáticas
                  </p>
                  <div className="space-y-3">
                    {productos.slice(0, 5).map((producto) => (
                      <div key={producto.id} className="flex items-center justify-between p-3 rounded-lg glass-effect border border-white/10">
                        <span className="font-medium">{producto.nombre}</span>
                        <div className="flex items-center gap-2">
                          <Input
                            type="number"
                            value={stockMinimo[producto.id] || 5}
                            onChange={(e) => setStockMinimo(prev => ({
                              ...prev,
                              [producto.id]: parseInt(e.target.value) || 0
                            }))}
                            className="w-20"
                            min="0"
                          />
                          <Button
                            size="sm"
                            onClick={() => configurarStockMinimo(producto.id, stockMinimo[producto.id] || 5)}
                            className="glass-effect"
                          >
                            Guardar
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
