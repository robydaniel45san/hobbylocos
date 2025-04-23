
import { useState, useEffect, useCallback } from 'react';
import { Cliente } from '@/types';

export const useClientes = () => {
  const [filtro, setFiltro] = useState<string>('');
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(false);

  // Obtiene clientes desde Supabase (automatizado)
  const fetchClientes = useCallback(async () => {
    setLoading(true);
    try {
      const { supabase } = await import("@/integrations/supabase/client");
      const { data, error } = await supabase
        .from("clientes")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error al cargar clientes:", error);
      } else if (data) {
        setClientes(data);
      }
    } catch (err) {
      console.error("Error inesperado al cargar clientes:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Carga datos de demostración para desarrollo hasta tener la tabla en Supabase
  useEffect(() => {
    // Datos de ejemplo de clientes bolivianos
    const clientesDemoData: Cliente[] = [
      {
        id: '1',
        nombre_completo: 'María Quispe Mamani',
        celular: '71234567',
        correo: 'maria@example.com',
        direccion: 'Av. 16 de Julio #123',
        departamento: 'La Paz',
        provincia: 'Murillo',
        notas: 'Cliente habitual'
      },
      {
        id: '2',
        nombre_completo: 'Juan Condori Huanca',
        celular: '73456789',
        correo: 'juan@example.com',
        direccion: 'Calle Sagárnaga #456',
        departamento: 'Cochabamba',
        provincia: 'Cercado',
        notas: null
      },
      {
        id: '3',
        nombre_completo: 'Ana Flores Choque',
        celular: '65432198',
        correo: 'ana@example.com',
        direccion: 'Av. América #789',
        departamento: 'Santa Cruz',
        provincia: 'Andrés Ibáñez',
        notas: 'Prefiere entregas por la tarde'
      },
      {
        id: '4',
        nombre_completo: 'Pedro Torrico Ledezma',
        celular: '76543219',
        correo: 'pedro@example.com',
        direccion: 'Calle Sucre #101',
        departamento: 'Tarija',
        provincia: 'Cercado',
        notas: null
      },
      {
        id: '5',
        nombre_completo: 'Luisa Vargas Camacho',
        celular: '60123456',
        correo: 'luisa@example.com',
        direccion: 'Av. Villazón #202',
        departamento: 'Potosí',
        provincia: 'Tomás Frías',
        notas: 'Cliente VIP'
      },
    ];
    setClientes(clientesDemoData);
    
    // Si existe la tabla en Supabase, podemos usar fetchClientes
    // fetchClientes();
  }, []);

  const clientesFiltrados = clientes.filter(cliente => 
    cliente.nombre_completo.toLowerCase().includes(filtro.toLowerCase()) ||
    (cliente.correo && cliente.correo.toLowerCase().includes(filtro.toLowerCase())) ||
    (cliente.celular && cliente.celular.includes(filtro)) ||
    (cliente.departamento && cliente.departamento.toLowerCase().includes(filtro.toLowerCase())) ||
    (cliente.provincia && cliente.provincia.toLowerCase().includes(filtro.toLowerCase()))
  );

  return {
    filtro,
    setFiltro,
    clientes,
    setClientes,
    clientesFiltrados,
    fetchClientes,
    loading
  };
};
