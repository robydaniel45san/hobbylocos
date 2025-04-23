
import React, { useState } from 'react';
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableRow, 
  TableHead, 
  TableCell 
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus, Search, Users } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Cliente } from '@/types';

// Clientes de ejemplo
const clientesDemoData: Cliente[] = [
  {
    id: '1',
    nombre_completo: 'María García Pérez',
    celular: '999-888-777',
    correo: 'maria@example.com',
    direccion: 'Av. Principal 123',
    departamento: 'Lima',
    provincia: 'Lima',
    notas: 'Cliente habitual'
  },
  {
    id: '2',
    nombre_completo: 'Juan Rodríguez Sánchez',
    celular: '888-777-666',
    correo: 'juan@example.com',
    direccion: 'Calle Secundaria 456',
    departamento: 'Arequipa',
    provincia: 'Arequipa',
    notas: null
  },
  {
    id: '3',
    nombre_completo: 'Ana López Martínez',
    celular: '777-666-555',
    correo: 'ana@example.com',
    direccion: 'Av. Central 789',
    departamento: 'Cusco',
    provincia: 'Cusco',
    notas: 'Prefiere entregas por la tarde'
  },
  {
    id: '4',
    nombre_completo: 'Pedro González Díaz',
    celular: '666-555-444',
    correo: 'pedro@example.com',
    direccion: 'Jr. Lateral 101',
    departamento: 'Trujillo',
    provincia: 'La Libertad',
    notas: null
  },
  {
    id: '5',
    nombre_completo: 'Luisa Fernández Castro',
    celular: '555-444-333',
    correo: 'luisa@example.com',
    direccion: 'Pasaje Norte 202',
    departamento: 'Piura',
    provincia: 'Piura',
    notas: 'Cliente VIP'
  },
];

const Clientes = () => {
  const [filtro, setFiltro] = useState<string>('');
  const [clientes, setClientes] = useState<Cliente[]>(clientesDemoData);

  // Función para filtrar clientes
  const clientesFiltrados = clientes.filter(cliente => 
    cliente.nombre_completo.toLowerCase().includes(filtro.toLowerCase()) ||
    (cliente.correo && cliente.correo.toLowerCase().includes(filtro.toLowerCase())) ||
    (cliente.celular && cliente.celular.includes(filtro)) ||
    (cliente.departamento && cliente.departamento.toLowerCase().includes(filtro.toLowerCase())) ||
    (cliente.provincia && cliente.provincia.toLowerCase().includes(filtro.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Clientes</h1>
          <p className="text-muted-foreground">
            Administra tu cartera de clientes
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-1" />
          Nuevo Cliente
        </Button>
      </div>

      <div className="flex justify-between items-center flex-wrap gap-4">
        <div className="flex items-center relative max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nombre, email, ubicación..."
            className="pl-9 w-full"
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
          />
        </div>
        <Card className="border-none shadow-none bg-purple-50">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="bg-purple-500 rounded-full p-2">
              <Users className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-sm text-purple-700">Total Clientes</p>
              <p className="font-bold text-lg">{clientes.length}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Contacto</TableHead>
              <TableHead>Ubicación</TableHead>
              <TableHead>Notas</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {clientesFiltrados.length > 0 ? (
              clientesFiltrados.map((cliente) => (
                <TableRow key={cliente.id}>
                  <TableCell className="font-medium">{cliente.nombre_completo}</TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      {cliente.celular && <div className="text-sm">{cliente.celular}</div>}
                      {cliente.correo && <div className="text-sm text-muted-foreground">{cliente.correo}</div>}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      {cliente.direccion && <div className="text-sm">{cliente.direccion}</div>}
                      {(cliente.provincia || cliente.departamento) && (
                        <div className="text-sm text-muted-foreground">
                          {[cliente.provincia, cliente.departamento].filter(Boolean).join(', ')}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {cliente.notas || <span className="text-muted-foreground">-</span>}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button size="sm" variant="ghost">
                      Editar
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  No se encontraron clientes
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default Clientes;
