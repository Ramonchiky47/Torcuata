import React, { useState, useCallback, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { Users, TrendingUp, MessageSquare, Star, Send, BarChart3, Home, Lock, LogOut, Settings, Key, Trash2, AlertTriangle } from 'lucide-react';

// Funciones para guardar y cargar respuestas
const saveResponses = (responses: Response[]) => {
  try {
    localStorage.setItem('happyDayResponses', JSON.stringify(responses));
    console.log('✅ Respuestas guardadas localmente');
  } catch (error) {
    console.error('❌ Error guardando:', error);
  }
};

const loadResponses = (): Response[] => {
  try {
    const saved = localStorage.getItem('happyDayResponses');
    return saved ? JSON.parse(saved) : [];
  } catch (error) {
    console.error('❌ Error cargando:', error);
    return [];
  }
};

interface Response {
  id: number;
  fecha: string;
  satisfaccionGeneral: number;
  comunicacion: number;
  reconocimiento: number;
  equilibrio: number;
  desarrollo: number;
  ambiente: number;
  liderazgo: number;
  recursos: number;
  comentarios: string;
  mejoras: string;
}

interface StarRatingProps {
  value: number;
  onChange: (value: number) => void;
  label: string;
  required?: boolean;
  hasError?: boolean;
}

// Estilos definidos fuera del componente para evitar recreación
const styles = {
  container: { minHeight: '100vh', backgroundColor: '#f9fafb' },
  navigation: { backgroundColor: '#f59e0b', color: 'white', padding: '1rem', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' },
  navContent: { maxWidth: '72rem', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  navTitle: { fontSize: '1.5rem', fontWeight: 'bold', margin: 0 },
  navButtons: { display: 'flex', gap: '1rem', alignItems: 'center' },
  navButton: { display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', borderRadius: '0.375rem', border: 'none', color: 'white', cursor: 'pointer' },
  navButtonActive: { backgroundColor: '#d97706' },
  navButtonInactive: { backgroundColor: 'transparent' },
  navButtonLogout: { backgroundColor: '#dc2626' },
  content: { maxWidth: '64rem', margin: '0 auto', padding: '1.5rem' },
  contentSmall: { maxWidth: '32rem', margin: '0 auto', padding: '1.5rem' },
  contentTiny: { maxWidth: '24rem', margin: '4rem auto', padding: '1.5rem' },
  card: { backgroundColor: 'white', padding: '1.5rem', borderRadius: '0.5rem', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)', border: '1px solid #e5e7eb' },
  cardLarge: { backgroundColor: 'white', padding: '2rem', borderRadius: '0.5rem', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)' },
  title: { fontSize: '2.5rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '1rem', textAlign: 'center' },
  subtitle: { fontSize: '1.25rem', color: '#6b7280', marginBottom: '2rem', textAlign: 'center' },
  formGroup: { marginBottom: '1rem' },
  formGroupError: { marginBottom: '1rem', padding: '1rem', backgroundColor: '#fef2f2', border: '1px solid #fecaca', borderRadius: '0.5rem' },
  label: { display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' },
  labelRequired: { display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' },
  labelError: { display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#dc2626', marginBottom: '0.5rem' },
  input: { width: '100%', padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '0.5rem', fontSize: '1rem', boxSizing: 'border-box' },
  inputError: { width: '100%', padding: '0.75rem', border: '2px solid #ef4444', borderRadius: '0.5rem', fontSize: '1rem', boxSizing: 'border-box' },
  textarea: { width: '100%', padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '0.5rem', resize: 'vertical', minHeight: '6rem', fontFamily: 'inherit', fontSize: '0.875rem', lineHeight: '1.5', boxSizing: 'border-box', outline: 'none' },
  button: { backgroundColor: '#f59e0b', color: 'white', padding: '0.75rem 1.5rem', borderRadius: '0.5rem', border: 'none', cursor: 'pointer', fontSize: '1rem', fontWeight: '500' },
  buttonFull: { width: '100%', backgroundColor: '#f59e0b', color: 'white', padding: '0.75rem 1.5rem', borderRadius: '0.5rem', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' },
  buttonGreen: { backgroundColor: '#16a34a', color: 'white', padding: '0.75rem 1.5rem', borderRadius: '0.5rem', border: 'none', cursor: 'pointer' },
  buttonPurple: { backgroundColor: '#7c3aed', color: 'white', padding: '0.75rem 1.5rem', borderRadius: '0.5rem', border: 'none', cursor: 'pointer' },
  buttonRed: { backgroundColor: '#dc2626', color: 'white', padding: '0.75rem 1.5rem', borderRadius: '0.5rem', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' },
  buttonRedFull: { width: '100%', backgroundColor: '#dc2626', color: 'white', padding: '0.75rem 1.5rem', borderRadius: '0.5rem', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' },
  grid2: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginBottom: '2rem' },
  grid4: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2rem' },
  gridChart: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem', marginBottom: '2rem' },
  starContainer: { display: 'flex', gap: '0.25rem' },
  starContainerError: { display: 'flex', gap: '0.25rem', padding: '0.5rem', backgroundColor: '#fef2f2', borderRadius: '0.375rem', border: '1px solid #fecaca' },
  star: { width: '2rem', height: '2rem', backgroundColor: 'transparent', border: 'none', cursor: 'pointer' },
  errorAlert: { padding: '0.75rem', backgroundColor: '#fef2f2', border: '1px solid #fecaca', borderRadius: '0.5rem', marginBottom: '1rem' },
  successAlert: { padding: '0.75rem', backgroundColor: '#f0f9f0', border: '1px solid #a7f3d0', borderRadius: '0.5rem', marginBottom: '1rem' },
  warningAlert: { padding: '1rem', backgroundColor: '#fef3c7', borderRadius: '0.5rem' },
  infoSection: { backgroundColor: '#fef3c7', padding: '1.5rem', borderRadius: '0.5rem' },
  infoGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', fontSize: '0.875rem' },
  infoItem: { display: 'flex', alignItems: 'flex-start', gap: '0.5rem' },
  emptyState: { textAlign: 'center', padding: '3rem', color: '#6b7280' },
  adminActions: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' },
  requiredIndicator: { color: '#dc2626', marginLeft: '0.25rem' },
  footer: { backgroundColor: '#f59e0b', color: 'white', padding: '1rem', textAlign: 'center', marginTop: '2rem' }
} as const;

// Componente StarRating que maneja el estado vacío (0)
const StarRating: React.FC<StarRatingProps> = React.memo(({ value, onChange, label, required = false, hasError = false }) => {
  const handleStarClick = useCallback((star: number) => {
    onChange(star);
  }, [onChange]);

  const stars = useMemo(() => {
    return [1, 2, 3, 4, 5].map((star) => (
      <button
        key={star}
        type="button"
        onClick={() => handleStarClick(star)}
        style={{
          ...styles.star,
          color: star <= value ? '#fbbf24' : '#d1d5db'
        }}
      >
        <Star fill={star <= value ? 'currentColor' : 'none'} />
      </button>
    ));
  }, [value, handleStarClick]);

  const labelStyle = hasError ? styles.labelError : styles.label;
  const containerStyle = hasError ? styles.starContainerError : styles.starContainer;

  return (
    <div style={hasError ? styles.formGroupError : styles.formGroup}>
      <div style={labelStyle}>
        {label}
        {required && <span style={styles.requiredIndicator}>*</span>}
      </div>
      <div style={containerStyle}>
        {stars}
      </div>
      {hasError && (
        <p style={{ color: '#dc2626', fontSize: '0.75rem', marginTop: '0.5rem', margin: 0 }}>
          Esta pregunta es obligatoria
        </p>
      )}
    </div>
  );
});

// Componente de input controlado que mantiene el foco
const ControlledTextarea: React.FC<{
  id: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  label: string;
}> = React.memo(({ id, value, onChange, placeholder, label }) => {
  const handleChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
  }, [onChange]);

  return (
    <div style={{ marginBottom: '1.5rem' }}>
      <label htmlFor={id} style={styles.label}>
        {label}
      </label>
      <textarea
        id={id}
        value={value}
        onChange={handleChange}
        style={styles.textarea}
        placeholder={placeholder}
        rows={4}
      />
    </div>
  );
});

// Componente de input controlado para contraseñas
const ControlledPasswordInput: React.FC<{
  id: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  label: string;
  hasError?: boolean;
  onKeyPress?: (e: React.KeyboardEvent) => void;
}> = React.memo(({ id, value, onChange, placeholder, label, hasError, onKeyPress }) => {
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  }, [onChange]);

  return (
    <div style={styles.formGroup}>
      <label htmlFor={id} style={styles.label}>
        {label}
      </label>
      <input
        id={id}
        type="password"
        value={value}
        onChange={handleChange}
        onKeyPress={onKeyPress}
        style={hasError ? styles.inputError : styles.input}
        placeholder={placeholder}
      />
    </div>
  );
});

// Componente de confirmación para limpiar respuestas
const ConfirmDialog: React.FC<{
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}> = React.memo(({ isOpen, title, message, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '2rem',
        borderRadius: '0.5rem',
        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
        maxWidth: '24rem',
        width: '90%'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <AlertTriangle style={{ color: '#f59e0b', margin: '0 auto 1rem auto' }} size={48} />
          <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '0.5rem' }}>{title}</h3>
          <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>{message}</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button onClick={onCancel} style={{
            flex: 1,
            padding: '0.75rem',
            backgroundColor: '#f3f4f6',
            color: '#374151',
            border: 'none',
            borderRadius: '0.375rem',
            cursor: 'pointer'
          }}>
            Cancelar
          </button>
          <button onClick={onConfirm} style={{
            flex: 1,
            padding: '0.75rem',
            backgroundColor: '#dc2626',
            color: 'white',
            border: 'none',
            borderRadius: '0.375rem',
            cursor: 'pointer'
          }}>
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
});

function App() {
  const [currentView, setCurrentView] = useState<'home' | 'survey' | 'dashboard' | 'login' | 'settings'>('home');
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  
  // Sistema de claves
  const [currentAdminPassword, setCurrentAdminPassword] = useState('admin2025');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [passwordChangeError, setPasswordChangeError] = useState('');
  const [passwordChangeSuccess, setPasswordChangeSuccess] = useState('');

  // Confirmación para limpiar respuestas
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  // Estado inicial cargando desde localStorage
  const [responses, setResponses] = useState<Response[]>(loadResponses());

  // Estado inicial con todas las calificaciones en 0 (sin influencia)
  const [newResponse, setNewResponse] = useState<Omit<Response, 'id' | 'fecha'>>({
    satisfaccionGeneral: 0,
    comunicacion: 0,
    reconocimiento: 0,
    equilibrio: 0,
    desarrollo: 0,
    ambiente: 0,
    liderazgo: 0,
    recursos: 0,
    comentarios: '',
    mejoras: ''
  });

  // Estado para errores de validación
  const [validationErrors, setValidationErrors] = useState<Record<string, boolean>>({});

  // Función para validar el formulario
  const validateForm = useCallback(() => {
    const errors: Record<string, boolean> = {};
    
    if (newResponse.satisfaccionGeneral === 0) errors.satisfaccionGeneral = true;
    if (newResponse.comunicacion === 0) errors.comunicacion = true;
    if (newResponse.reconocimiento === 0) errors.reconocimiento = true;
    if (newResponse.equilibrio === 0) errors.equilibrio = true;
    if (newResponse.desarrollo === 0) errors.desarrollo = true;
    if (newResponse.ambiente === 0) errors.ambiente = true;
    if (newResponse.liderazgo === 0) errors.liderazgo = true;
    if (newResponse.recursos === 0) errors.recursos = true;

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  }, [newResponse]);

  // Handlers memoizados
  const handleAdminLogin = useCallback(() => {
    if (adminPassword === currentAdminPassword) {
      setIsAdmin(true);
      setCurrentView('dashboard');
      setLoginError('');
      setAdminPassword('');
    } else {
      setLoginError('Contraseña incorrecta');
    }
  }, [adminPassword, currentAdminPassword]);

  const handleAdminLogout = useCallback(() => {
    setIsAdmin(false);
    setCurrentView('home');
  }, []);

  const handlePasswordChange = useCallback(() => {
    setPasswordChangeError('');
    setPasswordChangeSuccess('');

    if (oldPassword !== currentAdminPassword) {
      setPasswordChangeError('La contraseña actual es incorrecta');
      return;
    }

    if (newPassword.length < 6) {
      setPasswordChangeError('La nueva contraseña debe tener al menos 6 caracteres');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordChangeError('Las contraseñas no coinciden');
      return;
    }

    setCurrentAdminPassword(newPassword);
    setPasswordChangeSuccess('Contraseña cambiada exitosamente');
    setOldPassword('');
    setNewPassword('');
    setConfirmPassword('');
  }, [oldPassword, newPassword, confirmPassword, currentAdminPassword]);

  // ✅ CAMBIO AQUÍ - Función handleSubmit con guardado
  const handleSubmit = useCallback(() => {
    if (!validateForm()) {
      alert('Por favor, completa todas las preguntas obligatorias antes de enviar.');
      return;
    }

    const response: Response = {
      ...newResponse,
      id: responses.length + 1,
      fecha: new Date().toISOString().split('T')[0]
    };
    
    const newResponses = [...responses, response];
    setResponses(newResponses);
    saveResponses(newResponses); // ← GUARDADO AGREGADO
    
    setNewResponse({
      satisfaccionGeneral: 0,
      comunicacion: 0,
      reconocimiento: 0,
      equilibrio: 0,
      desarrollo: 0,
      ambiente: 0,
      liderazgo: 0,
      recursos: 0,
      comentarios: '',
      mejoras: ''
    });
    setValidationErrors({});
    alert('¡Gracias por tu respuesta! Ha sido enviada de forma anónima.');
  }, [newResponse, responses, validateForm]);

  // ✅ CAMBIO AQUÍ - Función handleClearResponses con guardado
  const handleClearResponses = useCallback(() => {
    setResponses([]);
    saveResponses([]); // ← GUARDADO AGREGADO
    setShowConfirmDialog(false);
    alert('Todas las respuestas han sido eliminadas.');
  }, []);

  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAdminLogin();
    }
  }, [handleAdminLogin]);

  // Handlers para campos de texto específicos
  const handleComentariosChange = useCallback((value: string) => {
    setNewResponse(prev => ({ ...prev, comentarios: value }));
  }, []);

  const handleMejorasChange = useCallback((value: string) => {
    setNewResponse(prev => ({ ...prev, mejoras: value }));
  }, []);

  const handleAdminPasswordChange = useCallback((value: string) => {
    setAdminPassword(value);
  }, []);

  const handleOldPasswordChange = useCallback((value: string) => {
    setOldPassword(value);
  }, []);

  const handleNewPasswordChange = useCallback((value: string) => {
    setNewPassword(value);
  }, []);

  const handleConfirmPasswordChange = useCallback((value: string) => {
    setConfirmPassword(value);
  }, []);

  // Handlers para estrellas memoizados con limpieza de errores
  const handleSatisfaccionChange = useCallback((value: number) => {
    setNewResponse(prev => ({ ...prev, satisfaccionGeneral: value }));
    setValidationErrors(prev => ({ ...prev, satisfaccionGeneral: false }));
  }, []);

  const handleComunicacionChange = useCallback((value: number) => {
    setNewResponse(prev => ({ ...prev, comunicacion: value }));
    setValidationErrors(prev => ({ ...prev, comunicacion: false }));
  }, []);

  const handleReconocimientoChange = useCallback((value: number) => {
    setNewResponse(prev => ({ ...prev, reconocimiento: value }));
    setValidationErrors(prev => ({ ...prev, reconocimiento: false }));
  }, []);

  const handleEquilibrioChange = useCallback((value: number) => {
    setNewResponse(prev => ({ ...prev, equilibrio: value }));
    setValidationErrors(prev => ({ ...prev, equilibrio: false }));
  }, []);

  const handleDesarrolloChange = useCallback((value: number) => {
    setNewResponse(prev => ({ ...prev, desarrollo: value }));
    setValidationErrors(prev => ({ ...prev, desarrollo: false }));
  }, []);

  const handleAmbienteChange = useCallback((value: number) => {
    setNewResponse(prev => ({ ...prev, ambiente: value }));
    setValidationErrors(prev => ({ ...prev, ambiente: false }));
  }, []);

  const handleLiderazgoChange = useCallback((value: number) => {
    setNewResponse(prev => ({ ...prev, liderazgo: value }));
    setValidationErrors(prev => ({ ...prev, liderazgo: false }));
  }, []);

  const handleRecursosChange = useCallback((value: number) => {
    setNewResponse(prev => ({ ...prev, recursos: value }));
    setValidationErrors(prev => ({ ...prev, recursos: false }));
  }, []);

  // Datos calculados memoizados
  const stats = useMemo(() => {
    if (responses.length === 0) return {};
    
    const fields: (keyof Omit<Response, 'id' | 'fecha' | 'comentarios' | 'mejoras'>)[] = [
      'satisfaccionGeneral', 'comunicacion', 'reconocimiento', 'equilibrio', 
      'desarrollo', 'ambiente', 'liderazgo', 'recursos'
    ];
    const result: Record<string, string> = {};
    
    fields.forEach(field => {
      const avg = responses.reduce((sum, response) => sum + response[field], 0) / responses.length;
      result[field] = avg.toFixed(1);
    });
    
    return result;
  }, [responses]);

  const chartData = useMemo(() => [
    { name: 'Satisfacción General', value: parseFloat(stats.satisfaccionGeneral || '0') },
    { name: 'Comunicación', value: parseFloat(stats.comunicacion || '0') },
    { name: 'Reconocimiento', value: parseFloat(stats.reconocimiento || '0') },
    { name: 'Equilibrio Vida-Trabajo', value: parseFloat(stats.equilibrio || '0') },
    { name: 'Desarrollo Profesional', value: parseFloat(stats.desarrollo || '0') },
    { name: 'Ambiente Laboral', value: parseFloat(stats.ambiente || '0') },
    { name: 'Liderazgo', value: parseFloat(stats.liderazgo || '0') },
    { name: 'Recursos y Herramientas', value: parseFloat(stats.recursos || '0') }
  ], [stats]);

  const satisfactionData = useMemo(() => {
    const distribution: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    responses.forEach(response => {
      distribution[response.satisfaccionGeneral]++;
    });
    
    return [
      { name: 'Muy Insatisfecho (1)', value: distribution[1], color: '#ef4444' },
      { name: 'Insatisfecho (2)', value: distribution[2], color: '#f97316' },
      { name: 'Neutral (3)', value: distribution[3], color: '#eab308' },
      { name: 'Satisfecho (4)', value: distribution[4], color: '#22c55e' },
      { name: 'Muy Satisfecho (5)', value: distribution[5], color: '#16a34a' }
    ];
  }, [responses]);

  // Componentes memoizados
  const Navigation = useMemo(() => (
    <div style={styles.navigation}>
      <div style={styles.navContent}>
        <h1 style={styles.navTitle}>Happy Day</h1>
        <div style={styles.navButtons}>
          <button
            onClick={() => setCurrentView('home')}
            style={{
              ...styles.navButton,
              ...(currentView === 'home' ? styles.navButtonActive : styles.navButtonInactive)
            }}
          >
            <Home size={20} />
            <span>Inicio</span>
          </button>
          <button
            onClick={() => setCurrentView('survey')}
            style={{
              ...styles.navButton,
              ...(currentView === 'survey' ? styles.navButtonActive : styles.navButtonInactive)
            }}
          >
            <MessageSquare size={20} />
            <span>Encuesta</span>
          </button>
          
          {!isAdmin ? (
            <button
              onClick={() => setCurrentView('login')}
              style={{
                ...styles.navButton,
                ...(currentView === 'login' ? styles.navButtonActive : styles.navButtonInactive)
              }}
            >
              <Lock size={20} />
              <span>Admin</span>
            </button>
          ) : (
            <>
              <button
                onClick={() => setCurrentView('dashboard')}
                style={{
                  ...styles.navButton,
                  ...(currentView === 'dashboard' ? styles.navButtonActive : styles.navButtonInactive)
                }}
              >
                <BarChart3 size={20} />
                <span>Dashboard</span>
              </button>
              <button
                onClick={() => setCurrentView('settings')}
                style={{
                  ...styles.navButton,
                  ...(currentView === 'settings' ? styles.navButtonActive : styles.navButtonInactive)
                }}
              >
                <Settings size={20} />
                <span>Config</span>
              </button>
              <button
                onClick={handleAdminLogout}
                style={{
                  ...styles.navButton,
                  ...styles.navButtonLogout
                }}
              >
                <LogOut size={20} />
                <span>Salir</span>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  ), [currentView, isAdmin, handleAdminLogout]);

  const renderCurrentView = () => {
    switch (currentView) {
      case 'home':
        return (
          <div style={styles.content}>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <h2 style={styles.title}>Bienvenido al Sistema Happy Day</h2>
              <p style={styles.subtitle}>Tu opinión es importante para crear un mejor ambiente de trabajo</p>
            </div>
            
            <div style={styles.grid2}>
              <div style={styles.card}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                  <MessageSquare style={{ color: '#f59e0b', marginRight: '0.75rem' }} size={32} />
                  <h3 style={{ fontSize: '1.5rem', fontWeight: '600', margin: 0 }}>Encuesta Anónima</h3>
                </div>
                <p style={{ color: '#6b7280', marginBottom: '1rem' }}>Comparte tu experiencia de forma completamente anónima. Tus respuestas nos ayudan a mejorar.</p>
                <button
                  onClick={() => setCurrentView('survey')}
                  style={styles.button}
                >
                  Responder Encuesta
                </button>
              </div>
              
              <div style={styles.card}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                  <Lock style={{ color: '#7c3aed', marginRight: '0.75rem' }} size={32} />
                  <h3 style={{ fontSize: '1.5rem', fontWeight: '600', margin: 0 }}>Área de Administración</h3>
                </div>
                <p style={{ color: '#6b7280', marginBottom: '1rem' }}>Acceso exclusivo para administradores para ver resultados y métricas detalladas.</p>
                <button
                  onClick={() => setCurrentView('login')}
                  style={styles.buttonPurple}
                >
                  Acceso Admin
                </button>
              </div>
            </div>

            <div style={styles.infoSection}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem', color: '#d97706' }}>¿Por qué es importante?</h3>
              <div style={styles.infoGrid}>
                <div style={styles.infoItem}>
                  <Users style={{ color: '#f59e0b', marginTop: '0.25rem' }} size={20} />
                  <div>
                    <strong>Anonimato garantizado:</strong> Tus respuestas son completamente confidenciales
                  </div>
                </div>
                <div style={styles.infoItem}>
                  <TrendingUp style={{ color: '#f59e0b', marginTop: '0.25rem' }} size={20} />
                  <div>
                    <strong>Mejora continua:</strong> Usamos tus comentarios para implementar cambios positivos
                  </div>
                </div>
                <div style={styles.infoItem}>
                  <Star style={{ color: '#f59e0b', marginTop: '0.25rem' }} size={20} />
                  <div>
                    <strong>Ambiente mejor:</strong> Juntos creamos un lugar de trabajo más satisfactorio
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'survey':
        return (
          <div style={styles.contentSmall}>
            <div style={styles.cardLarge}>
              <h2 style={{ fontSize: '1.875rem', fontWeight: 'bold', textAlign: 'center', marginBottom: '1.5rem', color: '#1f2937' }}>Encuesta Happy Day</h2>
              <p style={{ textAlign: 'center', color: '#6b7280', marginBottom: '1rem' }}>Tu respuesta es completamente anónima y confidencial</p>
              <p style={{ textAlign: 'center', color: '#dc2626', fontSize: '0.875rem', marginBottom: '2rem' }}>
                * Todas las preguntas son obligatorias
              </p>
              
              <div>
                <StarRating
                  label="1. ¿Qué tan satisfecho/a estás con tu trabajo en general?"
                  value={newResponse.satisfaccionGeneral}
                  onChange={handleSatisfaccionChange}
                  required={true}
                  hasError={validationErrors.satisfaccionGeneral}
                />
                
                <StarRating
                  label="2. ¿Cómo calificas la comunicación en tu equipo?"
                  value={newResponse.comunicacion}
                  onChange={handleComunicacionChange}
                  required={true}
                  hasError={validationErrors.comunicacion}
                />
                
                <StarRating
                  label="3. ¿Sientes que tu trabajo es reconocido y valorado?"
                  value={newResponse.reconocimiento}
                  onChange={handleReconocimientoChange}
                  required={true}
                  hasError={validationErrors.reconocimiento}
                />
                
                <StarRating
                  label="4. ¿Cómo es tu equilibrio entre vida personal y trabajo?"
                  value={newResponse.equilibrio}
                  onChange={handleEquilibrioChange}
                  required={true}
                  hasError={validationErrors.equilibrio}
                />
                
                <StarRating
                  label="5. ¿Qué tan satisfecho/a estás con las oportunidades de desarrollo?"
                  value={newResponse.desarrollo}
                  onChange={handleDesarrolloChange}
                  required={true}
                  hasError={validationErrors.desarrollo}
                />
                
                <StarRating
                  label="6. ¿Cómo calificas el ambiente laboral general?"
                  value={newResponse.ambiente}
                  onChange={handleAmbienteChange}
                  required={true}
                  hasError={validationErrors.ambiente}
                />
                
                <StarRating
                  label="7. ¿Qué tan efectivo consideras el liderazgo en tu área?"
                  value={newResponse.liderazgo}
                  onChange={handleLiderazgoChange}
                  required={true}
                  hasError={validationErrors.liderazgo}
                />
                
                <StarRating
                  label="8. ¿Tienes los recursos y herramientas necesarios para tu trabajo?"
                  value={newResponse.recursos}
                  onChange={handleRecursosChange}
                  required={true}
                  hasError={validationErrors.recursos}
                />
                
                <ControlledTextarea
                  id="comentarios-textarea"
                  value={newResponse.comentarios}
                  onChange={handleComentariosChange}
                  placeholder="Comparte cómo te sientes en tu trabajo actual..."
                  label="9. ¿Cómo te sientes en tu trabajo actualmente? (Opcional)"
                />
                
                <ControlledTextarea
                  id="mejoras-textarea"
                  value={newResponse.mejoras}
                  onChange={handleMejorasChange}
                  placeholder="Sugerencias para mejorar el ambiente laboral..."
                  label="10. ¿Qué mejorarías en la organización? (Opcional)"
                />
                
                <button
                  onClick={handleSubmit}
                  style={styles.buttonFull}
                >
                  <Send size={20} />
                  <span>Enviar Respuesta Anónima</span>
                </button>
              </div>
            </div>
          </div>
        );

      case 'login':
        return (
          <div style={styles.contentTiny}>
            <div style={styles.cardLarge}>
              <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <Lock style={{ color: '#f59e0b', margin: '0 auto 1rem auto' }} size={48} />
                <h2 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '0.5rem' }}>Acceso de Administrador</h2>
                <p style={{ color: '#6b7280' }}>Ingresa la contraseña para ver el dashboard</p>
              </div>
              
              <ControlledPasswordInput
                id="admin-password"
                value={adminPassword}
                onChange={handleAdminPasswordChange}
                placeholder="Ingresa la contraseña"
                label="Contraseña de Administrador"
                hasError={!!loginError}
                onKeyPress={handleKeyPress}
              />
              
              {loginError && (
                <div style={styles.errorAlert}>
                  <p style={{ color: '#dc2626', fontSize: '0.875rem', margin: 0 }}>{loginError}</p>
                </div>
              )}
              
              <button
                onClick={handleAdminLogin}
                style={styles.buttonFull}
              >
                Iniciar Sesión
              </button>
            </div>
          </div>
        );

      case 'settings':
        if (!isAdmin) return null;
        return (
          <div style={styles.contentSmall}>
            <div style={styles.cardLarge}>
              <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <Key style={{ color: '#f59e0b', margin: '0 auto 1rem auto' }} size={48} />
                <h2 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '0.5rem' }}>Configuración de Seguridad</h2>
                <p style={{ color: '#6b7280' }}>Cambia la contraseña de administrador</p>
              </div>
              
              <ControlledPasswordInput
                id="old-password"
                value={oldPassword}
                onChange={handleOldPasswordChange}
                placeholder="Ingresa tu contraseña actual"
                label="Contraseña Actual"
              />

              <ControlledPasswordInput
                id="new-password"
                value={newPassword}
                onChange={handleNewPasswordChange}
                placeholder="Mínimo 6 caracteres"
                label="Nueva Contraseña"
              />

              <ControlledPasswordInput
                id="confirm-password"
                value={confirmPassword}
                onChange={handleConfirmPasswordChange}
                placeholder="Repite la nueva contraseña"
                label="Confirmar Nueva Contraseña"
              />

              {passwordChangeError && (
                <div style={styles.errorAlert}>
                  <p style={{ color: '#dc2626', fontSize: '0.875rem', margin: 0 }}>{passwordChangeError}</p>
                </div>
              )}

              {passwordChangeSuccess && (
                <div style={styles.successAlert}>
                  <p style={{ color: '#16a34a', fontSize: '0.875rem', margin: 0 }}>{passwordChangeSuccess}</p>
                </div>
              )}
              
              <button
                onClick={handlePasswordChange}
                style={styles.buttonFull}
              >
                Cambiar Contraseña
              </button>

              <div style={{ ...styles.warningAlert, marginTop: '1.5rem' }}>
                <p style={{ fontSize: '0.875rem', color: '#92400e', margin: 0 }}>
                  <strong>Importante:</strong> Asegúrate de recordar la nueva contraseña. No hay forma de recuperarla si la olvidas.
                </p>
              </div>
            </div>
          </div>
        );

      case 'dashboard':
        if (!isAdmin) return null;
        return (
          <div style={styles.content}>
            <div style={styles.adminActions}>
              <div>
                <h2 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#1f2937', margin: 0 }}>Dashboard Happy Day</h2>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', backgroundColor: '#fef3c7', borderRadius: '0.5rem', marginTop: '0.5rem' }}>
                  <Lock size={16} style={{ color: '#d97706' }} />
                  <span style={{ fontSize: '0.875rem', color: '#d97706', fontWeight: '500' }}>Modo Administrador</span>
                </div>
              </div>
              
              {responses.length > 0 && (
                <button
                  onClick={() => setShowConfirmDialog(true)}
                  style={styles.buttonRed}
                >
                  <Trash2 size={20} />
                  <span>Limpiar Respuestas</span>
                </button>
              )}
            </div>
            
            {responses.length === 0 ? (
              <div style={styles.emptyState}>
                <Users size={64} style={{ color: '#d1d5db', margin: '0 auto 2rem auto' }} />
                <h3 style={{ fontSize: '1.5rem', fontWeight: '600', color: '#4b5563', marginBottom: '1rem' }}>
                  No hay respuestas aún
                </h3>
                <p style={{ fontSize: '1rem', color: '#6b7280', marginBottom: '2rem' }}>
                  Cuando los empleados completen la encuesta, sus respuestas aparecerán aquí.
                </p>
                <button
                  onClick={() => setCurrentView('survey')}
                  style={styles.button}
                >
                  Ir a la Encuesta
                </button>
              </div>
            ) : (
              <>
                <div style={styles.grid4}>
                  <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '0.5rem', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                      <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: 0 }}>Total Respuestas</p>
                      <p style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#f59e0b', margin: 0 }}>{responses.length}</p>
                    </div>
                    <Users style={{ color: '#f59e0b' }} size={32} />
                  </div>
                  
                  <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '0.5rem', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                      <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: 0 }}>Satisfacción Promedio</p>
                      <p style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#16a34a', margin: 0 }}>{stats.satisfaccionGeneral || '0'}/5</p>
                    </div>
                    <Star style={{ color: '#16a34a' }} size={32} />
                  </div>
                  
                  <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '0.5rem', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                      <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: 0 }}>Comunicación</p>
                      <p style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#ea580c', margin: 0 }}>{stats.comunicacion || '0'}/5</p>
                    </div>
                    <MessageSquare style={{ color: '#ea580c' }} size={32} />
                  </div>
                  
                  <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '0.5rem', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                      <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: 0 }}>Ambiente Laboral</p>
                      <p style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#7c3aed', margin: 0 }}>{stats.ambiente || '0'}/5</p>
                    </div>
                    <TrendingUp style={{ color: '#7c3aed' }} size={32} />
                  </div>
                </div>

                <div style={styles.gridChart}>
                  <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '0.5rem', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)' }}>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem' }}>Métricas por Categoría</h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} fontSize={12} />
                        <YAxis domain={[0, 5]} />
                        <Tooltip />
                        <Bar dataKey="value" fill="#f59e0b" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '0.5rem', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)' }}>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem' }}>Distribución de Satisfacción General</h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={satisfactionData}
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          dataKey="value"
                          
                        >
                          {satisfactionData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                    <div style={{ marginTop: '1rem', fontSize: '0.875rem' }}>
                      {satisfactionData.map((item, index) => (
                        <div key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: '0.25rem' }}>
                          <div style={{ width: '1rem', height: '1rem', marginRight: '0.5rem', backgroundColor: item.color }}></div>
                          <span>{item.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '0.5rem', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)' }}>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem' }}>Comentarios Recientes</h3>
                  <div>
                    {responses.slice(-5).reverse().map((response, index) => (
                      <div key={index} style={{ borderLeft: '4px solid #f59e0b', paddingLeft: '1rem', paddingTop: '0.5rem', paddingBottom: '0.5rem', marginBottom: '1rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <div style={{ flex: 1 }}>
                            {response.comentarios && (
                              <p style={{ color: '#374151', marginBottom: '0.5rem' }}>
                                <strong>Cómo se siente:</strong> "{response.comentarios}"
                              </p>
                            )}
                            {response.mejoras && (
                              <p style={{ color: '#374151', margin: 0 }}>
                                <strong>Sugerencias:</strong> "{response.mejoras}"
                              </p>
                            )}
                          </div>
                          <span style={{ fontSize: '0.875rem', color: '#6b7280', marginLeft: '1rem' }}>{response.fecha}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div style={styles.container}>
      {Navigation}
      {renderCurrentView()}
      <div style={styles.footer}>
        <p style={{ margin: 0, fontSize: '0.875rem' }}>By Ramon Villanueva - 2025</p>
      </div>
      <ConfirmDialog
        isOpen={showConfirmDialog}
        title="Confirmar Eliminación"
        message="¿Estás seguro de que quieres eliminar todas las respuestas? Esta acción no se puede deshacer."
        onConfirm={handleClearResponses}
        onCancel={() => setShowConfirmDialog(false)}
      />
    </div>
  );
}

export default App;
