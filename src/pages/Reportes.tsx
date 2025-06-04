
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useReportes, ReporteVentas, ReporteProductos } from '@/hooks/useReportes';
import { ProductoMasVendido } from '@/types';
import { Download, Calendar, TrendingUp, Package, DollarSign } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const Reportes = () => {
  const { 
    loading, 
    generarReporteVentas, 
    generarReporteProductos, 
    obtenerProductosMasVendidos,
    exportarCSV
  } = useReportes();

  const [fechaInicio, setFechaInicio] = useState(
    new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [fechaFin, setFechaFin] = useState(
    new Date().toISOString().split('T')[0]
  );
  
  const [reporteVentas, setReporteVentas] = useState<ReporteVentas | null>(null);
  const [reporteProductos, setReporteProductos] = useState<ReporteProductos | null>(null);
  const [productosMasVendidos, setProductosMasVendidos] = useState<ProductoMasVendido[]>([]);

  const cargarReportes = async () => {
    const [ventas, productos, topProductos] = await Promise.all([
      generarReporteVentas(fechaInicio, fechaFin),
      generarReporteProductos(),
      obtenerProductosMasVendidos(10)
    ]);

    setReporteVentas(ventas);
    setReporteProductos(productos);
    setProductosMasVendidos(topProductos);
  };

  useEffect(() => {
    cargarReportes();
  }, [fechaInicio, fechaFin]);

  const formatearMoneda = (valor: number) => {
    return new Intl.NumberFormat('es-BO', {
      style: 'currency',
      currency: 'BOB'
    }).format(valor);
  };

  const exportarReporteVentas = () => {
    if (!reporteVentas) return;
    
    const datos = [
      {
        'Total Ventas': reporteVentas.totalVentas,
        'Total Ingresos': reporteVentas.totalIngresos,
        'Ventas Realizadas': reporteVentas.ventasRealizadas,
        'Ventas Pendientes': reporteVentas.ventasPendientes,
        'Promedio Diario': reporteVentas.promedioVentaDiaria.toFixed(2),
        'Crecimiento Mensual %': reporteVentas.crecimientoMensual.toFixed(2)
      }
    ];
    
    exportarCSV(datos, 'reporte_ventas');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Reportes y Análisis</h1>
        <div className="flex gap-2">
          <Button 
            onClick={cargarReportes} 
            disabled={loading}
            variant="outline"
          >
            {loading ? "Cargando..." : "Actualizar"}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="ventas" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="ventas">Ventas</TabsTrigger>
          <TabsTrigger value="productos">Productos</TabsTrigger>
          <TabsTrigger value="top-productos">Top Productos</TabsTrigger>
        </TabsList>

        <TabsContent value="ventas" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Filtros de Fecha
              </CardTitle>
            </CardHeader>
            <CardContent className="flex gap-4">
              <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="fecha-inicio">Fecha Inicio</Label>
                <Input
                  id="fecha-inicio"
                  type="date"
                  value={fechaInicio}
                  onChange={(e) => setFechaInicio(e.target.value)}
                />
              </div>
              <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="fecha-fin">Fecha Fin</Label>
                <Input
                  id="fecha-fin"
                  type="date"
                  value={fechaFin}
                  onChange={(e) => setFechaFin(e.target.value)}
                />
              </div>
              <Button onClick={exportarReporteVentas} variant="outline" className="mt-6">
                <Download className="h-4 w-4 mr-2" />
                Exportar CSV
              </Button>
            </CardContent>
          </Card>

          {reporteVentas && (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Ventas</CardTitle>
                  <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{reporteVentas.totalVentas}</div>
                  <p className="text-xs text-muted-foreground">
                    Promedio: {reporteVentas.promedioVentaDiaria.toFixed(1)}/día
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Ingresos</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatearMoneda(reporteVentas.totalIngresos)}</div>
                  <div className="flex items-center gap-2 mt-2">
                    <TrendingUp className={`h-3 w-3 ${reporteVentas.crecimientoMensual >= 0 ? 'text-green-500' : 'text-red-500'}`} />
                    <span className={`text-xs ${reporteVentas.crecimientoMensual >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {reporteVentas.crecimientoMensual >= 0 ? '+' : ''}{reporteVentas.crecimientoMensual.toFixed(1)}%
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Estado de Ventas</CardTitle>
                  <Badge variant="outline">{reporteVentas.ventasRealizadas}/{reporteVentas.totalVentas}</Badge>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Realizadas:</span>
                      <span className="font-medium text-green-600">{reporteVentas.ventasRealizadas}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Pendientes:</span>
                      <span className="font-medium text-yellow-600">{reporteVentas.ventasPendientes}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        <TabsContent value="productos" className="space-y-4">
          {reporteProductos && (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Productos</CardTitle>
                  <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{reporteProductos.totalProductos}</div>
                  <p className="text-xs text-muted-foreground">
                    Activos: {reporteProductos.productosActivos}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Stock Total</CardTitle>
                  <Badge variant={reporteProductos.productosBajoStock > 0 ? "destructive" : "default"}>
                    {reporteProductos.productosBajoStock} bajo stock
                  </Badge>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{reporteProductos.stockTotal}</div>
                  <p className="text-xs text-muted-foreground">
                    unidades en inventario
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Valor Inventario</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatearMoneda(reporteProductos.valorInventario)}</div>
                  <p className="text-xs text-muted-foreground">
                    a precio minorista
                  </p>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        <TabsContent value="top-productos" className="space-y-4">
          <Card>
            <CardHeader className="flex items-center justify-between">
              <CardTitle>Productos Más Vendidos</CardTitle>
              <Button 
                onClick={() => exportarCSV(productosMasVendidos, 'productos_mas_vendidos')}
                variant="outline"
                size="sm"
              >
                <Download className="h-4 w-4 mr-2" />
                Exportar
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {productosMasVendidos.length === 0 ? (
                  <p className="text-muted-foreground text-center py-4">
                    No hay datos de ventas disponibles
                  </p>
                ) : (
                  productosMasVendidos.map((producto, index) => (
                    <div key={producto.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <Badge variant={index < 3 ? "default" : "secondary"}>
                          #{index + 1}
                        </Badge>
                        <div>
                          <p className="font-medium">{producto.nombre}</p>
                          <p className="text-sm text-muted-foreground">
                            {producto.cantidad} unidades vendidas
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">{formatearMoneda(producto.total)}</p>
                        <p className="text-xs text-muted-foreground">total ventas</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Reportes;
