# Análisis de negocio y recomendaciones de estructura/diseño

## 1. Resumen ejecutivo
La aplicación es un panel de gestión para una tienda de productos de anime (mayorista y minorista). Incluye navegación lateral con módulos de dashboard, productos, ventas, clientes, envíos, analytics, reportes, movimientos de stock, categorías y catálogo público. El layout principal ofrece encabezado con cambio de tema, notificaciones y control de sesión. Los datos del dashboard presentan métricas de ventas, productos y pedidos con visualizaciones y tarjetas de estado.

## 2. Estructura actual de la aplicación
- **Enrutamiento principal**: `src/App.tsx` define un router con layout compartido y rutas por módulo (dashboard, productos, ventas, clientes, envíos, analytics, reportes, movimientos de stock, categorías y catálogo). La ruta base usa `AppLayout` y existe un manejador `NotFound` para rutas inexistentes.
- **Layout y navegación**: `AppLayout` estructura la página con sidebar persistente, encabezado pegajoso con botones de tema/notificaciones y autenticación, y contenedor principal animado para las vistas. El sidebar (`AppSidebar`) incorpora branding “AnimeStore”, estados activos y atajos a los módulos clave.
- **Home y dashboards**: `Dashboard` muestra tarjetas de KPIs (ventas totales, ventas realizadas, productos activos, pedidos pendientes), gráficos de ventas por mes y estado, y listados de productos más vendidos. `Index` es actualmente una portada placeholder sin contenido de negocio.

## 3. Insights de negocio
- **Oferta**: catálogo de productos de anime con enfoque en ventas mixtas (mayorista y minorista).
- **Operaciones clave**: control de inventario y stock, seguimiento de pedidos/ventas y estado de envíos, analítica de ventas, categorización de productos y publicación de catálogo.
- **Usuarios objetivo**: administradores/gestores de tienda; potencial para clientes B2B y B2C mediante el módulo de catálogo.
- **KPI actuales visibles**: ventas totales, crecimiento, ventas realizadas vs pendientes, productos activos, alerta de stock bajo, distribución de ventas por estado y desempeño de productos.

## 4. Hallazgos de diseño y UX
- El layout de vidrio/espejado, gradientes y tarjetas genera identidad moderna, pero el home vacío rompe la continuidad de marca y confunde al usuario inicial.
- La jerarquía de navegación es clara, aunque el orden mezcla vistas operativas (Productos, Ventas) con análisis (Analytics/Reportes) sin agrupación.
- El header muestra controles de sesión y notificaciones; faltan breadcrumbs o contexto de sección.
- No se indican permisos/roles en la interfaz (solo etiqueta “Administrador”), lo que limita escalabilidad multirol.

## 5. Recomendaciones de mejora
### 5.1 Estructura de información
- Crear una **Landing / Overview** en `Index` con acceso rápido a KPIs, tareas frecuentes y atajos a catálogos/promociones para reducir fricción de entrada.
- Agrupar la navegación lateral en secciones (Operaciones, Análisis, Catálogo) y añadir descriptores cortos para cada módulo.
- Incorporar breadcrumbs o subtítulos en el header para reforzar el contexto de la vista actual.

### 5.2 Diseño y experiencia
- Unificar el branding (nombre del header “Hobby Store” vs sidebar “AnimeStore”) y definir paleta/typography en un tema centralizado.
- Añadir estados vacíos y skeletons coherentes en todas las vistas (no solo dashboard) para manejo de carga y datos ausentes.
- Incluir tarjetas de alerta (stock crítico, pedidos atrasados) destacadas con acciones directas (reabastecer, contactar cliente).

### 5.3 Producto y negocio
- Definir **roles y permisos** (Administrador, Operaciones, Ventas, B2B) y ajustar la UI para mostrar solo lo relevante por rol.
- Incorporar **embudo de ventas** y **cohorte de clientes** en la sección de Analytics para monitorear retención y recurrencia.
- Exponer un **catálogo público/privado** con precios diferenciados para mayoristas y minoristas, y medir conversión desde el catálogo.
- Registrar métricas accionables: tiempo de despacho, fill rate, rotación de inventario, margen por categoría.

### 5.4 Roadmap técnico sugerido
1. **Refactor de navegación**: agrupar menú y añadir rutas guardadas por rol; crear configuración central para menús y permisos.
2. **Home operativa**: reemplazar `Index` con panel de atajos, checklist de tareas del día y resumen de pedidos críticos.
3. **Diseño consistente**: unificar branding, theme tokens y estilos de tarjetas/graphs; documentar componentes reutilizables en `components/ui`.
4. **Módulo de alertas**: servicio de notificaciones conectado a stock bajo y pedidos vencidos, con centro de notificaciones accionable.
5. **Analítica avanzada**: panel de cohorts y embudos, exportes a CSV y vistas comparativas por canal/categoría.

## 6. Documentación rápida de módulos
- **Routing**: `src/App.tsx` centraliza rutas protegidas y layout común.
- **Layout base**: `src/components/AppLayout.tsx` maneja estructura, sesión y toggles de UI.
- **Navegación**: `src/components/AppSidebar.tsx` define menús y branding lateral.
- **Dashboard**: `src/pages/Dashboard.tsx` consume `useDashboard` para KPIs, gráficos y productos destacados.
- **Página de inicio**: `src/pages/Index.tsx` es placeholder a reemplazar por una vista de bienvenida/overview.

## 7. Próximos pasos inmediatos
- Redactar guías de estilo (colores, componentes, estados) y reglas de copy para mantener consistencia.
- Diseñar mockups de la nueva landing y navegación agrupada antes de codificar.
- Definir métricas de éxito por módulo (ej. reducción de pedidos pendientes, tiempo de reposición) y registrarlas en dashboard.
