import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { format } from 'date-fns';
import { supabase } from './lib/supabase';
import { Conversacion, Mensaje } from './types/database';
import { Session } from '@supabase/supabase-js';

// Importar hooks
import useConversations from './hooks/useConversations';
import { useMessages } from './hooks/useMessages';
import useImageViewer from './hooks/useImageViewer';
import useSettings from './hooks/useSettings';
import { useAuthListener } from './hooks/useAuthListener';
import useTheme from './hooks/useTheme';
import { Toaster } from 'sonner';
import { TutorialProvider } from './context/TutorialContext';
import { TutorialController } from './components/tutorial/TutorialController';
import { HelpButton } from './components/tutorial/HelpButton';
import { AppView } from './lib/tutorialSteps';

// Importar componentes
import NavSidebar from './components/layout/NavSidebar';
import ConversationsSidebar from './components/layout/ConversationsSidebar';
import ChatView from './components/layout/ChatView';
import ImageViewer from './components/chat/ImageViewer';
import SettingsPage from './pages/SettingsPage';
import Login from './components/auth/Login';
import AnalysisView from './components/layout/AnalysisView';
import InfoModal from './components/ui/InfoModal';
import CasosActivosView from './components/casos-activos/CasosActivosView';
import MessageInput from './components/chat/MessageInput';
import SmartMetricsTab from './components/casos-activos/SmartMetricsTab';
// import { useCaseStatistics } from './hooks/useCaseStatistics';

// Tipos de vistas disponibles

// Hook para debouncing
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay || 500);
    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}

