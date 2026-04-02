import { useState, useEffect } from 'react';
import { Scale, CheckCircle2, AlertCircle, Edit3, PlusCircle, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type Protocol = 'JP3' | 'JP7' | 'DW4';
type FormMode = 'CREATE' | 'UPDATE';

export interface MeasurementData {
  id?: string;
  weightKg?: number;
  pectoralFold?: number;
  abdominalFold?: number;
  thighFold?: number;
  tricepFold?: number;
  subscapularFold?: number;
  suprailiacFold?: number;
  midaxillaryFold?: number;
  bicepFold?: number;
  formulaUsed?: string;
}

export default function MeasurementForm({ 
  onSuccess, 
  initialData 
}: { 
  onSuccess: () => void;
  initialData?: MeasurementData | null; 
}) {
  
  const [protocol, setProtocol] = useState<Protocol>('JP3');
  const [mode, setMode] = useState<FormMode>('CREATE'); 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    weightKg: '',
    chest: '',
    abdominals: '',
    thigh: '',
    triceps: '',
    subscapular: '',
    suprailiac: '',
    midaxillary: '',
    bicep: '',
  });

  // 🟢 FUNCIÓN PARA RESTAURAR DATOS (Cuando elige "Corregir")
  const restoreData = () => {
    if (initialData) {
      setFormData({
        weightKg: initialData.weightKg?.toString() || '',
        chest: initialData.pectoralFold?.toString() || '',
        abdominals: initialData.abdominalFold?.toString() || '',
        thigh: initialData.thighFold?.toString() || '',
        triceps: initialData.tricepFold?.toString() || '',
        subscapular: initialData.subscapularFold?.toString() || '',
        suprailiac: initialData.suprailiacFold?.toString() || '',
        midaxillary: initialData.midaxillaryFold?.toString() || '',
        bicep: initialData.bicepFold?.toString() || '',
      });
    }
  };

  // 🟢 FUNCIÓN PARA LIMPIAR DATOS (Cuando elige "Nuevo Control")
  const clearData = () => {
    setFormData({
      weightKg: '', chest: '', abdominals: '', thigh: '', 
      triceps: '', subscapular: '', suprailiac: '', midaxillary: '', bicep: ''
    });
  };

  // Efecto inicial al abrir el modal
  useEffect(() => {
    if (initialData) {
      if (initialData.formulaUsed === 'JACKSON_POLLOCK_7') setProtocol('JP7');
      else if (initialData.formulaUsed === 'DURNIN_WOMERSLEY_4') setProtocol('DW4');
      else setProtocol('JP3');
      
      if (initialData.id) {
        setMode('UPDATE');
        restoreData(); // Cargamos los datos por defecto porque asume edición
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      
      const payload = {
        formulaUsed: protocol,
        weightKg: parseFloat(formData.weightKg) || undefined,
        tricepFold: parseFloat(formData.triceps) || undefined,
        pectoralFold: parseFloat(formData.chest) || undefined,
        abdominalFold: parseFloat(formData.abdominals) || undefined,
        thighFold: parseFloat(formData.thigh) || undefined,
        subscapularFold: parseFloat(formData.subscapular) || undefined,
        suprailiacFold: parseFloat(formData.suprailiac) || undefined,
        midaxillaryFold: parseFloat(formData.midaxillary) || undefined,
        bicepFold: parseFloat(formData.bicep) || undefined,
      };

      const isUpdating = mode === 'UPDATE' && initialData?.id;
      const url = isUpdating 
        ? `http://localhost:3000/api/v1/measurements/${initialData.id}` 
        : 'http://localhost:3000/api/v1/measurements';
      const fetchMethod = isUpdating ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method: fetchMethod,
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Error al guardar la medición');
      }
      
      onSuccess(); 
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Ocurrió un error inesperado.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      
      {initialData?.id && (
        <div className="bg-gray-900/50 p-2 rounded-xl border border-gray-800 mb-6">
          <p className="text-xs text-gray-500 text-center mb-2 uppercase tracking-wider font-semibold">¿Qué deseas hacer?</p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => {
                setMode('UPDATE');
                restoreData(); // 🟢 Recupera los datos si regresa a Editar
              }}
              className={`flex-1 py-2 px-2 rounded-lg text-xs md:text-sm font-bold transition-all flex items-center justify-center gap-2 ${mode === 'UPDATE' ? 'bg-yellow-500 text-bg-dark shadow-lg' : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800'}`}
            >
              <Edit3 className="w-4 h-4" /> Corregir Error
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('CREATE');
                clearData(); // 🟢 Limpia todo el formulario para un nuevo control
              }}
              className={`flex-1 py-2 px-2 rounded-lg text-xs md:text-sm font-bold transition-all flex items-center justify-center gap-2 ${mode === 'CREATE' ? 'bg-primary text-bg-dark shadow-lg' : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800'}`}
            >
              <PlusCircle className="w-4 h-4" /> Nuevo Control
            </button>
          </div>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-400 mb-2">Protocolo de Medición</label>
        <div className="relative">
          <select
            value={protocol}
            onChange={(e) => setProtocol(e.target.value as Protocol)}
            className="w-full bg-gray-900 border border-gray-700 rounded-xl p-3 pr-10 text-white focus:border-primary outline-none transition-all cursor-pointer appearance-none"
          >
            <option value="JP3">Jackson & Pollock (3 Pliegues) - Rápido</option>
            <option value="JP7">Jackson & Pollock (7 Pliegues) - Pro/Atletas</option>
            <option value="DW4">Durnin & Womersley (4 Pliegues) - General</option>
          </select>
          <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 pointer-events-none" />
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-4 bg-red-500/10 border border-red-500/50 rounded-xl text-red-500 text-sm">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          {error}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-400 mb-2">Peso Actual (kg)</label>
        <div className="relative">
          <Scale className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
          <input
            type="number" step="0.1" name="weightKg" required
            value={formData.weightKg} onChange={handleChange}
            className="w-full bg-gray-900 border border-gray-700 rounded-xl py-3 pl-10 pr-4 text-white focus:border-primary outline-none transition-all"
            placeholder="Ej: 75.5"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <AnimatePresence mode="popLayout">
          {(protocol === 'JP3' || protocol === 'JP7') && (
            <>
              <motion.div key="chest" layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <InputField label="Pecho" name="chest" value={formData.chest} onChange={handleChange} />
              </motion.div>
              <motion.div key="abdominals" layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <InputField label="Abdomen" name="abdominals" value={formData.abdominals} onChange={handleChange} />
              </motion.div>
              <motion.div key="thigh" layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <InputField label="Muslo" name="thigh" value={formData.thigh} onChange={handleChange} />
              </motion.div>
            </>
          )}

          {(protocol === 'JP7' || protocol === 'DW4') && (
            <>
              <motion.div key="triceps" layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <InputField label="Tríceps" name="triceps" value={formData.triceps} onChange={handleChange} />
              </motion.div>
              <motion.div key="subscapular" layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <InputField label="Subescapular" name="subscapular" value={formData.subscapular} onChange={handleChange} />
              </motion.div>
              <motion.div key="suprailiac" layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <InputField label="Suprailíaco" name="suprailiac" value={formData.suprailiac} onChange={handleChange} />
              </motion.div>
            </>
          )}

          {protocol === 'DW4' && (
            <motion.div key="bicep" layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <InputField label="Bíceps" name="bicep" value={formData.bicep} onChange={handleChange} />
            </motion.div>
          )}

          {protocol === 'JP7' && (
            <motion.div key="midaxillary" layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <InputField label="Axilar Medio" name="midaxillary" value={formData.midaxillary} onChange={handleChange} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="pt-4 border-t border-gray-800">
        <button
          type="submit"
          disabled={loading}
          className={`w-full h-14 font-bold rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
            mode === 'UPDATE' ? 'bg-yellow-500 hover:bg-yellow-400 text-bg-dark' : 'bg-primary hover:bg-primary-hover text-bg-dark shadow-primary/10'
          }`}
        >
          {loading ? 'Procesando...' : mode === 'UPDATE' ? 'Actualizar' : 'Registrar Medición'}
          {!loading && <CheckCircle2 className="w-5 h-5" />}
        </button>
      </div>
    </form>
  );
}

interface InputFieldProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

function InputField({ label, name, value, onChange }: InputFieldProps) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 ml-1">{label} (mm)</label>
      <input
        type="number" step="0.1" name={name} required
        value={value} onChange={onChange}
        className="w-full bg-gray-900 border border-gray-700 rounded-xl p-3 text-white focus:border-primary outline-none transition-colors"
        placeholder="0"
      />
    </div>
  );
}