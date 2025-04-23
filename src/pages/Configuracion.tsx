
import React from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { 
  Settings, 
  Lock, 
  Database, 
  Upload, 
  Download,
  Bell,
  ClipboardList,
  FileText,
  Package,
  Users
} from 'lucide-react';

const Configuracion = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Configuración</h1>
        <p className="text-muted-foreground">
          Administra la configuración de tu sistema
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-app-blue" />
              <CardTitle>Información General</CardTitle>
            </div>
            <CardDescription>
              Configura los datos principales de tu negocio
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="business-name">Nombre del Negocio</Label>
              <Input id="business-name" placeholder="Mi Negocio" defaultValue="Hobby Store" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Correo Electrónico</Label>
              <Input id="email" type="email" placeholder="correo@ejemplo.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Teléfono</Label>
              <Input id="phone" placeholder="+51 999 888 777" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Dirección</Label>
              <Input id="address" placeholder="Calle Principal 123" />
            </div>
          </CardContent>
          <CardFooter>
            <Button>Guardar Cambios</Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Lock className="h-5 w-5 text-app-blue" />
              <CardTitle>Seguridad</CardTitle>
            </div>
            <CardDescription>
              Gestiona las opciones de seguridad de tu cuenta
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="current-password">Contraseña Actual</Label>
              <Input id="current-password" type="password" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-password">Nueva Contraseña</Label>
              <Input id="new-password" type="password" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirmar Contraseña</Label>
              <Input id="confirm-password" type="password" />
            </div>
          </CardContent>
          <CardFooter>
            <Button>Cambiar Contraseña</Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Database className="h-5 w-5 text-app-blue" />
              <CardTitle>Base de Datos</CardTitle>
            </div>
            <CardDescription>
              Opciones para gestionar la base de datos
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center p-4 border rounded-lg">
              <div className="flex items-center gap-2">
                <Download className="h-5 w-5 text-app-gray" />
                <div>
                  <p className="font-medium">Respaldo de Datos</p>
                  <p className="text-sm text-muted-foreground">
                    Descarga una copia de seguridad
                  </p>
                </div>
              </div>
              <Button variant="outline">Exportar</Button>
            </div>
            <div className="flex justify-between items-center p-4 border rounded-lg">
              <div className="flex items-center gap-2">
                <Upload className="h-5 w-5 text-app-gray" />
                <div>
                  <p className="font-medium">Restaurar Datos</p>
                  <p className="text-sm text-muted-foreground">
                    Cargar un respaldo previo
                  </p>
                </div>
              </div>
              <Button variant="outline">Importar</Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-app-blue" />
              <CardTitle>Notificaciones</CardTitle>
            </div>
            <CardDescription>
              Configura las alertas del sistema
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center p-4 border rounded-lg">
              <div>
                <p className="font-medium">Stock Bajo</p>
                <p className="text-sm text-muted-foreground">
                  Notificar cuando un producto tenga poco stock
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Label htmlFor="stock-threshold">Umbral</Label>
                <Input id="stock-threshold" 
                  className="w-20" 
                  type="number" 
                  defaultValue="5"
                />
              </div>
            </div>
            <div className="flex justify-between items-center p-4 border rounded-lg">
              <div>
                <p className="font-medium">Pedidos Nuevos</p>
                <p className="text-sm text-muted-foreground">
                  Recibir alertas de nuevas ventas
                </p>
              </div>
              <Button variant="outline">Configurar</Button>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <div className="flex items-center gap-2">
              <ClipboardList className="h-5 w-5 text-app-blue" />
              <CardTitle>Exportación de Reportes</CardTitle>
            </div>
            <CardDescription>
              Genera informes de tu negocio
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex flex-col items-center justify-center p-6 border rounded-lg text-center hover:bg-gray-50 cursor-pointer transition-colors">
                <FileText className="h-8 w-8 text-app-blue mb-2" />
                <h3 className="font-medium mb-1">Reporte de Ventas</h3>
                <p className="text-sm text-muted-foreground">
                  Resumen de ventas por período
                </p>
              </div>
              <div className="flex flex-col items-center justify-center p-6 border rounded-lg text-center hover:bg-gray-50 cursor-pointer transition-colors">
                <Package className="h-8 w-8 text-app-blue mb-2" />
                <h3 className="font-medium mb-1">Inventario</h3>
                <p className="text-sm text-muted-foreground">
                  Estado actual del stock
                </p>
              </div>
              <div className="flex flex-col items-center justify-center p-6 border rounded-lg text-center hover:bg-gray-50 cursor-pointer transition-colors">
                <Users className="h-8 w-8 text-app-blue mb-2" />
                <h3 className="font-medium mb-1">Clientes</h3>
                <p className="text-sm text-muted-foreground">
                  Listado de clientes
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Configuracion;

