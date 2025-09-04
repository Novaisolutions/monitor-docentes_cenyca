export interface Conversacion {
  id: number;
  numero: string;
  resumen: string | null;
  status: string;
  updated_at: string;
  reactivacion_intentos: number;
  ultimo_intento_reactivacion: string | null;
  proximo_seguimiento: string | null;
  nombre_contacto: string | null;
  ultimo_mensaje_resumen: string | null;
  tiene_no_leidos: boolean;
  no_leidos_count: number;
  plantel: string | null;
  last_message_at?: string | null;
  resumen_ia?: string | null;
}

export interface Mensaje {
  id: number;
  tipo: string;
  numero: string;
  mensaje: string;
  fecha: string;
  nombre: string | null;
  media_url: string | null;
  leido: boolean;
  conversation_id: number | null;
}

export type CasoStatus = 'Nuevo' | 'En proceso' | 'Esperando Respuesta del alumno' | 'Resuelto' | 'Archivado' | 'Reabierto';

export type CasoPrioridad = 'Baja' | 'Media' | 'Alta' | 'Urgente';

export interface Comentario {
  timestamp: string;
  author: string;
  comment: string;
}

export interface CasoActivo {
  id: string;
  fecha_creacion: string;
  nombre_alumno: string | null;
  numero_whatsapp: string | null;
  correo: string | null;
  telefono_alumno: string | null;
  plantel: string | null;
  carrera_o_curso: string | null;
  periodo: string | null;
  horario_o_turno: string | null;
  motivo_solicitud: string | null;
  fecha_resolucion: string | null;
  comentarios_coordinador: Comentario[] | string | null;
  historial_comentarios: string | null;
  status: CasoStatus;
  prioridad: CasoPrioridad | null;
  id_coordinador_asignado?: string | null;
}

export interface Caso {
  id: string;
  fecha_creacion: string;
  nombre_alumno: string | null;
  numero_whatsapp: string | null;
  correo: string | null;
  plantel: string | null;
  carrera_o_curso: string | null;
  horario_o_turno: string | null;
  motivo_solicitud: string | null;
  fecha_resolucion: string | null;
  comentarios_coordinador: string | null; // En Casos_Activos_old es solo texto
  status: CasoStatus;
  prioridad: CasoPrioridad;
  childCases?: Caso[];
}