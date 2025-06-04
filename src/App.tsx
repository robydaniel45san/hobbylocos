import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import AppLayout from '@/components/AppLayout';
import Index from '@/pages/Index';
import Dashboard from '@/pages/Dashboard';
import Productos from '@/pages/Productos';
import Ventas from '@/pages/Ventas';
import Clientes from '@/pages/Clientes';
import Envios from '@/pages/Envios';
import Reportes from '@/pages/Reportes';
import NotFound from '@/pages/NotFound';
import CategoriasPage from '@/pages/CategoriasPage';
import Configuracion from '@/pages/Configuracion';
import CatalogoPage from '@/pages/CatalogoPage';
import MovimientosStock from '@/pages/MovimientosStock';
import AnalyticsPage from './pages/AnalyticsPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<Index />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="productos" element={<Productos />} />
          <Route path="ventas" element={<Ventas />} />
          <Route path="clientes" element={<Clientes />} />
          <Route path="envios" element={<Envios />} />
          <Route path="analytics" element={<AnalyticsPage />} />
          <Route path="reportes" element={<Reportes />} />
          <Route path="movimientos-stock" element={<MovimientosStock />} />
          <Route path="categorias" element={<CategoriasPage />} />
          <Route path="configuracion" element={<Configuracion />} />
          <Route path="catalogo" element={<CatalogoPage />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster />
    </Router>
  );
}

export default App;
