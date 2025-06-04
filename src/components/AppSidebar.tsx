
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
    { title: 'Dashboard', path: '/', icon: LayoutDashboard, color: 'text-blue-600' },
    { title: 'Productos', path: '/productos', icon: Package, color: 'text-purple-600' },
    { title: 'Categorías', path: '/categorias', icon: Tags, color: 'text-green-600' },
    { title: 'Clientes', path: '/clientes', icon: Users, color: 'text-orange-600' },
    { title: 'Ventas', path: '/ventas', icon: FileText, color: 'text-red-600' },
    { title: 'Envíos', path: '/envios', icon: Truck, color: 'text-indigo-600' },
    { title: 'Stock', path: '/stock', icon: Archive, color: 'text-yellow-600' },
    { title: 'Reportes', path: '/reportes', icon: BarChart3, color: 'text-pink-600' },
    { title: 'Catálogo', path: '/catalogo', icon: Store, color: 'text-teal-600' },
    { title: 'Configuración', path: '/configuracion', icon: Settings, color: 'text-gray-600' },
  ];

  return (
    <Sidebar className="border-r border-white/20">
      <SidebarHeader className="p-6 border-b border-white/10">
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-bold text-lg shadow-lg">
            HS
          </div>
          <div className="ml-3">
            <h2 className="font-bold text-lg text-gradient">Hobby Store</h2>
            <p className="text-xs text-muted-foreground">Tu Tienda de Anime</p>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent className="p-4">
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs uppercase tracking-wider font-semibold text-muted-foreground mb-3">
            Navegación Principal
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className="rounded-lg transition-all duration-200">
                    <NavLink
                      to={item.path}
                      className={({ isActive }) => 
                        `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
                          isActive 
                            ? "bg-gradient-to-r from-purple-500/10 to-blue-500/10 text-purple-700 border border-purple-200 shadow-sm" 
                            : "hover:bg-gray-100 text-gray-700"
                        }`
                      }
                    >
                      <item.icon className={`h-5 w-5 ${item.color}`} />
                      <span className="font-medium">{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-4 border-t border-white/10">
        <div className="text-xs text-center text-muted-foreground">
          © 2025 Hobby Store - Hecho con ❤️
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
