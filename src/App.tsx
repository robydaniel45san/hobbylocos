
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppLayout } from "./components/AppLayout";
import Dashboard from "./pages/Dashboard";
import Productos from "./pages/Productos";
import Clientes from "./pages/Clientes";
import Ventas from "./pages/Ventas";
import Envios from "./pages/Envios";
import Configuracion from "./pages/Configuracion";
import MovimientosStock from "./pages/MovimientosStock";
import Reportes from "./pages/Reportes";
import NotFound from "./pages/NotFound";
import CatalogoPage from "./pages/CatalogoPage";
import CategoriasPage from "./pages/CategoriasPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route element={<AppLayout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/productos" element={<Productos />} />
            <Route path="/clientes" element={<Clientes />} />
            <Route path="/ventas" element={<Ventas />} />
            <Route path="/envios" element={<Envios />} />
            <Route path="/stock" element={<MovimientosStock />} />
            <Route path="/reportes" element={<Reportes />} />
            <Route path="/categorias" element={<CategoriasPage />} />
            <Route path="/catalogo" element={<CatalogoPage />} />
            <Route path="/configuracion" element={<Configuracion />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
