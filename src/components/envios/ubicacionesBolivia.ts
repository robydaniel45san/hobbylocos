
/**
 * Departamentos y provincias principales de Bolivia.
 * Puedes expandir la lista según la necesidad.
 */
export const departamentos = [
  "La Paz",
  "Santa Cruz",
  "Cochabamba",
  "Oruro",
  "Potosí",
  "Chuquisaca",
  "Tarija",
  "Beni",
  "Pando",
];

export const provinciasPorDepartamento: Record<string, string[]> = {
  "La Paz": ["Murillo", "Los Andes", "Ingavi", "Sud Yungas"],
  "Santa Cruz": ["Andrés Ibáñez", "Warnes", "Obispo Santistevan", "Ichilo"],
  "Cochabamba": ["Cercado", "Quillacollo", "Chapare", "Tiraque"],
  "Oruro": ["Cercado", "Pantaleón Dalence", "Saucarí"],
  "Potosí": ["Tomás Frías", "Nor Chichas", "Sur Chichas"],
  "Chuquisaca": ["Oropeza", "Yamparáez", "Jaime Zudáñez"],
  "Tarija": ["Cercado", "Avilés", "Arce"],
  "Beni": ["Cercado", "Moxos", "Yacuma"],
  "Pando": ["Madre de Dios", "Manuripi", "Abuná"],
};

// Export the combined array that was being imported
export const ubicacionesBolivia = departamentos.map(departamento => ({
  departamento,
  provincias: provinciasPorDepartamento[departamento] || []
}));
