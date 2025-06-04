
import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from './AppSidebar';
import { Button } from '@/components/ui/button';
import { Menu, User, Bell } from 'lucide-react';
import { NotificacionesDropdown } from './notificaciones/NotificacionesDropdown';
import { ThemeToggle } from './theme/ThemeToggle';
import { AuthModal } from './auth/AuthModal';
import { useAuth } from '@/hooks/useAuth';

const AppLayout = () => {
  const { user, signOut } = useAuth();
  const [authModalAbierto, setAuthModalAbierto] = useState(false);

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-slate-50 via-purple-50/50 to-blue-50/50">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <header className="glass-effect border-b border-white/20 p-4 flex items-center justify-between shadow-sm sticky top-0 z-40">
            <div className="flex items-center">
              <SidebarTrigger>
                <Button variant="ghost" size="icon" className="mr-3 hover:bg-white/50">
                  <Menu className="h-5 w-5" />
                </Button>
              </SidebarTrigger>
              <h1 className="text-xl font-semibold text-gradient">Hobby Store</h1>
            </div>
            <div className="flex items-center gap-3">
              <ThemeToggle />
              <NotificacionesDropdown />
              
              {user ? (
                <div className="flex items-center gap-3">
                  <span className="text-sm text-muted-foreground font-medium">
                    {user.email}
                  </span>
                  <Button variant="ghost" size="sm" onClick={signOut} className="hover:bg-white/50">
                    Cerrar Sesión
                  </Button>
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white shadow-lg font-semibold text-sm hover-lift">
                    {user.email?.[0]?.toUpperCase() || 'U'}
                  </div>
                </div>
              ) : (
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => setAuthModalAbierto(true)}
                  className="hover:bg-white/50"
                >
                  <User className="h-5 w-5" />
                </Button>
              )}
            </div>
          </header>
          <main className="flex-1 p-6 overflow-auto">
            <div className="animate-fade-in">
              <Outlet />
            </div>
          </main>
        </div>
      </div>

      <AuthModal
        abierto={authModalAbierto}
        onCerrar={() => setAuthModalAbierto(false)}
      />
    </SidebarProvider>
  );
};

export default AppLayout;
