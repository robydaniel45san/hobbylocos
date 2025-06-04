
import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  Users, 
  FileText, 
  Settings,
  Truck,
  BarChart3,
  Archive,
  Tags,
  Store
} from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";

export function AppSidebar() {
  const menuItems = [
    { title: 'Dashboard', path: '/', icon: LayoutDashboard },
    { title: 'Productos', path: '/productos', icon: Package },
    { title: 'Categorías', path: '/categorias', icon: Tags },
    { title: 'Clientes', path: '/clientes', icon: Users },
    { title: 'Ventas', path: '/ventas', icon: FileText },
    { title: 'Envíos', path: '/envios', icon: Truck },
    { title: 'Stock', path: '/stock', icon: Archive },
    { title: 'Reportes', path: '/reportes', icon: BarChart3 },
    { title: 'Catálogo', path: '/catalogo', icon: Store },
    { title: 'Configuración', path: '/configuracion', icon: Settings },
  ];

  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#9b87f5] to-[#F97316] flex items-center justify-center text-white font-bold text-xl shadow-lg">
            HS
          </div>
          <div className="ml-2">
            <h2 className="font-bold text-lg">Hobby Store</h2>
            <p className="text-xs opacity-70">Tu Tienda de Anime</p>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navegación</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.path}
                      className={({ isActive }) => 
                        isActive ? "bg-sidebar-accent text-sidebar-accent-foreground" : ""
                      }
                    >
                      <item.icon className="h-5 w-5" />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-4">
        <div className="text-xs text-center opacity-70">
          © 2025 Hobby Store
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
