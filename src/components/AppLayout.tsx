
import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from './AppSidebar';
import { Button } from '@/components/ui/button';
import { Menu, User } from 'lucide-react';
import { NotificacionesDropdown } from './notificaciones/NotificacionesDropdown';
import { ThemeToggle } from './theme/ThemeToggle';
import { AuthModal } from './auth/AuthModal';
import { useAuth } from '@/hooks/useAuth';

export function AppLayout() {
  const { user, signOut } = useAuth();
  const [authModalAbierto, setAuthModalAbierto] = useState(false);

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-[#1a1f2c] via-[#9b87f5]/10 to-[#ffffff]">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <header className="border-b bg-white/80 backdrop-blur-lg p-4 flex items-center justify-between shadow-sm">
            <div className="flex items-center">
              <SidebarTrigger>
                <Button variant="ghost" size="icon" className="mr-2">
                  <Menu className="h-5 w-5" />
                </Button>
              </SidebarTrigger>
              <h2 className="font-medium text-[#7E69AB]">Hobby Store</h2>
            </div>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <NotificacionesDropdown />
              
              {user ? (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">
                    {user.email}
                  </span>
                  <Button variant="ghost" size="sm" onClick={signOut}>
                    Cerrar Sesión
                  </Button>
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#9b87f5] to-[#F97316] flex items-center justify-center text-white shadow-md font-bold">
                    {user.email?.[0]?.toUpperCase() || 'U'}
                  </div>
                </div>
              ) : (
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => setAuthModalAbierto(true)}
                >
                  <User className="h-5 w-5" />
                </Button>
              )}
            </div>
          </header>
          <main className="flex-1 p-6 overflow-auto bg-gray-50 bg-opacity-90">
            <Outlet />
          </main>
        </div>
      </div>

      <AuthModal
        abierto={authModalAbierto}
        onCerrar={() => setAuthModalAbierto(false)}
      />
    </SidebarProvider>
  );
}
