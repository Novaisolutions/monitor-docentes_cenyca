# Monitor Control Escolar - Sistema de Chat de WhatsApp

Sistema de chat en tiempo real para monitoreo de conversaciones de WhatsApp Business integrado con Supabase, desarrollado con React, TypeScript y Vite.

## 🚀 Características

- **Chat en tiempo real** con actualizaciones automáticas
- **Gestión de conversaciones** con notificaciones no leídas
- **Búsqueda avanzada** en conversaciones y mensajes  
- **Visualizador de imágenes** con galería
- **Monitor de casos activos** para seguimiento escolar
- **Diseño responsive** optimizado para móvil y desktop
- **PWA** (Progressive Web App) con soporte offline
- **Autenticación** integrada con Supabase Auth
- **Base de datos en tiempo real** con Supabase

## 🛠️ Tecnologías

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Auth, Real-time)
- **Deployment**: Netlify
- **PWA**: Vite PWA Plugin
- **Estado**: React Hooks personalizados
- **Fechas**: date-fns con soporte de timezone

## 📁 Estructura del Proyecto

```
src/
├── components/
│   ├── analysis/        # Componentes de análisis
│   ├── auth/           # Autenticación
│   ├── casos-activos/  # Monitor de casos activos
│   ├── chat/           # Componentes del chat
│   ├── layout/         # Layouts principales
│   └── ui/             # Componentes UI reutilizables
├── hooks/              # React hooks personalizados
├── lib/                # Configuraciones (Supabase)
├── pages/              # Páginas principales
├── types/              # Definiciones TypeScript
└── utils/              # Utilidades
```

## 🔧 Instalación y Desarrollo

### Prerrequisitos
- Node.js 16+
- npm o yarn
- Cuenta de Supabase
- Cuenta de Netlify (para deployment)

### Instalación
```bash
# Clonar el repositorio
git clone https://github.com/Novaisolutions/monitor-docentes_cenyca.git
cd monitor-docentes_cenyca

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env.local
# Editar .env.local con tus credenciales de Supabase
```

### Desarrollo
```bash
# Ejecutar en modo desarrollo
npm run dev

# Construir para producción
npm run build

# Previsualizar build de producción
npm run preview
```

## 🗄️ Base de Datos

El proyecto utiliza Supabase con las siguientes tablas principales:

- `conversaciones_ce` - Gestión de conversaciones
- `mensajes_ce` - Almacenamiento de mensajes
- `Casos_Activos_old` - Monitor de casos activos

### Funciones RPC
- `get_conversaciones_ordenadas` - Obtiene conversaciones paginadas
- `marcar_conversacion_como_leida` - Marca conversaciones como leídas
- `search_conversations_and_messages_ce` - Búsqueda avanzada

## 🌟 Funcionalidades Principales

### Chat en Tiempo Real
- Actualización automática de conversaciones
- Notificaciones de mensajes no leídos
- Carga infinita de mensajes históricos
- Sincronización con zona horaria

### Monitor de Casos Activos
- Seguimiento de casos estudiantiles
- Sistema de comentarios con timestamps
- Cambio de estados automático
- Filtros por responsable y estado

### Búsqueda Avanzada
- Búsqueda en conversaciones y mensajes
- Resultados en tiempo real
- Filtros por contacto y número

## 🚀 Deployment

El proyecto está configurado para deployment automático en Netlify:

```bash
# Build y deploy
npm run build
netlify deploy --prod
```

URL de producción: https://cenyca.netlify.app

## 🔐 Configuración de Supabase

1. Crear proyecto en Supabase
2. Ejecutar migraciones en `supabase/migrations/`
3. Configurar RLS (Row Level Security)
4. Actualizar variables de entorno

## 📱 PWA

El proyecto incluye soporte PWA completo:
- Instalable en dispositivos móviles
- Caché offline de recursos estáticos
- Service Worker para actualizaciones automáticas

## 🤝 Contribución

1. Fork el proyecto
2. Crear rama feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit cambios (`git commit -am 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Crear Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver `LICENSE` para más detalles.

## 👥 Equipo de Desarrollo

Desarrollado para CENYCA - Centro de Estudios Nueva York

## 🐛 Reportar Issues

Si encuentras algún bug o tienes sugerencias, por favor crea un issue en GitHub.

---

⚡ **Optimizado para rendimiento y experiencia de usuario**