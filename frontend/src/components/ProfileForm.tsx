import { useState, useEffect } from 'react';
import { CheckCircle2, AlertCircle, ChevronDown, Calendar } from 'lucide-react';
import { useAuth } from '../context/AuthContext'; // Para obtener los datos actuales

export default function ProfileForm({ onSuccess }: { onSuccess: () => void }) {
  const { user } = useAuth(); // Extraemos el perfil actual
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showConfirm, setShowConfirm] = useState(false); // Estado para la confirmación

  // 1. PERSISTENCIA: Inicializamos el estado con los datos del usuario si existen
  const [formData, setFormData] = useState({
    gender: '',
    dateOfBirth: '',
    heightCm: '',
  });

  useEffect(() => {
    if (user) {
      setFormData({
        gender: user.gender || '',
        // Formateamos la fecha ISO del backend (ej: 1994-01-01T00:00:00Z) a YYYY-MM-DD para el input type="date"
        dateOfBirth: user.dateOfBirth ? user.dateOfBirth.split('T')[0] : '',
        heightCm: user.heightCm ? user.heightCm.toString() : '',
      });
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setShowConfirm(false); // Si edita algo, quitamos la confirmación previa
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 2. DOBLE CONFIRMACIÓN: Si ya tenía datos y los está cambiando
    if (user?.gender && !showConfirm) {
      setShowConfirm(true);
      return;
    }

    setLoading(true);
    setError(null);

    if (!formData.gender || !formData.dateOfBirth) {
      setError('El género y la fecha de nacimiento son obligatorios para los cálculos.');
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3000/api/v1/profiles', {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          gender: formData.gender,
          dateOfBirth: new Date(formData.dateOfBirth).toISOString(),
          heightCm: formData.heightCm ? parseFloat(formData.heightCm) : null,
        })
      });

      if (!response.ok) throw new Error('Error al actualizar la ficha médica en Lugym');
      
      onSuccess(); 
    } catch (err) {
      if (err instanceof Error) setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="flex items-center gap-2 p-4 bg-red-500/10 border border-red-500/50 rounded-xl text-red-500 text-sm">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          {error}
        </div>
      )}

      {/* SELECT DE GÉNERO MEJORADO */}
      <div>
        <label className="block text-sm font-medium text-gray-400 mb-2">Género Biológico (Fórmulas)</label>
        <div className="relative">
          <select
            name="gender" required
            value={formData.gender} onChange={handleChange}
            // appearance-none quita la flecha nativa, pr-10 da espacio para nuestro icono
            className="w-full bg-gray-900 border border-gray-700 rounded-xl p-3 pr-10 text-white focus:border-primary outline-none transition-all cursor-pointer appearance-none"
          >
            <option value="" disabled>Selecciona una opción</option>
            <option value="MASCULINO">Masculino</option>
            <option value="FEMENINO">Femenino</option>
          </select>
          <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 pointer-events-none" />
        </div>
      </div>

      {/* DATE PICKER MEJORADO */}
      <div>
        <label className="block text-sm font-medium text-gray-400 mb-2">Fecha de Nacimiento</label>
        <div className="relative">
          <input
            type="date" name="dateOfBirth" required
            value={formData.dateOfBirth} onChange={handleChange}
            // Escondemos el icono nativo del calendario, pero lo hacemos tan ancho como el input para que siga abriendo al hacer clic en cualquier parte
            className="w-full bg-gray-900 border border-gray-700 rounded-xl p-3 pr-10 text-white focus:border-primary outline-none transition-all [color-scheme:dark] cursor-pointer appearance-none [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:cursor-pointer"
          />
          <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 pointer-events-none" />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-400 mb-2">Estatura (cm)</label>
        <input
          type="number" step="0.1" name="heightCm"
          value={formData.heightCm} onChange={handleChange}
          placeholder="Ej: 175"
          className="w-full bg-gray-900 border border-gray-700 rounded-xl p-3 text-white focus:border-primary outline-none transition-all"
        />
      </div>

      {showConfirm && (
        <div className="p-4 bg-yellow-500/10 border border-yellow-500/50 rounded-xl text-yellow-500 text-sm text-center font-medium">
          ¿Estás seguro de modificar estos datos? Esto afectará futuros cálculos de grasa corporal. Haz clic en guardar nuevamente para confirmar.
        </div>
      )}

      <div className="pt-4 border-t border-gray-800">
        <button
          type="submit" disabled={loading}
          className={`w-full h-14 font-bold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed
            ${showConfirm ? 'bg-yellow-500 hover:bg-yellow-400 text-bg-dark' : 'bg-primary hover:bg-primary-hover text-bg-dark shadow-lg shadow-primary/10'}`}
        >
          {loading ? 'Guardando Perfil...' : showConfirm ? 'Confirmar Cambios' : 'Guardar Ficha Médica'}
          {!loading && <CheckCircle2 className="w-5 h-5" />}
        </button>
      </div>
    </form>
  );
}