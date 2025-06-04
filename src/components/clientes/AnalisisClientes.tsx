
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, Star, TrendingUp, MapPin, ShoppingBag, Calendar } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { useClientes } from '@/hooks/useClientes';

interface ClienteVIP {
  id: string;
  nombre: string;
  total_compras: number;
  frecuencia_compras: number;
  ultima_compra: Date;
  nivel: 'oro' | 'plata' | 'bronce';
}

interface SegmentoCliente {
  nombre: string;
  cantidad: number;
  porcentaje: number;
  color: string;
}

export function AnalisisClientes() {
  const { clientes } = useClientes();
  const [clientesVIP, setClientesVIP] = useState<ClienteVIP[]>([]);
  const [segmentos, setSegmentos] = useState<SegmentoCliente[]>([]);
  const [ventasPorDepartamento, setVentasPorDepartamento] = useState<any[]>([]);

  useEffect(() => {
    generarAnalisisClientes();
  }, [clientes]);

  const generarAnalisisClientes = () => {
    // Simulación de análisis de clientes VIP
    const clientesVIPSimulados: ClienteVIP[] = clientes.slice(0, 5).map((cliente, index) => ({
      id: cliente.id,
      nombre: cliente.nombre_completo,
      total_compras: Math.random() * 5000 + 1000,
      frecuencia_compras: Math.floor(Math.random() * 20) + 5,
      ultima_compra: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
      nivel: index < 2 ? 'oro' : index < 4 ? 'plata' : 'bronce'
    }));

    // Simulación de segmentación
    const segmentosSimulados: SegmentoCliente[] = [
      { nombre: 'Nuevos', cantidad: 45, porcentaje: 35, color: '#8b5cf6' },
      { nombre: 'Regulares', cantidad: 52, porcentaje: 40, color: '#3b82f6' },
      { nombre: 'VIP', cantidad: 18, porcentaje: 15, color: '#f59e0b' },
      { nombre: 'Inactivos', cantidad: 13, porcentaje: 10, color: '#ef4444' }
    ];

    // Simulación de ventas por departamento
    const ventasDepartamento = [
      { departamento: 'La Paz', ventas: 28 },
      { departamento: 'Santa Cruz', ventas: 35 },
      { departamento: 'Cochabamba', ventas: 22 },
      { departamento: 'Tarija', ventas: 15 }
    ];

    setClientesVIP(clientesVIPSimulados);
    setSegmentos(segmentosSimulados);
    setVentasPorDepartamento(ventasDepartamento);
  };

  const getNivelColor = (nivel: string) => {
    switch (nivel) {
      case 'oro':
        return 'bg-yellow-500/15 text-yellow-700 border-yellow-200';
      case 'plata':
        return 'bg-gray-500/15 text-gray-700 border-gray-200';
      default:
        return 'bg-orange-500/15 text-orange-700 border-orange-200';
    }
  };

  const getNivelIcon = (nivel: string) => {
    return <Star className={`h-4 w-4 ${nivel === 'oro' ? 'text-yellow-500' : nivel === 'plata' ? 'text-gray-500' : 'text-orange-500'}`} />;
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="vip" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="vip">Clientes VIP</TabsTrigger>
          <TabsTrigger value="segmentos">Segmentación</TabsTrigger>
          <TabsTrigger value="geografia">Análisis Geográfico</TabsTrigger>
        </TabsList>

        <TabsContent value="vip" className="space-y-4">
          <Card className="glass-card border-white/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5 text-yellow-500" />
                Clientes VIP
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {clientesVIP.map((cliente) => (
                  <div key={cliente.id} className="p-4 rounded-lg glass-effect border border-white/10">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-medium text-foreground">{cliente.nombre}</h4>
                          <Badge 
                            variant="outline" 
                            className={getNivelColor(cliente.nivel)}
                          >
                            {getNivelIcon(cliente.nivel)}
                            {cliente.nivel.toUpperCase()}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">Total compras:</span>
                            <p className="font-medium text-green-600">Bs {cliente.total_compras.toFixed(2)}</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Frecuencia:</span>
                            <p className="font-medium">{cliente.frecuencia_compras} compras</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Última compra:</span>
                            <p className="font-medium">{cliente.ultima_compra.toLocaleDateString()}</p>
                          </div>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" className="glass-effect">
                        <ShoppingBag className="h-4 w-4 mr-1" />
                        Ver historial
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="segmentos" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="glass-card border-white/10">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Distribución de Clientes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={segmentos}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={120}
                        dataKey="cantidad"
                        label={({ porcentaje }) => `${porcentaje}%`}
                      >
                        {segmentos.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card border-white/10">
              <CardHeader>
                <CardTitle>Detalles por Segmento</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {segmentos.map((segmento) => (
                    <div key={segmento.nombre} className="flex items-center justify-between p-3 rounded-lg glass-effect border border-white/10">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: segmento.color }}
                        />
                        <span className="font-medium">{segmento.nombre}</span>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{segmento.cantidad} clientes</p>
                        <p className="text-sm text-muted-foreground">{segmento.porcentaje}%</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="geografia" className="space-y-4">
          <Card className="glass-card border-white/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Ventas por Departamento
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] mb-6">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={ventasPorDepartamento}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis 
                      dataKey="departamento" 
                      stroke="rgba(255,255,255,0.7)"
                      fontSize={12}
                    />
                    <YAxis 
                      stroke="rgba(255,255,255,0.7)"
                      fontSize={12}
                    />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'rgba(255,255,255,0.1)',
                        border: '1px solid rgba(255,255,255,0.2)',
                        borderRadius: '8px',
                        backdropFilter: 'blur(10px)'
                      }}
                    />
                    <Bar dataKey="ventas" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                {ventasPorDepartamento.map((dept, index) => (
                  <div key={dept.departamento} className="p-3 rounded-lg glass-effect border border-white/10">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{dept.departamento}</span>
                      <Badge variant="outline" className="glass-effect">
                        {dept.ventas} ventas
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