function App() {
  // --- Hooks ---
  const { timeZone, setTimeZone, availableTimeZones } = useSettings();
  const { session, loading: loadingAuth } = useAuthListener();
  const { theme } = useTheme();

  // --- Ref para almacenar la conversación seleccionada ---
  const selectedConversationRef = useRef<Conversacion | null>(null);

  // --- Ref para la función `addNewMessage` para romper el ciclo de dependencias ---
  const addNewMessageRef = useRef<(newMessage: Mensaje) => void>(() => {});

  // --- Callback para manejar nuevos mensajes (usa Refs para ser estable) ---
  const handleNewMessageRealtime = useCallback((newMessage: Mensaje) => {
    console.log('(App.tsx) Received new message notification:', newMessage);
    const currentConv = selectedConversationRef.current;

    // Si el mensaje es de la conversación activa, usar el ref para añadirlo a la UI
    if (currentConv && newMessage.conversation_id === currentConv.id) {
      console.log('(App.tsx) New message belongs to current conversation. Adding to view via ref...');
      addNewMessageRef.current(newMessage);
    } else {
      console.log(`(App.tsx) New message for different/no conversation. Current: ${currentConv?.id}, New's conv_id: ${newMessage.conversation_id}`);
    }
  }, []); // <-- El array vacío es crucial para que la función sea estable

  const {
    conversations,
    selectedConversation,
    setSelectedConversation: setSelectedConversationHandler,
    searchTerm,
    setSearchTerm,
    isSearching,
    searchResults,
    getConversationFromMessage,
    clearSearch,
    fetchConversations,
    loadingConversations,
    setConversations,
    justUpdatedConvId,
    loadMoreConversations,
    hasMore,
    markConversationAsRead,
  } = useConversations({ onNewMessageReceived: handleNewMessageRealtime });

  const {
    messages,
    fetchMessages,
    addNewMessage,
    loadMoreMessages,
    hasMoreMessages,
    loadingMessages,
  } = useMessages();

  const {
    modalImage,
    currentImageGroup,
    currentImageIndex,
    openImageViewer,
    closeImageViewer,
    hoverTimerRef,
    setCurrentImageIndex,
    setModalImage
  } = useImageViewer();

  // --- Estado para el input de mensajes ---
  const [messageInput, setMessageInput] = useState('');

  // --- Estado para controlar la vista activa ---
  const [currentView, setCurrentView] = useState<AppView>('chat');

  // Controlar la visibilidad de la barra lateral de conversaciones en móvil
  // Este estado determinará si la lista de chats o el chat view se muestra
  const [showConversationList, setShowConversationList] = useState(true);

  // Estado para detectar si estamos en móvil
  const [isMobile, setIsMobile] = useState(
    typeof window !== 'undefined' ? window.innerWidth < 768 : false
  );

  // Estado para el modal de información de Análisis
  const [showAnalysisInfoModal, setShowAnalysisInfoModal] = useState(false);

  // Estado para el modal bloqueante de WhatsApp API
  const [showBlockModal] = useState(true); // Siempre true para bloquear

  // --- Estadísticas globales desde Supabase ---

  // Un solo useEffect para manejar el tamaño de la pantalla
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      // En escritorio, siempre mostrar la lista. En móvil, depende de la selección.
      if (!mobile) {
        setShowConversationList(true);
      }
    };

    handleResize(); // Llamada inicial
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // --- Efecto para ajustar altura en móviles ---
  useEffect(() => {
    const setAppHeight = () => {
      const doc = document.documentElement;
      // Usar window.innerHeight que suele ser más preciso en móviles
      doc.style.setProperty('--app-height', `${window.innerHeight}px`);
      console.log(`App height set to: ${window.innerHeight}px`);
    };

    // Establecer altura inicial y en resize/orientation change
    window.addEventListener('resize', setAppHeight);
    window.addEventListener('orientationchange', setAppHeight);
    setAppHeight(); // Llamada inicial

    // Limpiar listeners
    return () => {
      window.removeEventListener('resize', setAppHeight);
      window.removeEventListener('orientationchange', setAppHeight);
    };
  }, []);

  // --- Efectos Secundarios ---

  // Mantener el Ref a `addNewMessage` actualizado
  useEffect(() => {
    addNewMessageRef.current = addNewMessage;
  }, [addNewMessage]);

  // Mantener el Ref de la conversación seleccionada sincronizado
  useEffect(() => {
    selectedConversationRef.current = selectedConversation;
  }, [selectedConversation]);

  // Cargar mensajes iniciales cuando cambia la conversación seleccionada
  useEffect(() => {
    // Solo cargar mensajes si hay una conversación seleccionada
    if (selectedConversation?.id) {
      console.log('(App.tsx effect) Fetching initial messages for conv:', selectedConversation.id);
      fetchMessages(selectedConversation.id);
      // En móvil, al seleccionar un chat, ocultar la lista para mostrar el chat
      if (isMobile) {
        setShowConversationList(false);
      }
    }
  }, [selectedConversation, fetchMessages, isMobile]);

  // Marcar como leído
  // Esta funcionalidad ya se maneja en ConversationsSidebar.tsx

  // Efecto para limpiar conversaciones si el usuario cierra sesión
  useEffect(() => {
      if (!session) {
        setSelectedConversationHandler(null);
        setConversations([]);
      }
  }, [session]);

  // Cargar conversaciones iniciales DESPUÉS de que la sesión esté activa
  useEffect(() => {
    if (session) {
      console.log('(App.tsx effect) Session is active, calling fetchConversations...');
      fetchConversations();
    } else {
      console.log('(App.tsx effect) No session, clearing conversations.');
      setConversations([]);
    }
  }, [session, fetchConversations, setConversations]);

  // --- Funciones Handler ---

  const handleSelectConversation = (conv: Conversacion | null) => {
    setSelectedConversationHandler(conv);

    // En móvil, siempre mostrar la vista de chat al seleccionar
    if (isMobile && conv) {
      setShowConversationList(false);
    }
  };

  const handleBackToList = () => {
    setShowConversationList(true);
  };

  const handleSendMessage = () => {
    // Función placeholder - actualmente no se envían mensajes desde el frontend
    console.log('Send message placeholder');
  };

  // Navegación para ImageViewer
  const handlePrevImage = () => {
    if (currentImageGroup.length <= 1) return;
    const newIndex = (currentImageIndex - 1 + currentImageGroup.length) % currentImageGroup.length;
    setCurrentImageIndex(newIndex);
    setModalImage(currentImageGroup[newIndex]);
  };

  const handleNextImage = () => {
    if (currentImageGroup.length <= 1) return;
    const newIndex = (currentImageIndex + 1) % currentImageGroup.length;
    setCurrentImageIndex(newIndex);
    setModalImage(currentImageGroup[newIndex]);
  };

  // --- Manejador para cambiar la vista activa ---
  const handleViewChange = useCallback((view: AppView) => {
    // Si vamos a la vista de análisis, solo mostrar el modal y no cambiar de vista.
    if (view === 'analysis') {
      setShowAnalysisInfoModal(true);
      return; // Detener la ejecución aquí
    }

    setCurrentView(view);
    // Si volvemos a la vista de chat, refrescar las conversaciones para asegurar estado correcto.
    if (view === 'chat') {
      fetchConversations();
    }
  }, [fetchConversations]);

  // --- Renderizado de Contenido (Mantenido aquí por dependencia de useImageViewer) ---
  const renderMessageContent = useCallback((mensaje: Mensaje) => {
    const imageRegex = /(https?:\/\/[^\s]+\.(?:jpg|jpeg|png|gif|webp))/gi;
    const matches = mensaje.mensaje.match(imageRegex) || [];
    let mediaUrls: string[] = [];
    if (mensaje.media_url) {
      try {
        const parsed = JSON.parse(mensaje.media_url);
        mediaUrls = Array.isArray(parsed) ? parsed : [mensaje.media_url];
      } catch (e) {
        mediaUrls = [mensaje.media_url];
      }
    }
    const allImages = [...matches, ...mediaUrls.filter(url => url && url.trim() !== '')];
    const uniqueImages = [...new Set(allImages)];
    let textContent = mensaje.mensaje;
    uniqueImages.forEach(url => { textContent = textContent.replace(url, ''); });
    textContent = textContent.trim();
    let imagesContainerClass = "message-images";
    if (uniqueImages.length === 1) imagesContainerClass += " single-image";
    else if (uniqueImages.length > 1) {
      imagesContainerClass += " multi-image";
      if (uniqueImages.length === 3) imagesContainerClass += " grid-3";
      else if (uniqueImages.length === 4) imagesContainerClass += " grid-4";
      else if (uniqueImages.length > 4) imagesContainerClass += " grid-more";
    }
    const handleImageClickInternal = (url: string, index: number) => openImageViewer(url, uniqueImages, index);
    const handleMouseEnterInternal = (url: string, index: number) => {
      if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
      hoverTimerRef.current = setTimeout(() => openImageViewer(url, uniqueImages, index), 1500);
    };
    const handleMouseLeaveInternal = () => { if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current); };
    return (
      <>
        {textContent && <div className="message-text">{textContent}</div>}
        {uniqueImages.length > 0 && (
          <div className={imagesContainerClass}>
            {uniqueImages.slice(0, 4).map((url, index) => (
              <img key={index} src={url} alt={`Imagen ${index + 1}`} className="message-image" onClick={() => handleImageClickInternal(url, index)} onMouseEnter={() => handleMouseEnterInternal(url, index)} onMouseLeave={handleMouseLeaveInternal} onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
            ))}
            {uniqueImages.length > 4 && (
              <div className="message-image" style={{ position: 'relative' }} onClick={() => handleImageClickInternal(uniqueImages[4], 4)} onMouseEnter={() => handleMouseEnterInternal(uniqueImages[4], 4)} onMouseLeave={handleMouseLeaveInternal}>
                <img src={uniqueImages[4]} alt={`Imagen 5`} className="message-image" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                {uniqueImages.length > 5 && <div className="image-counter">+{uniqueImages.length - 4}</div>}
              </div>
            )}
          </div>
        )}
      </>
  );
  }, [openImageViewer, hoverTimerRef]);

  // Filtrar conversaciones basado en búsqueda
  const filteredConversations = useMemo(() => {
    if (!searchTerm) {
      return conversations;
    }
    return conversations.filter(conv =>
      conv.nombre_contacto?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      conv.numero.includes(searchTerm)
    );
  }, [conversations, searchTerm]);

  // Lógica de Logout
  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Error logging out:", error);
    }
    // onAuthStateChange limpiará la sesión y estados
  };

  // --- Renderizado Principal ---
  if (loadingAuth) {
    return <div className="loading-container">Cargando...</div>;
  }

  if (!session) {
    return <Login />;
  }

  // Renderizar la vista activa
  const renderActiveView = () => {
    switch (currentView) {
      case 'chat':
        return (
          <div className="main-layout chat-layout">
            <div className={`transition-transform duration-300 ease-in-out ${isMobile && !showConversationList ? '-translate-x-full' : 'translate-x-0'} w-full md:w-auto`}>
            <ConversationsSidebar
                conversations={isSearching ? searchResults.conversaciones : conversations}
              selectedConversation={selectedConversation}
                onSelectConversation={handleSelectConversation}
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              isSearching={isSearching}
              searchResults={searchResults}
              getConversationFromMessage={getConversationFromMessage}
              clearSearch={clearSearch}
              justUpdatedConvId={justUpdatedConvId}
              loading={loadingConversations}
                loadMoreConversations={loadMoreConversations}
                hasMore={hasMore}
              markConversationAsRead={markConversationAsRead}
            />
            </div>
            <div className={`main-content ${isMobile && showConversationList ? 'hidden' : 'flex'}`}>
              <div className="chat-container">
            <ChatView
              selectedConversation={selectedConversation}
              messages={messages}
              renderMessageContent={renderMessageContent}
                  onBackToList={() => setShowConversationList(true)}
                  showMobileChat={!showConversationList}
                  loadMoreMessages={loadMoreMessages}
                  hasMoreMessages={hasMoreMessages}
                  loadingMessages={loadingMessages}
                  loadMoreConversations={loadMoreConversations}
                  hasMore={hasMore}
                  markConversationAsRead={markConversationAsRead}
                />
                <MessageInput
                  messageInput={messageInput}
                  onSendMessage={handleSendMessage}
                  onMessageInputChange={setMessageInput}
                  selectedConversation={selectedConversation}
            />
              </div>
            </div>
          </div>
        );
      case 'casosCoord':
        return (
          <div className="main-layout casos-layout">
            <CasosActivosView />
          </div>
        );
      case 'settings':
        return <SettingsPage />;
      case 'analysis':
        return <AnalysisView conversations={conversations} fetchConversations={fetchConversations} />;
      default:
        return <div>Vista no encontrada</div>;
    }
  };

  return (
    <div className={`app-container ${theme} flex flex-col h-screen`}>
      {/* MODAL BLOQUEANTE DE WHATSAPP API */}
      <InfoModal
        isOpen={showBlockModal}
        onClose={() => {}}
        title="Cuenta de WhatsApp API desactivada"
        forceBlock
      >
        <p>Esta cuenta de WhatsApp API se ha desactivado.</p>
        <p>Descarga la aplicación de <b>WhatsApp Business</b> en tu celular para continuar atendiendo a los alumnos con asistencia humana.</p>
        <p className="mt-2 font-semibold text-red-600">Esta ventana no se puede cerrar.</p>
      </InfoModal>
      {/* RESTO DE LA APP */}
      <TutorialProvider onViewChange={handleViewChange}>
        <div className="main-content aligned-layout">
          {!isMobile && (
            <NavSidebar
              currentView={currentView}
              onViewChange={handleViewChange}
              handleLogout={handleLogout}
              onNavigateBack={handleBackToList}
            />
          )}

          <Toaster />
          {renderActiveView()}
        </div>

        {/* Barra de navegación inferior siempre visible en móvil */}
        {isMobile && (
          <NavSidebar
            currentView={currentView}
            onViewChange={handleViewChange}
            handleLogout={handleLogout}
            onNavigateBack={handleBackToList}
          />
        )}

        {/* Visor de imágenes modal */}
        {modalImage && (
        <ImageViewer
          modalImage={modalImage}
          currentImageGroup={currentImageGroup}
          currentImageIndex={currentImageIndex}
          onClose={closeImageViewer}
          onPrev={handlePrevImage}
          onNext={handleNextImage}
        />
        )}

        {/* RENDERIZAR EL MODAL DE INFORMACIÓN CONDICIONALMENTE */}
        {showAnalysisInfoModal && (
            <InfoModal
              isOpen={showAnalysisInfoModal}
              onClose={() => setShowAnalysisInfoModal(false)}
              title="Análisis de Conversaciones"
            >
              {/* Contenido del modal */}
              <p>Esta funcionalidad avanzada estará disponible próximamente.</p>
              <p className="mt-2">
                Una vez activada (requiere aproximadamente un mes de datos),
                podrás realizar consultas en lenguaje natural sobre las
                interacciones acumuladas para obtener información valiosa y
                resúmenes automáticos.
              </p>
              <p className="mt-2">¡Gracias por tu paciencia!</p>
            </InfoModal>
          )}

        {/* COMPONENTE DE MÉTRICAS GLOBAL - SIEMPRE VISIBLE */}
        <SmartMetricsTab />
        <TutorialController />
        <HelpButton />
      </TutorialProvider>
    </div>
  );
}

export default App;