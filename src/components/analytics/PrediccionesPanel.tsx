
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TrendingUp, TrendingDown, Calendar, Target, AlertTriangle } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

interface Prediccion {
  tipo: 'ventas' | 'stock' | 'demanda';
  titulo: string;
  valor_actual: number;
  valor_predicho: number;
  confianza: number;
  tendencia: 'positiva' | 'negativa' | 'estable';
  periodo: string;
}

interface TendenciaProducto {
  nombre: string;
  ventas_actuales: number;
  prediccion_30_dias: number;
  tendencia: number;
}

export function PrediccionesPanel() {
  const [predicciones, setPredicciones] = useState<Prediccion[]>([]);
  const [tendenciasProductos, setTendenciasProductos] = useState<TendenciaProducto[]>([]);
  const [loading, setLoading] = useState(false);

  const generarPredicciones = () => {
    setLoading(true);
    
    // Simulación de predicciones (en producción vendría de un modelo de ML)
    setTimeout(() => {
      const nuevasPredicciones: Prediccion[] = [
        {
          tipo: 'ventas',
          titulo: 'Ventas próximos 30 días',
          valor_actual: 15420,
          valor_predicho: 18650,
          confianza: 85,
          tendencia: 'positiva',
          periodo: '30 días'
        },
        {
          tipo: 'stock',
          titulo: 'Productos agotados estimados',
          valor_actual: 3,
          valor_predicho: 7,
          confianza: 92,
          tendencia: 'negativa',
          periodo: '15 días'
        },
        {
          tipo: 'demanda',
          titulo: 'Pico de demanda navideña',
          valor_actual: 100,
          valor_predicho: 245,
          confianza: 78,
          tendencia: 'positiva',
          periodo: '60 días'
        }
      ];

      const nuevasTendencias: TendenciaProducto[] = [
        {
          nombre: 'Figura Naruto Sage Mode',
          ventas_actuales: 25,
          prediccion_30_dias: 40,
          tendencia: 60
        },
        {
          nombre: 'Póster Attack on Titan',
          ventas_actuales: 18,
          prediccion_30_dias: 12,
          tendencia: -33
        },
        {
          nombre: 'Camiseta One Piece',
          ventas_actuales: 32,
          prediccion_30_dias: 48,
          tendencia: 50
        }
      ];

      setPredicciones(nuevasPredicciones);
      setTendenciasProductos(nuevasTendencias);
      setLoading(false);
    }, 1500);
  };

  useEffect(() => {
    generarPredicciones();
  }, []);

  const getTendenciaIcon = (tendencia: string) => {
    switch (tendencia) {
      case 'positiva':
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'negativa':
        return <TrendingDown className="h-4 w-4 text-red-500" />;
      default:
        return <Target className="h-4 w-4 text-yellow-500" />;
    }
  };

  const getTendenciaColor = (tendencia: string) => {
    switch (tendencia) {
      case 'positiva':
        return 'bg-green-500/15 text-green-700 border-green-200';
      case 'negativa':
        return 'bg-red-500/15 text-red-700 border-red-200';
      default:
        return 'bg-yellow-500/15 text-yellow-700 border-yellow-200';
    }
  };

  if (loading) {
    return (
      <Card className="glass-card border-white/10">
        <CardContent className="p-8">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
            <span className="ml-3 text-muted-foreground">Generando predicciones...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="glass-card border-white/10">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Predicciones de Negocio
            </CardTitle>
            <Button 
              variant="outline" 
              size="sm"
              onClick={generarPredicciones}
              className="glass-effect"
            >
              Actualizar
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            {predicciones.map((prediccion, index) => (
              <div key={index} className="p-4 rounded-lg glass-effect border border-white/10">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-foreground">{prediccion.titulo}</h4>
                  {getTendenciaIcon(prediccion.tendencia)}
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Actual:</span>
                    <span className="font-medium">{prediccion.valor_actual.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Predicho:</span>
                    <span className="font-medium">{prediccion.valor_predicho.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center mt-3">
                    <Badge 
                      variant="outline" 
                      className={getTendenciaColor(prediccion.tendencia)}
                    >
                      {prediccion.confianza}% confianza
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {prediccion.periodo}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="glass-card border-white/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Tendencias de Productos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {tendenciasProductos.map((producto, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg glass-effect border border-white/10">
                <div>
                  <h4 className="font-medium text-foreground">{producto.nombre}</h4>
                  <p className="text-sm text-muted-foreground">
                    Ventas actuales: {producto.ventas_actuales} → Predicción: {producto.prediccion_30_dias}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {producto.tendencia > 0 ? (
                    <TrendingUp className="h-4 w-4 text-green-500" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-red-500" />
                  )}
                  <span className={`font-medium ${producto.tendencia > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {producto.tendencia > 0 ? '+' : ''}{producto.tendencia}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
