
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { NotificacionesPanel } from '@/components/notificaciones/NotificacionesPanel';
import { PrediccionesPanel } from '@/components/analytics/PrediccionesPanel';
import { ControlInventario } from '@/components/inventario/ControlInventario';
import { AnalisisClientes } from '@/components/clientes/AnalisisClientes';
import { TrendingUp, Bell, Package, Users } from 'lucide-react';

const AnalyticsPage = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Analytics y Control</h1>
        <p className="text-muted-foreground">
          Análisis avanzado, predicciones y control inteligente del negocio
        </p>
      </div>

      <Tabs defaultValue="predicciones" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="predicciones" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Predicciones
          </TabsTrigger>
          <TabsTrigger value="notificaciones" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Notificaciones
          </TabsTrigger>
          <TabsTrigger value="inventario" className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            Inventario
          </TabsTrigger>
          <TabsTrigger value="clientes" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Clientes
          </TabsTrigger>
        </TabsList>

        <TabsContent value="predicciones">
          <PrediccionesPanel />
        </TabsContent>

        <TabsContent value="notificaciones">
          <NotificacionesPanel />
        </TabsContent>

        <TabsContent value="inventario">
          <ControlInventario />
        </TabsContent>

        <TabsContent value="clientes">
          <AnalisisClientes />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AnalyticsPage;
