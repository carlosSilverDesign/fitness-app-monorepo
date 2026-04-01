import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
// Quitamos LogOut del import porque lo borramos del header
import { Activity, Scale, Target, User, ChevronRight, Dumbbell } from 'lucide-react';
import SEO from '../components/SEO';
import { useAuth } from '../context/AuthContext'; // 1. IMPORTAR CONTEXTO

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, checkAuth } = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Si no está autenticado, lo mandamos al login (Guardia Frontend)
    if (!localStorage.getItem('token')) {
      navigate('/login');
    } else {
      checkAuth().then(() => setIsLoading(false));
    }
  }, [navigate, checkAuth]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-bg-dark flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <main className="bg-bg-dark min-h-screen pb-12 selection:bg-primary selection:text-white">
      <SEO title="Mi Panel | Coach Lucy" description="Tu centro de control de evolución física." />

      <header className="bg-bg-card border-b border-gray-800 pt-8 pb-6 px-4 md:px-8">
        <div className="max-w-6xl mx-auto flex justify-between items-center gap-4">
          {/* 🟢 3. EL NOMBRE DEL USUARIO APARECE AQUÍ */}
          <div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">
              Hola, {user?.firstName || 'Atleta'} 👋
            </h1>
            <p className="text-gray-400 mt-1">Este es tu resumen de evolución física.</p>
          </div>
          {/* 🔴 BORRAMOS EL BOTÓN DE CERRAR SESIÓN DEL HEADER (Ya está en el Nav) */}
        </div>
      </header>
      
      {/* Contenido Principal Grid */}
      <div className="max-w-6xl mx-auto px-4 md:px-8 mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* COLUMNA IZQUIERDA: Resultados Desbloqueados */}
        <div className="lg:col-span-2 space-y-6">
          
          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-bg-card rounded-card p-6 md:p-8 border border-gray-800 shadow-xl"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Activity className="w-6 h-6 text-primary" />
                Tu Composición Corporal
              </h2>
              <span className="text-xs font-medium bg-gray-800 text-gray-300 px-3 py-1 rounded-full">Última medida: Hoy</span>
            </div>

            {/* Aquí están los datos que prometimos desbloquear */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-gray-900 rounded-2xl p-4 border border-gray-800 text-center">
                <p className="text-gray-400 text-sm mb-1">Grasa Corporal</p>
                <p className="text-3xl font-extrabold text-white">15.2<span className="text-lg text-primary">%</span></p>
              </div>
              <div className="bg-gray-900 rounded-2xl p-4 border border-gray-800 text-center">
                <p className="text-gray-400 text-sm mb-1">Masa Magra</p>
                <p className="text-3xl font-extrabold text-white">65.8<span className="text-lg text-gray-500"> kg</span></p>
              </div>
              <div className="bg-gray-900 rounded-2xl p-4 border border-gray-800 text-center">
                <p className="text-gray-400 text-sm mb-1">Masa Grasa</p>
                <p className="text-3xl font-extrabold text-white">11.8<span className="text-lg text-gray-500"> kg</span></p>
              </div>
            </div>

            <button className="w-full bg-gray-800 hover:bg-gray-700 text-white font-semibold py-3 rounded-xl transition-colors flex items-center justify-center gap-2">
              <Scale className="w-5 h-5" />
              Ingresar Nueva Medición
            </button>
          </motion.section>

          {/* TEASER: El Módulo de Rutinas (Próximamente) */}
          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-br from-gray-900 to-bg-card rounded-card p-6 md:p-8 border border-primary/20 shadow-xl relative overflow-hidden"
          >
            <div className="absolute -right-6 -top-6 text-primary/10">
              <Dumbbell className="w-48 h-48 rotate-12" />
            </div>
            <div className="relative z-10">
              <span className="inline-block bg-primary/20 text-primary text-xs font-bold px-3 py-1 rounded-full mb-3 uppercase tracking-wider">Próximamente</span>
              <h2 className="text-2xl font-bold text-white mb-2">Tus Rutinas Personalizadas</h2>
              <p className="text-gray-400 max-w-md mb-6">
                Coach Lucy está diseñando tu plan de entrenamiento basado en tu composición corporal actual. Pronto podrás ver tus ejercicios aquí.
              </p>
              <button disabled className="bg-gray-800 text-gray-500 font-semibold py-3 px-6 rounded-xl cursor-not-allowed">
                Módulo Bloqueado
              </button>
            </div>
          </motion.section>

        </div>

        {/* COLUMNA DERECHA: Perfil y Objetivos */}
        <div className="space-y-6">
          <motion.section 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
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
              <button className="w-full flex items-center justify-between group mt-2 pt-2">
                <span className="text-gray-300 group-hover:text-white transition-colors">Completar Ficha Médica</span>
                <ChevronRight className="w-5 h-5 text-gray-500 group-hover:text-primary transition-colors" />
              </button>
              <button className="w-full flex items-center justify-between group">
                <span className="text-gray-300 group-hover:text-white transition-colors">Actualizar Objetivos</span>
                <ChevronRight className="w-5 h-5 text-gray-500 group-hover:text-primary transition-colors" />
              </button>
            </div>
          </motion.section>

          <motion.section 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-bg-card rounded-card p-6 border border-gray-800 shadow-xl"
          >
            <h2 className="text-lg font-bold text-white flex items-center gap-2 mb-4">
              <Target className="w-5 h-5 text-primary" />
              Asesoría Premium
            </h2>
            <p className="text-sm text-gray-400 mb-4">
              ¿Quieres llevar tus resultados al siguiente nivel con seguimiento semanal 1 a 1?
            </p>
            <button className="w-full bg-primary hover:bg-primary-hover text-bg-dark font-bold py-3 rounded-xl transition-colors">
              Ver Planes de Coach Lucy
            </button>
          </motion.section>
        </div>

      </div>
    </main>
  );
}