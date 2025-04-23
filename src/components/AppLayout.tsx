
import React from 'react';
import { Outlet } from 'react-router-dom';
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from './AppSidebar';
import { Button } from '@/components/ui/button';
import { Menu, Bell } from 'lucide-react';

export function AppLayout() {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <header className="border-b bg-white p-4 flex items-center justify-between">
            <div className="flex items-center">
              <SidebarTrigger>
                <Button variant="ghost" size="icon" className="mr-2">
                  <Menu className="h-5 w-5" />
                </Button>
              </SidebarTrigger>
              <h2 className="font-medium">Panel de Control</h2>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon">
                <Bell className="h-5 w-5" />
              </Button>
              <div className="w-8 h-8 rounded-full bg-app-blue-light flex items-center justify-center text-white">
                U
              </div>
            </div>
          </header>
          <main className="flex-1 p-6 overflow-auto bg-gray-50">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
