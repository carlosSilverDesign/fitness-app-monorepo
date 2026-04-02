import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Scale, Target, User, ChevronRight, Dumbbell, X } from 'lucide-react';
import SEO from '../components/SEO';
import { useAuth } from '../context/AuthContext';
import MeasurementForm from '../components/MeasurementForm';
import ProfileForm from '../components/ProfileForm';

export interface MeasurementData {
  id: string;
  date?: string;
  createdAt: string;
  weightKg: number;
  bodyFatPercentage?: number;
  fatMassKg?: number;
  fatFreeMassKg?: number;
  formulaUsed?: string;
  bodyDensity?: number;
  // Pliegues
  tricepFold?: number;
  pectoralFold?: number;
  abdominalFold?: number;
  thighFold?: number;
  subscapularFold?: number;
  suprailiacFold?: number;
  midaxillaryFold?: number;
}

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, checkAuth } = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  // Estados de los Modales
  const [isMeasurementModalOpen, setIsMeasurementModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isGoalsModalOpen, setIsGoalsModalOpen] = useState(false); // 🟢 NUEVO: Controla el modal de objetivos

  // 🟢 ESTADO PARA LAS MÉTRICAS REALES (Tarjetas superiores)
  const [metrics, setMetrics] = useState({
    bodyFat: 0,
    leanMass: 0,
    fatMass: 0,
    lastDate: 'Sin medidas'
  });

  // 🟢 NUEVO: ESTADO PARA EL HISTORIAL COMPLETO
  const [allMeasurements, setAllMeasurements] = useState<MeasurementData[]>([]);

  // 🟢 FUNCIÓN PARA TRAER LOS DATOS DEL BACKEND
  const fetchMeasurements = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3000/api/v1/measurements', {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        // El backend devuelve { measurements: [...] }
        const measurementsArray = data.measurements || [];

        // 🟢 ALIMENTAMOS LA TABLA: Guardamos todo el historial aquí
        setAllMeasurements(measurementsArray);

        // ALIMENTAMOS LAS TARJETAS: Tomamos solo el más reciente para arriba
        if (measurementsArray.length > 0) {
          const latest = measurementsArray[0];
          setMetrics({
            bodyFat: latest.bodyFatPercentage || 0,
            leanMass: latest.fatFreeMassKg || 0,
            fatMass: latest.fatMassKg || 0,
            lastDate: new Date(latest.date || latest.createdAt).toLocaleDateString('es-ES', { day: '2-digit', month: 'short' })
          });
        } else {
          // Si el arreglo viene vacío, reseteamos a ceros
          setMetrics({ bodyFat: 0, leanMass: 0, fatMass: 0, lastDate: 'Sin medidas' });
        }
      }
    } catch (error) {
      console.error("Error al obtener las métricas de Lugym:", error);
    }
  }, []);

  // Flujo de carga inicial
  useEffect(() => {
    if (!localStorage.getItem('token')) {
      navigate('/login');
    } else {
      checkAuth().then(() => {
        fetchMeasurements().then(() => setIsLoading(false));
      });
    }
  }, [navigate, checkAuth, fetchMeasurements]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-bg-dark flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    // 🟢 SOLUCIÓN AL NAV: Agregamos pt-28 aquí directamente. ¡Nunca más chocará!
    <main className="bg-bg-dark min-h-screen pb-12 selection:bg-primary selection:text-white">
      <SEO title="Mi Panel | Lugym by Coach Lucy" description="Tu centro de control de evolución física." />

      <header className="bg-bg-card border-b border-gray-800 pt-8 pb-6 px-4 md:px-8">
        <div className="max-w-6xl mx-auto flex justify-between items-center gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">
              Hola, {user?.firstName || 'Atleta'} 👋
            </h1>
            <p className="text-gray-400 mt-1">Bienvenido a tu panel de control en Lugym.</p>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 md:px-8 mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* COLUMNA IZQUIERDA */}
        <div className="lg:col-span-2 space-y-6">
          <motion.section
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="bg-bg-card rounded-card p-6 md:p-6 border border-gray-800 shadow-xl"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Activity className="w-6 h-6 text-primary" />
                Tu Composición Corporal
              </h2>
              <span className="text-xs font-medium bg-gray-800 text-gray-300 px-3 py-1 rounded-full">
                Última medida: {metrics.lastDate}
              </span>
            </div>

            {/* 🟢 MOSTRAMOS LOS DATOS REALES DE LA BASE DE DATOS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-gray-900 rounded-2xl p-4 border border-gray-800 text-center">
                <p className="text-gray-400 text-sm mb-1">Grasa Corporal</p>
                <p className="text-3xl font-extrabold text-white">
                  {metrics.bodyFat.toFixed(1)}<span className="text-lg text-primary">%</span>
                </p>
              </div>
              <div className="bg-gray-900 rounded-2xl p-4 border border-gray-800 text-center">
                <p className="text-gray-400 text-sm mb-1">Masa Magra</p>
                <p className="text-3xl font-extrabold text-white">
                  {metrics.leanMass.toFixed(1)}<span className="text-lg text-gray-500"> kg</span>
                </p>
              </div>
              <div className="bg-gray-900 rounded-2xl p-4 border border-gray-800 text-center">
                <p className="text-gray-400 text-sm mb-1">Masa Grasa</p>
                <p className="text-3xl font-extrabold text-white">
                  {metrics.fatMass.toFixed(1)}<span className="text-lg text-gray-500"> kg</span>
                </p>
              </div>
            </div>

            {metrics.lastDate !== 'Sin medidas' && (
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="mb-6 p-4 bg-gray-900/50 rounded-xl border border-gray-800"
              >
                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-4">Detalle Científico</h3>
                <div className="grid grid-cols-2 md:grid-cols-[1.5fr_1fr_1fr_1fr] gap-4">
                  <div className="min-w-0">
                    <p className="text-xs text-gray-500">Fórmula</p>
                    <p
                      className="text-white font-medium text-sm truncate"
                      title={allMeasurements[0]?.formulaUsed?.replace(/_/g, ' ')}
                    >
                      {allMeasurements[0]?.formulaUsed?.replace(/_/g, ' ')}
                    </p>
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-gray-500">Densidad (Db)</p>
                    <p className="text-white font-medium text-sm">{allMeasurements[0]?.bodyDensity?.toFixed(4)} g/cc</p>
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-gray-500">Peso en Medición</p>
                    <p className="text-white font-medium text-sm">{allMeasurements[0]?.weightKg} kg</p>
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-gray-500">Suma de Pliegues</p>
                    <p className="text-white font-medium text-sm">
                      {((allMeasurements[0]?.tricepFold || 0) +
                        (allMeasurements[0]?.pectoralFold || 0) +
                        (allMeasurements[0]?.abdominalFold || 0) +
                        (allMeasurements[0]?.thighFold || 0) +
                        (allMeasurements[0]?.subscapularFold || 0) +
                        (allMeasurements[0]?.suprailiacFold || 0) +
                        (allMeasurements[0]?.midaxillaryFold || 0)).toFixed(1)} mm
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            <button
              onClick={() => setIsMeasurementModalOpen(true)}
              className="w-full bg-gray-800 hover:bg-gray-700 text-white font-semibold py-3 rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <Scale className="w-5 h-5" />
              Ingresar Nueva Medición
            </button>
          </motion.section>

          {/* 🟢 NUEVA SECCIÓN: HISTORIAL RÁPIDO */}
          <div className="mt-8">
            <h3 className="text-lg font-bold text-white mb-4">Historial Reciente</h3>
            <div className="space-y-3">
              {/* Aquí mapearemos las mediciones que vienen del backend */}
              {isLoading ? (
                <p className="text-gray-500">Cargando historial...</p>
              ) : (
                /* Suponiendo que tienes un estado llamado 'allMeasurements' o similar */
                <div className="bg-bg-card border border-gray-800 rounded-xl overflow-hidden">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-gray-900 text-gray-400 uppercase text-xs">
                      <tr>
                        <th className="px-4 py-3">Fecha</th>
                        <th className="px-4 py-3">Peso</th>
                        <th className="px-4 py-3">% Grasa</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800">
                      {allMeasurements.length === 0 ? (
                        <tr>
                          <td colSpan={3} className="px-4 py-8 text-center text-gray-500">
                            Aún no tienes mediciones registradas.
                          </td>
                        </tr>
                      ) : (
                        // Mostramos solo las últimas 5 para no hacer la tabla gigante
                        allMeasurements.slice(0, 5).map((med, index) => (
                          <tr key={med.id || index} className="text-gray-300 hover:bg-gray-800/50 transition-colors">
                            <td className="px-4 py-3">
                              {new Date(med.date || med.createdAt).toLocaleDateString('es-ES', { day: '2-digit', month: 'short' })}
                            </td>
                            <td className="px-4 py-3">{med.weightKg} kg</td>
                            <td className="px-4 py-3 font-medium">
                              {med.bodyFatPercentage ? `${med.bodyFatPercentage.toFixed(1)} %` : '-- %'}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          {/* ... (Sección de Rutinas se mantiene igual) ... */}
          <motion.section
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="bg-gradient-to-br from-gray-900 to-bg-card rounded-card p-6 md:p-8 border border-primary/20 shadow-xl relative overflow-hidden"
          >
            <div className="absolute -right-6 -top-6 text-primary/10">
              <Dumbbell className="w-48 h-48 rotate-12" />
            </div>
            <div className="relative z-10">
              <span className="inline-block bg-primary/20 text-primary text-xs font-bold px-3 py-1 rounded-full mb-3 uppercase tracking-wider">Próximamente</span>
              <h2 className="text-2xl font-bold text-white mb-2">Tus Rutinas Lugym</h2>
              <p className="text-gray-400 max-w-md mb-6">
                Coach Lucy está diseñando tu plan de entrenamiento. Pronto podrás ver tus ejercicios aquí.
              </p>
              <button disabled className="bg-gray-800 text-gray-500 font-semibold py-3 px-6 rounded-xl cursor-not-allowed">
                Módulo Bloqueado
              </button>
            </div>
          </motion.section>

        </div>

        {/* COLUMNA DERECHA */}
        <div className="space-y-6">
          {/* ... (Sección de Perfil se mantiene igual) ... */}
          <motion.section
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
            className="bg-bg-card rounded-card p-6 border border-gray-800 shadow-xl"
          >
            <h2 className="text-lg font-bold text-white flex items-center gap-2 mb-6">
              <User className="w-5 h-5 text-primary" />
              Tu Perfil
            </h2>

            <div className="space-y-4">
              <div className="flex justify-between items-center border-b border-gray-800 pb-3">
                <span className="text-gray-400">Estado</span>
                <span className="bg-emerald-500/10 text-emerald-500 px-2 py-0.5 rounded text-sm font-semibold">Activo</span>
              </div>
              <div className="flex justify-between items-center border-b border-gray-800 pb-3">
                <span className="text-gray-400">Plan</span>
                <span className="text-white font-medium">Básico (Gratis)</span>
              </div>
              <button onClick={() => setIsProfileModalOpen(true)} className="w-full flex items-center justify-between group mt-2 pt-2 cursor-pointer">
                <span className="text-gray-300 group-hover:text-white transition-colors">Completar Ficha Médica</span>
                <ChevronRight className="w-5 h-5 text-gray-500 group-hover:text-primary transition-colors" />
              </button>
              <button onClick={() => setIsGoalsModalOpen(true)} className="w-full flex items-center justify-between group cursor-pointer">
                <span className="text-gray-300 group-hover:text-white transition-colors">Actualizar Objetivos</span>
                <ChevronRight className="w-5 h-5 text-gray-500 group-hover:text-primary transition-colors" />
              </button>
            </div>
          </motion.section>

          {/* ... (Sección Premium se mantiene igual) ... */}
          <motion.section
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}
            className="bg-bg-card rounded-card p-6 border border-gray-800 shadow-xl"
          >
            <h2 className="text-lg font-bold text-white flex items-center gap-2 mb-4">
              <Target className="w-5 h-5 text-primary" />
              Asesoría Premium
            </h2>
            <p className="text-sm text-gray-400 mb-4">
              ¿Quieres llevar tus resultados al siguiente nivel con el seguimiento 1 a 1 de Coach Lucy?
            </p>
            <button
              onClick={() => navigate('/planes')}
              className="w-full bg-primary hover:bg-primary-hover text-bg-dark font-bold py-3 rounded-xl transition-colors cursor-pointer"
            >
              Ver Planes de Coach Lucy
            </button>
          </motion.section>
        </div>
      </div>

      <AnimatePresence>

        {/* MODAL DE MEDICIÓN ACTUALIZADO */}
        {isMeasurementModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="bg-bg-card w-full max-w-2xl rounded-2xl border border-gray-800 shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
            >
              <div className="sticky top-0 bg-bg-card z-10 flex justify-between items-center p-6 border-b border-gray-800">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <Scale className="w-5 h-5 text-primary" /> Ingresar Medición
                </h3>
                <button onClick={() => setIsMeasurementModalOpen(false)} className="text-gray-400 hover:text-white cursor-pointer">
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="p-6">
                <p className="text-gray-400 mb-4">Selecciona tu protocolo y anota tus pliegues cutáneos.</p>
                {/* 🟢 LA CONEXIÓN MAESTRA: Le pasamos la medida más reciente (índice 0) */}
                <MeasurementForm
                  initialData={allMeasurements.length > 0 ? allMeasurements[0] : null}
                  onSuccess={() => {
                    setIsMeasurementModalOpen(false);
                    fetchMeasurements(); // Recarga los datos en tiempo real
                  }}
                />
              </div>
            </motion.div>
          </div>
        )}

        {/* MODAL 2: FICHA MÉDICA Y OBJETIVOS */}
        {isProfileModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="bg-bg-card w-full max-w-md rounded-2xl border border-gray-800 shadow-2xl overflow-hidden"
            >
              <div className="flex justify-between items-center p-6 border-b border-gray-800">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <User className="w-5 h-5 text-primary" /> Ficha Médica
                </h3>
                <button onClick={() => setIsProfileModalOpen(false)} className="text-gray-400 hover:text-white cursor-pointer">
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="p-6">
                {/* 🟢 LLAMAMOS AL NUEVO FORMULARIO */}
                <ProfileForm
                  onSuccess={() => {
                    setIsProfileModalOpen(false);
                    checkAuth(); // Refrescamos la info del usuario
                  }}
                />
              </div>
            </motion.div>
          </div>
        )}

        {/* MODAL 3: OBJETIVOS */}
        {isGoalsModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="bg-bg-card w-full max-w-md rounded-2xl border border-gray-800 shadow-2xl overflow-hidden"
            >
              <div className="flex justify-between items-center p-6 border-b border-gray-800">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <Target className="w-5 h-5 text-primary" /> Mis Objetivos
                </h3>
                <button onClick={() => setIsGoalsModalOpen(false)} className="text-gray-400 hover:text-white cursor-pointer">
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="p-6">
                <div className="bg-gray-900 p-8 rounded-xl border border-gray-800 text-center border-dashed">
                  <p className="text-primary font-medium">Aquí irán tus metas (Ganar músculo, perder grasa, etc.)</p>
                  <button onClick={() => setIsGoalsModalOpen(false)} className="mt-4 bg-gray-800 text-white px-4 py-2 rounded-lg">Cerrar</button>
                </div>
              </div>
            </motion.div>
          </div>
        )}

      </AnimatePresence>
    </main>
  );
}