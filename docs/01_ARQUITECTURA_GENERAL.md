# 🏗️ Arquitectura General - Monitor Control Escolar

## 📐 **Patrón Arquitectónico Principal**

### **Client-Side Architecture Pattern**
```
┌─────────────────────────────────────────────────────────────┐
│                    BROWSER (React SPA)                     │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────────────────┐ │
│  │   App.tsx   │ │ Router DOM  │ │     State Management    │ │
│  │  (490 LOC)  │ │ (Navigation)│ │   (useState/Context)    │ │
│  └─────────────┘ └─────────────┘ └─────────────────────────┘ │
├─────────────────────────────────────────────────────────────┤
│                    COMPONENT LAYER                         │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────────────────┐ │
│  │   Layout    │ │     UI      │ │       Business          │ │
│  │ Components  │ │ Components  │ │      Components         │ │
│  │   (4)       │ │    (19)     │ │        (16)             │ │
│  └─────────────┘ └─────────────┘ └─────────────────────────┘ │
├─────────────────────────────────────────────────────────────┤
│                     HOOKS LAYER                           │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────────────────┐ │
│  │   Data      │ │    UI       │ │       Utilities         │ │
│  │   Hooks     │ │   Hooks     │ │        Hooks            │ │
│  │   (3)       │ │    (2)      │ │         (2)             │ │
│  └─────────────┘ └─────────────┘ └─────────────────────────┘ │
├─────────────────────────────────────────────────────────────┤
│                   INTEGRATION LAYER                       │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │              Supabase Client                           │ │
│  │         (PostgreSQL + Real-time + Auth)               │ │
│  └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

## 🔄 **Flujos de Datos Principales**

### **1. Flujo de Autenticación**
```
User Login → Supabase Auth → Session State → Route Guard → Dashboard
```

### **2. Flujo de Mensajería**
```
Message Input → useMessages Hook → Supabase RPC → Real-time Sync → UI Update
```

### **3. Flujo de Gestión de Casos**
```
Caso Creation → CasosActivosView → Database Mutation → List Refresh → UI Update
```

El flujo ahora incluye la capacidad de expandir y contraer detalles de casos, mejorando la usabilidad y la experiencia del usuario.

## 🌟 **Nueva Funcionalidad: Tutorial Guiado Interactivo**

Para mejorar la experiencia de onboarding de nuevos usuarios y servir como referencia para los existentes, se ha añadido un sistema de tutorial guiado.

### **Características Principales:**
- **Activación:** Se lanza automáticamente en la primera visita del usuario y puede ser reactivado en cualquier momento a través de un botón persistente de "Ayuda" (❓).
- **Componente Superpuesto:** El tutorial se renderiza como una capa sobre la aplicación existente, destacando elementos específicos de la UI.
- **Estado Global:** Se gestiona a través de un `TutorialContext`, permitiendo que cualquier componente pueda iniciar o interactuar con el tutorial.
- **Pasos Configurables:** La secuencia de pasos del tutorial está definida en un archivo de configuración, facilitando la adición, eliminación o modificación de pasos sin alterar la lógica principal.

### **Flujo del Tutorial:**
```
Primera Visita O Clic en Botón de Ayuda → TutorialProvider Activa Estado → Overlay Muestra Paso 1 → Usuario Navega (Siguiente/Anterior) → Finaliza o Cierra Tutorial → Estado se Guarda en LocalStorage
```

## 📂 **Estructura de Componentes por Responsabilidad**

### **🎛️ Layout Components (4 componentes)**
- **`NavSidebar.tsx`** - Navegación principal
- **`ConversationsSidebar.tsx`** (235 LOC) - Lista de conversaciones
- **`ChatView.tsx`** (300 LOC) - Vista principal de chat
- **`AnalysisView.tsx`** - Vista de análisis

### **🧩 UI Components (19 componentes)**
- **Radix UI wrappers** - `button`, `input`, `dialog`, etc.
- **Custom UI** - `ProfilePicture`, `SearchBar`, `InfoModal`
- **Domain-specific** - `ConversationItem`, `CasoActivoItem`

### **💼 Business Components (16 componentes)**
- **Chat Logic** - `MessageBubble`, `MessageInput`, `TypingIndicator`
- **Casos Logic** - `CasoDetailView` (216 LOC), `CasoListItem`, `CasoSidebarItem`
- **Dashboard** - `RightSidebar`, `AnalysisSidebar`

## 🔗 **Patrones de State Management**

### **Local State (useState)**
```typescript
// Usado en: 47 componentes detectados
const [loading, setLoading] = useState(false);
const [data, setData] = useState(null);
```

### **Global State (Context)**
```typescript
// Contextos identificados
- TutorialContext (nuevo)
- ThemeContext (global)
```