import React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupContent,
} from "@/components/ui/sidebar";
import {
  Home,
  Package,
  ShoppingCart,
  Users,
  Truck,
  BarChart3,
  Archive,
  Tags,
  Eye,
  TrendingUp,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const location = useLocation();

  const menuItems = [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: Home,
    },
    {
      title: "Productos",
      url: "/productos",
      icon: Package,
    },
    {
      title: "Ventas",
      url: "/ventas",
      icon: ShoppingCart,
    },
    {
      title: "Clientes",
      url: "/clientes",
      icon: Users,
    },
    {
      title: "Envíos",
      url: "/envios",
      icon: Truck,
    },
    {
      title: "Analytics",
      url: "/analytics",
      icon: TrendingUp,
    },
    {
      title: "Reportes",
      url: "/reportes",
      icon: BarChart3,
    },
    {
      title: "Movimientos",
      url: "/movimientos-stock",
      icon: Archive,
    },
    {
      title: "Categorías",
      url: "/categorias",
      icon: Tags,
    },
    {
      title: "Catálogo",
      url: "/catalogo",
      icon: Eye,
    },
  ];

  return (
    <Sidebar variant="inset" {...props} className="glass-card border-r border-white/10">
      <SidebarHeader className="border-b border-white/10 p-4">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
            <Package className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              AnimeStore
            </h2>
            <p className="text-xs text-muted-foreground">Gestión Inteligente</p>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent className="p-4">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={location.pathname === item.url}
                    className="glass-effect hover:bg-white/10 data-[active=true]:bg-gradient-to-r data-[active=true]:from-purple-500/20 data-[active=true]:to-blue-500/20 data-[active=true]:border-purple-500/30"
                  >
                    <Link to={item.url} className="flex items-center space-x-3">
                      <item.icon className="h-5 w-5" />
                      <span className="font-medium">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t border-white/10 p-4">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
            <Users className="h-4 w-4 text-white" />
          </div>
          <div>
            <p className="text-sm font-medium">Administrador</p>
            <p className="text-xs text-muted-foreground">Sistema activo</p>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
