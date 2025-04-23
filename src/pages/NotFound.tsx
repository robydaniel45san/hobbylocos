
import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center space-y-6 px-4">
        <div className="inline-block p-6 bg-app-blue/10 rounded-full">
          <div className="text-8xl font-bold text-app-blue">404</div>
        </div>
        <h1 className="text-3xl font-bold">Página no encontrada</h1>
        <p className="text-muted-foreground max-w-md mx-auto">
          Lo sentimos, no pudimos encontrar la página que estás buscando. La URL <code className="bg-gray-100 px-2 py-1 rounded">{location.pathname}</code> no existe en nuestro sistema.
        </p>
        <div>
          <NavLink to="/">
            <Button>
              <Home className="mr-2 h-4 w-4" />
              Volver al inicio
            </Button>
          </NavLink>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
