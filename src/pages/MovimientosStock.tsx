
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Plus, Package, TrendingUp, TrendingDown, RotateCcw } from 'lucide-react';
import { useMovimientosStock } from '@/hooks/useMovimientosStock';
import { MovimientoStockModal } from '@/components/stock/MovimientoStockModal';

const MovimientosStock = () => {
  const {
    movimientosFiltrados,
    loading,
    filtro,
    setFiltro,
    tipoFiltro,
    setTipoFiltro,
    crearMovimiento,
  } = useMovimientosStock();

  const [modalAbierto, setModalAbierto] = useState(false);

  const getIconoTipo = (tipo: string) => {
    switch (tipo) {
      case 'entrada':
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'salida':
        return <TrendingDown className="h-4 w-4 text-red-500" />;
      case 'ajuste':
        return <RotateCcw className="h-4 w-4 text-blue-500" />;
      default:
        return <Package className="h-4 w-4" />;
    }
  };

  const getBadgeVariant = (tipo: string) => {
    switch (tipo) {
      case 'entrada':
        return 'default';
      case 'salida':
        return 'destructive';
      case 'ajuste':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  const formatearFecha = (fecha: string) => {
    return new Intl.DateTimeFormat('es-BO', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(fecha));
  };

  const estadisticas = {
    total: movimientosFiltrados.length,
    entradas: movimientosFiltrados.filter(m => m.tipo === 'entrada').length,
    salidas: movimientosFiltrados.filter(m => m.tipo === 'salida').length,
    ajustes: movimientosFiltrados.filter(m => m.tipo === 'ajuste').length,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Movimientos de Stock</h1>
        <Button onClick={() => setModalAbierto(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Movimiento
        </Button>
      </div>

      {/* Estadísticas */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Movimientos</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{estadisticas.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Entradas</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{estadisticas.entradas}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Salidas</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{estadisticas.salidas}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ajustes</CardTitle>
            <RotateCcw className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{estadisticas.ajustes}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <div className="flex gap-4">
        <Input
          placeholder="Buscar por producto, motivo o ID..."
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
          className="max-w-sm"
        />
        <Select value={tipoFiltro} onValueChange={(value: any) => setTipoFiltro(value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Tipo de movimiento" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos</SelectItem>
            <SelectItem value="entrada">Entradas</SelectItem>
            <SelectItem value="salida">Salidas</SelectItem>
            <SelectItem value="ajuste">Ajustes</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Lista de movimientos */}
      <Card>
        <CardHeader>
          <CardTitle>Historial de Movimientos</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-4">Cargando movimientos...</div>
          ) : movimientosFiltrados.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No se encontraron movimientos de stock</p>
              <p className="text-sm">Crea el primer movimiento para comenzar</p>
            </div>
          ) : (
            <div className="space-y-3">
              {movimientosFiltrados.map((movimiento) => (
                <div key={movimiento.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    {getIconoTipo(movimiento.tipo)}
                    <div>
                      <p className="font-medium">
                        {movimiento.producto?.nombre || 'Producto no encontrado'}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {movimiento.motivo}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatearFecha(movimiento.fecha)} - {movimiento.usuario}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="font-semibold">
                        {movimiento.tipo === 'ajuste' ? '' : movimiento.tipo === 'entrada' ? '+' : '-'}
                        {movimiento.cantidad}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Stock actual: {movimiento.producto?.stock || 0}
                      </p>
                    </div>
                    <Badge variant={getBadgeVariant(movimiento.tipo)}>
                      {movimiento.tipo}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <MovimientoStockModal
        abierto={modalAbierto}
        onCerrar={() => setModalAbierto(false)}
        onCrear={crearMovimiento}
      />
    </div>
  );
};

export default MovimientosStock;
