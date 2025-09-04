import React, { useEffect, useState } from 'react';
import {
  MessageSquare,
  Users,
  BarChart,
  Settings,
  Moon,
  Sun,
  LogOut,
  Sparkles,
  Sheet,
  Edit,
  Briefcase
} from 'lucide-react';
import { supabase } from '../../lib/supabase'; // Asegura que la ruta sea correcta
import useTheme from '../../hooks/useTheme';
import { AppView } from '../../lib/tutorialSteps';

// Actualizamos las props para incluir la nueva vista
interface NavBarProps {
  theme?: 'dark' | 'light';
  onToggleTheme?: () => void;
  currentView?: AppView; // Usar el tipo actualizado
  onViewChange?: (view: AppView) => void; // Usar el tipo actualizado
  handleLogout: () => void;
  onNavigateBack?: () => void; // Nueva prop para retroceder
}

const NavBar: React.FC<NavBarProps> = ({
  theme = 'dark',
  onToggleTheme,
  currentView = 'chat',
  onViewChange,
  handleLogout,
  onNavigateBack
}) => {
  // Obtener theme y toggleTheme del hook
  const { theme: contextTheme, toggleTheme } = useTheme();

  // Determinar si estamos en móvil o escritorio
  const [isMobile, setIsMobile] = useState(
    typeof window !== 'undefined' ? window.innerWidth < 768 : false
  );

  // Efecto para detectar cambios de tamaño de pantalla
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Clase CSS según el modo (móvil o escritorio)
  const navClass = isMobile ? 'nav-footer' : 'nav-sidebar';

  // Helper para el click en los iconos
  const handleNavClick = (targetView: AppView) => {
    // Si estamos en móvil, viendo un chat, y se pulsa el icono de chat
    if (isMobile && currentView === 'chat' && targetView === 'chat' && onNavigateBack) {
      onNavigateBack(); // Llama a la función para retroceder
    } else if (onViewChange) {
      onViewChange(targetView); // Comportamiento normal de cambio de vista
    }
  };

  // Comentado para desactivar temporalmente
  // const googleSheetUrl = "https://docs.google.com/spreadsheets/d/1igWo0TPXhU30nAOHGu8jrb1EKcjZkkS3dpND4KSIgXw/edit?usp=sharing";

  return (
    <aside id="nav-sidebar" className={navClass}>
      {!isMobile && (
        <div className="nav-sidebar-avatar">
          <img src="/Logo_cenyca.jpeg" alt="Logo CENYCA" style={{ width: '100%', height: 'auto' /* Ajusta estilos si es necesario */ }}/>
        </div>
      )}
      <div className={isMobile ? 'nav-footer-menu' : 'nav-sidebar-menu'}>
        {/* Chats */}
        <div
          className={`nav-item ${currentView === 'chat' ? 'active' : ''}`}
          onClick={() => handleNavClick('chat')}
          role="button" aria-label="Chats"
        >
          <MessageSquare size={20} />
        </div>
        {/* Gestión de Casos */}
        <div
          className={`nav-item ${currentView === 'casosCoord' ? 'active' : ''}`}
          onClick={() => handleNavClick('casosCoord')}
          role="button" aria-label="Gestión de Casos"
        >
          <Briefcase size={20} />
        </div>
        {/* Análisis Inteligente */}
        <div
          className={`nav-item ${currentView === 'analysis' ? 'active' : ''}`}
          onClick={() => handleNavClick('analysis')}
          role="button" aria-label="Análisis Inteligente"
        >
          <Sparkles size={20} />
        </div>
        {/* Settings */}
        <div
          className={`nav-item ${currentView === 'settings' ? 'active' : ''}`}
          onClick={() => handleNavClick('settings')}
          role="button" aria-label="Configuración"
        >
          <Settings size={20} />
        </div>
        {/* ÍCONO DE SHEET DESACTIVADO TEMPORALMENTE */}
        <div className="nav-item disabled" role="button" aria-label="Base de datos (desactivado)">
          <Sheet size={20} />
        </div>
        {/* Theme Toggle */}
        <div
          className="nav-item theme-toggle"
          onClick={() => {
            console.log('[NavSidebar] Theme toggle button clicked!');
            toggleTheme();
          }}
          role="button"
          aria-label="Cambiar tema"
        >
          {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
        </div>
        {/* Logout */}
        <div className="nav-item" onClick={handleLogout} role="button" aria-label="Cerrar sesión">
          <LogOut size={20} />
        </div>
      </div>
    </aside>
  );
};

export default NavBar;