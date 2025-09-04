import React, { useState } from 'react';
import { supabase } from '../../lib/supabase'; // Restauramos la importación de Supabase
import InfoModal from '../ui/InfoModal';

const Login: React.FC = () => { // Eliminamos la prop onLoginSuccess
  const [email, setEmail] = useState<string>('controlescolar@monitor.novai');
  const [password, setPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Estado para el modal bloqueante de WhatsApp API
  const [showBlockModal] = useState(true); // Siempre true para bloquear

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    // Removemos la lógica de login falso y restauramos la autenticación de Supabase
    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      if (signInError) {
        throw signInError;
      }

      console.log('Login successful:', data);
      // El onAuthStateChange en App.tsx manejará la redirección/actualización

    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.error_description || err.message || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container" style={styles.container}>
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
      <div className="login-form" style={styles.form}>
        <h2 style={styles.title}>Iniciar Sesión - Monitor</h2>
        <form onSubmit={handleLogin}>
          <div style={styles.inputGroup}>
            <label htmlFor="email" style={styles.label}>Usuario:</label>
            <input
              id="email"
              type="email" // Mantenemos type email por compatibilidad
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={styles.input}
              placeholder="controlescolar@monitor.novai"
            />
          </div>
          <div style={styles.inputGroup}>
            <label htmlFor="password" style={styles.label}>Contraseña:</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={styles.input}
            />
          </div>
          {error && <p style={styles.error}>{error}</p>}
          <button type="submit" disabled={loading} style={styles.button}>
            {loading ? 'Iniciando...' : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  );
};

// Estilos básicos inline para simplicidad (puedes moverlos a CSS)
const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    backgroundColor: 'var(--bg-body-from)', // Usar variable de tema
  },
  form: {
    padding: '40px',
    backgroundColor: 'var(--bg-card)', // Usar variable de tema
    borderRadius: 'var(--radius-lg)', // Usar variable de tema
    boxShadow: 'var(--shadow-normal)', // Usar variable de tema
    width: '100%',
    maxWidth: '400px',
    textAlign: 'center',
  },
  title: {
    marginBottom: '30px',
    color: 'var(--color-text)', // Usar variable de tema
    fontSize: '1.5rem',
  },
  inputGroup: {
    marginBottom: '20px',
    textAlign: 'left',
  },
  label: {
    display: 'block',
    marginBottom: '8px',
    color: 'var(--color-text-secondary)', // Usar variable de tema
    fontSize: '0.9rem',
  },
  input: {
    width: '100%',
    padding: '12px 15px',
    borderRadius: 'var(--radius-md)', // Usar variable de tema
    border: '1px solid var(--color-border)', // Usar variable de tema
    backgroundColor: 'var(--bg-surface)', // Usar variable de tema
    color: 'var(--color-text)', // Usar variable de tema
    fontSize: '1rem',
    boxSizing: 'border-box', // Asegurar padding correcto
  },
  button: {
    width: '100%',
    padding: '12px 15px',
    borderRadius: 'var(--radius-md)',
    border: 'none',
    backgroundColor: 'var(--color-primary)', // Usar variable de tema
    color: 'white',
    fontSize: '1rem',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'background-color 0.2s ease',
    marginTop: '10px',
  },
  error: {
    color: '#f87171', // Color rojo para errores
    fontSize: '0.85rem',
    marginBottom: '15px',
  },
};

export default Login;