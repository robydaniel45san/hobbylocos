
import React from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface EnviosFilterBarProps {
  filtro: string;
  setFiltro: (filtro: string) => void;
}

export const EnviosFilterBar: React.FC<EnviosFilterBarProps> = ({
  filtro, setFiltro
}) => (
  <div className="flex flex-wrap gap-4 items-center justify-between">
    <div className="flex items-center relative max-w-sm">
      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        placeholder="Buscar por ubicación, empresa..."
        className="pl-9 w-full"
        value={filtro}
        onChange={(e) => setFiltro(e.target.value)}
      />
    </div>
  </div>
);
