import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BarChart3, CheckCircle2, Package, ShoppingCart, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { productosDemoData } from '@/data/productosData';

interface Metric {
  label: string;
  value: number;
  description: string;
}

const Index = () => {
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState<Metric[]>([]);
  const [status, setStatus] = useState<'ok' | 'partial' | 'error'>('partial');

  const fallbackMetrics = useMemo<Metric[]>(() => [
    {
      label: 'Productos demo',
      value: productosDemoData.length,
      description: 'Registros precargados para validar la UI'
    },
    {
      label: 'Ventas registradas',
      value: 0,
      description: 'Conecta tu Supabase para ver ventas reales'
    },
    {
      label: 'Clientes',
      value: 0,
      description: 'Importa o crea clientes para los pedidos'
    },
  ], []);

  useEffect(() => {
    const loadMetrics = async () => {
      try {
        const { supabase } = await import('@/integrations/supabase/client');

        const [ventasRes, productosRes, clientesRes] = await Promise.all([
          supabase.from('ventas').select('id', { count: 'exact', head: true }),
          supabase.from('productos').select('id', { count: 'exact', head: true }),
          supabase.from('clientes').select('id', { count: 'exact', head: true })
        ]);

        const hasErrors = ventasRes.error || productosRes.error || clientesRes.error;
        const derivedMetrics: Metric[] = [
          {
            label: 'Ventas registradas',
            value: ventasRes.count ?? 0,
            description: hasErrors ? 'No se pudo contar ventas' : 'Ventas cargadas desde Supabase'
          },
          {
            label: 'Productos activos',
            value: productosRes.count ?? 0,
            description: hasErrors ? 'Mostrando 0 si falla la consulta' : 'Inventario listo para vender'
          },
          {
            label: 'Clientes',
            value: clientesRes.count ?? 0,
            description: hasErrors ? 'No se pudo contar clientes' : 'Contactos disponibles para pedidos'
          },
        ];

        setStatus(hasErrors ? 'partial' : 'ok');
        setMetrics(derivedMetrics);
      } catch (error) {
        console.error('Error al cargar métricas iniciales', error);
        setStatus('error');
        setMetrics(fallbackMetrics);
      } finally {
        setLoading(false);
      }
    };

    loadMetrics();
  }, [fallbackMetrics]);

  const statusCopy: Record<typeof status, { title: string; description: string; tone: string; icon: JSX.Element }> = {
    ok: {
      title: 'Backend conectado',
      description: 'Leyendo datos en vivo desde Supabase.',
      tone: 'text-green-600',
      icon: <CheckCircle2 className="h-5 w-5 text-green-600" />,
    },
    partial: {
      title: 'Sincronización parcial',
      description: 'Algunas consultas fallaron o no hay datos todavía. Revisa tu configuración.',
      tone: 'text-amber-600',
      icon: <BarChart3 className="h-5 w-5 text-amber-600" />,
    },
    error: {
      title: 'Sin conexión a datos',
      description: 'Usando datos demo. Añade tus claves de Supabase o revisa la red.',
      tone: 'text-red-600',
      icon: <BarChart3 className="h-5 w-5 text-red-600" />,
    },
  };

  return (
    <div className="space-y-8">
      <section className="glass-card rounded-2xl p-8 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 shadow-sm">
        <div className="space-y-4 max-w-2xl">
          <Badge variant="outline" className="w-fit bg-white/60 text-app-blue border-app-blue/30">Hobby Store • Mayorista & Minorista</Badge>
          <h1 className="text-4xl font-bold leading-tight text-gradient">
            Control completo de inventario, ventas y envíos en un solo panel.
          </h1>
          <p className="text-lg text-muted-foreground">
            Conecta Supabase, carga tus productos y gestiona pedidos en tiempo real. Esta pantalla inicial verifica que todo esté listo antes de operar.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button size="lg" asChild className="shadow-lg">
              <Link to="/dashboard">
                Ir al dashboard
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/productos">Ver inventario</Link>
            </Button>
            <Button size="lg" variant="ghost" asChild>
              <Link to="/ventas">Registrar venta</Link>
            </Button>
          </div>
        </div>
        <Card className="min-w-[280px] lg:w-96 border-primary/10 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {statusCopy[status].icon}
              <span className={statusCopy[status].tone}>{statusCopy[status].title}</span>
            </CardTitle>
            <CardDescription>{statusCopy[status].description}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between text-sm">
              <span>Conexión Supabase</span>
              <span className="font-semibold">{status === 'ok' ? 'Activa' : 'Por revisar'}</span>
            </div>
            <Progress value={status === 'ok' ? 100 : status === 'partial' ? 50 : 20} />
            <p className="text-xs text-muted-foreground">
              Si ves métricas en cero, verifica tus tablas o la clave pública en <code>src/integrations/supabase/client.ts</code>.
            </p>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {(loading ? fallbackMetrics : metrics).map((metric) => (
          <Card key={metric.label} className="glass-card border-white/40 hover-lift">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{metric.label}</CardTitle>
              {metric.label.includes('Productos') && <Package className="h-4 w-4 text-app-blue" />}
              {metric.label.includes('Ventas') && <ShoppingCart className="h-4 w-4 text-status-realizado" />}
              {metric.label.includes('Clientes') && <Users className="h-4 w-4 text-app-gray" />}
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{metric.value}</div>
              <p className="text-xs text-muted-foreground mt-1">{metric.description}</p>
            </CardContent>
          </Card>
        ))}
      </section>

      <section className="glass-card rounded-2xl p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold">Rutas clave del proyecto</h2>
            <p className="text-sm text-muted-foreground">Accesos directos para validar cada módulo funcional.</p>
          </div>
        </div>
        <Separator />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[
            {
              title: 'Dashboard',
              description: 'Resumen de ventas, estados y top productos.',
              to: '/dashboard',
            },
            {
              title: 'Productos',
              description: 'Gestión de inventario, stock y precios.',
              to: '/productos',
            },
            {
              title: 'Ventas',
              description: 'Pedidos, estados y detalle de items.',
              to: '/ventas',
            },
            {
              title: 'Clientes',
              description: 'Directorio de compradores mayoristas y minoristas.',
              to: '/clientes',
            },
            {
              title: 'Envíos',
              description: 'Trazabilidad y costos logísticos.',
              to: '/envios',
            },
            {
              title: 'Analytics',
              description: 'KPIs personalizados y proyección de ventas.',
              to: '/analytics',
            },
          ].map((link) => (
            <Link key={link.to} to={link.to} className="block">
              <Card className="h-full transition hover:border-primary/40 hover:shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    {link.title}
                    <ArrowRight className="h-4 w-4" />
                  </CardTitle>
                  <CardDescription>{link.description}</CardDescription>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Index;
