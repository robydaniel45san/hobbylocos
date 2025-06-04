
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
import { Plus, Search, Users, Edit, Trash2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useClientes } from '@/hooks/useClientes';
import { NuevoClienteModal } from '@/components/clientes/NuevoClienteModal';
import { EditarClienteModal } from '@/components/clientes/EditarClienteModal';
import { Cliente } from '@/types';

const Clientes = () => {
  const { 
    filtro, 
    setFiltro, 
    clientesFiltrados,
    eliminarCliente,
    actualizarCliente,
    fetchClientes,
    loading,
    error
  } = useClientes();

  const [modalNuevoAbierto, setModalNuevoAbierto] = useState(false);
  const [modalEditarAbierto, setModalEditarAbierto] = useState(false);
  const [clienteSeleccionado, setClienteSeleccionado] = useState<Cliente | null>(null);

  const handleEliminar = async (cliente: Cliente) => {
    const success = await eliminarCliente(cliente.id);
    if (!success) {
      console.error('No se pudo eliminar el cliente');
    }
  };

  const handleEditar = (cliente: Cliente) => {
    setClienteSeleccionado(cliente);
    setModalEditarAbierto(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Clientes</h1>
          <p className="text-muted-foreground">
            Administra tu cartera de clientes
          </p>
        </div>
        <Button onClick={() => setModalNuevoAbierto(true)}>
          <Plus className="h-4 w-4 mr-1" />
          Nuevo Cliente
        </Button>
      </div>

      <div className="flex justify-between items-center flex-wrap gap-4">
        <div className="flex items-center relative max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nombre, celular, ubicación..."
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
              <p className="font-bold text-lg">{clientesFiltrados.length}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {error && (
        <div className="bg-destructive/15 text-destructive px-4 py-3 rounded-md">
          <p className="font-medium">Error al cargar clientes</p>
          <p className="text-sm">{error}</p>
        </div>
      )}

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
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  Cargando datos de clientes...
                </TableCell>
              </TableRow>
            ) : clientesFiltrados.length > 0 ? (
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
                    <div className="flex justify-end gap-2">
                      <Button 
                        size="sm" 
                        variant="ghost"
                        onClick={() => handleEditar(cliente)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button size="sm" variant="ghost">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>¿Eliminar cliente?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Esta acción no se puede deshacer. Se eliminará permanentemente al cliente "{cliente.nombre_completo}".
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleEliminar(cliente)}>
                              Eliminar
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
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

      <NuevoClienteModal
        open={modalNuevoAbierto}
        setOpen={setModalNuevoAbierto}
        onClienteCreado={fetchClientes}
      />

      <EditarClienteModal
        open={modalEditarAbierto}
        setOpen={setModalEditarAbierto}
        cliente={clienteSeleccionado}
        onClienteActualizado={actualizarCliente}
      />
    </div>
  );
};

export default Clientes;
