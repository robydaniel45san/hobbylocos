
import React from 'react';
import { Outlet } from 'react-router-dom';
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from './AppSidebar';
import { Button } from '@/components/ui/button';
import { Menu, Bell } from 'lucide-react';

export function AppLayout() {
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
              <Button variant="ghost" size="icon">
                <Bell className="h-5 w-5" />
              </Button>
              {/* Avatar in anime theme */}
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#9b87f5] to-[#F97316] flex items-center justify-center text-white shadow-md font-bold">
                U
              </div>
            </div>
          </header>
          <main className="flex-1 p-6 overflow-auto bg-gray-50 bg-opacity-90">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}

