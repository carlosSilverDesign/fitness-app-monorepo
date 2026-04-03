import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Lock, User, Scale, Activity, ChevronLeft, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
// 🟢 1. IMPORTAMOS TU CONTEXTO DE AUTENTICACIÓN
import { useAuth } from '../context/AuthContext'; // Ajusta la ruta si es necesario

// Tipos para nuestro estado local
type Gender = 'MASCULINO' | 'FEMENINO' | null;
type CalculatorData = {
  gender: Gender;
  age: number | '';
  weightKg: number | '';
  fold1: number | ''; // Pecho (H) o Tríceps (M)
  fold2: number | ''; // Abdomen (H) o Suprailíaco (M)
  fold3: number | ''; // Muslo (Ambos)
};

export default function Calculator() {
  const navigate = useNavigate();
  // 🟢 2. EXTRAEMOS EL ESTADO DEL USUARIO
  const { isAuthenticated } = useAuth(); 
  
  const [step, setStep] = useState(1);
  const [resultBF, setResultBF] = useState<number | null>(null);
  
  // 🟢 3. NUEVOS ESTADOS PARA LOS CÁLCULOS COMPLETOS Y GUARDADO
  const [masses, setMasses] = useState<{ lean: number | null, fat: number | null }>({ lean: null, fat: null });
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const [data, setData] = useState<CalculatorData>({
    gender: null, age: '', weightKg: '', fold1: '', fold2: '', fold3: ''
  });

  const handleChange = (field: keyof CalculatorData, value: number | string) => {
    setData(prev => ({ ...prev, [field]: value }));
  };

  const calculateResult = () => {
    const { gender, age, fold1, fold2, fold3, weightKg } = data;
    if (!gender || !age || !fold1 || !fold2 || !fold3 || !weightKg) return;

    const sum3 = Number(fold1) + Number(fold2) + Number(fold3);
    const ageNum = Number(age);
    const weightNum = Number(weightKg);
    let db = 0;

    if (gender === 'MASCULINO') {
      db = 1.10938 - (0.0008267 * sum3) + (0.0000016 * Math.pow(sum3, 2)) - (0.0002574 * ageNum);
    } else {
      db = 1.0994921 - (0.0009929 * sum3) + (0.0000023 * Math.pow(sum3, 2)) - (0.0001392 * ageNum);
    }

    // Cálculos de Composición
    const bodyFat = (495 / db) - 450;
    const finalBF = parseFloat(bodyFat.toFixed(1));
    const fatMass = (weightNum * finalBF) / 100;
    const leanMass = weightNum - fatMass;

    setResultBF(finalBF);
    setMasses({ lean: parseFloat(leanMass.toFixed(1)), fat: parseFloat(fatMass.toFixed(1)) });
    setStep(3); 
  };

  // 🟢 4. FUNCIÓN PARA GUARDAR EN LA BASE DE DATOS (Solo para logueados)
  const handleSaveToDashboard = async () => {
    setIsSaving(true);
    try {
      const token = localStorage.getItem('token');
      // Mapeamos dinámicamente los pliegues según el género para la fórmula JP3
      const payload = {
        formulaUsed: 'JP3',
        weightKg: Number(data.weightKg),
        thighFold: Number(data.fold3),
        ...(data.gender === 'MASCULINO' 
          ? { pectoralFold: Number(data.fold1), abdominalFold: Number(data.fold2) }
          : { tricepFold: Number(data.fold1), suprailiacFold: Number(data.fold2) })
      };

      const response = await fetch('http://localhost:3000/api/v1/measurements', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        setSaveSuccess(true);
        setTimeout(() => navigate('/dashboard'), 1500); // Redirige al dashboard tras el éxito
      }
    } catch (error) {
      console.error("Error al guardar:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const slideVariants = {
    enter: { x: 50, opacity: 0 },
    center: { x: 0, opacity: 1 },
    exit: { x: -50, opacity: 0 }
  };

  return (
    <div className="w-full max-w-lg mx-auto bg-bg-card rounded-card p-6 md:p-8 shadow-2xl border border-gray-800">
      
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-2">
          {step > 1 && (
            <button onClick={() => setStep(step - 1)} className="text-gray-400 hover:text-white transition-colors">
              <ChevronLeft className="w-6 h-6" />
            </button>
          )}
          <h3 className="text-xl font-bold text-white">
            {step === 1 && "Paso 1: Tu Perfil"}
            {step === 2 && "Paso 2: Tus Medidas"}
            {step === 3 && "Tu Resultado"}
          </h3>
        </div>
        <div className="flex gap-2">
          <div className={`h-2 w-8 rounded-full ${step >= 1 ? 'bg-primary' : 'bg-gray-800'}`} />
          <div className={`h-2 w-8 rounded-full ${step >= 2 ? 'bg-primary' : 'bg-gray-800'}`} />
          <div className={`h-2 w-8 rounded-full ${step >= 3 ? 'bg-primary' : 'bg-gray-800'}`} />
        </div>
      </div>

      <div className="relative overflow-hidden min-h-[320px]">
        <AnimatePresence mode="wait">
          
          {step === 1 && (
            <motion.div key="step1" variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3 }} className="space-y-6">
              
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => handleChange('gender', 'FEMENINO')}
                  className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${data.gender === 'FEMENINO' ? 'border-primary bg-primary/10 text-primary' : 'border-gray-700 text-gray-400 hover:border-gray-500'}`}
                >
                  <User className="w-8 h-8" />
                  <span className="font-semibold">Mujer</span>
                </button>
                <button
                  onClick={() => handleChange('gender', 'MASCULINO')}
                  className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${data.gender === 'MASCULINO' ? 'border-primary bg-primary/10 text-primary' : 'border-gray-700 text-gray-400 hover:border-gray-500'}`}
                >
                  <User className="w-8 h-8" />
                  <span className="font-semibold">Hombre</span>
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Edad (años)</label>
                  <div className="relative">
                    <Activity className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <input type="number" placeholder="Ej: 28" value={data.age} onChange={(e) => handleChange('age', e.target.value)} className="w-full bg-gray-900 border border-gray-700 rounded-xl py-3 pl-10 pr-4 text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Peso (kg)</label>
                  <div className="relative">
                    <Scale className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <input type="number" placeholder="Ej: 70" value={data.weightKg} onChange={(e) => handleChange('weightKg', e.target.value)} className="w-full bg-gray-900 border border-gray-700 rounded-xl py-3 pl-10 pr-4 text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all" />
                  </div>
                </div>
              </div>

              <button 
                onClick={() => setStep(2)} 
                disabled={!data.gender || !data.age || !data.weightKg}
                className="w-full h-14 mt-4 bg-primary hover:bg-primary-hover text-bg-dark font-bold rounded-btn transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                Continuar <ArrowRight className="w-5 h-5" />
              </button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="step2" variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3 }} className="space-y-6">
              <p className="text-gray-400 text-sm mb-4">Ingresa la medida de tus pliegues en milímetros (mm) usando tu cáliper.</p>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  {data.gender === 'MASCULINO' ? '1. Pliegue Pectoral' : '1. Pliegue Tríceps'}
                </label>
                <input type="number" placeholder="Ej: 12" value={data.fold1} onChange={(e) => handleChange('fold1', e.target.value)} className="w-full bg-gray-900 border border-gray-700 rounded-xl p-4 text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none" />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  {data.gender === 'MASCULINO' ? '2. Pliegue Abdominal' : '2. Pliegue Suprailíaco'}
                </label>
                <input type="number" placeholder="Ej: 18" value={data.fold2} onChange={(e) => handleChange('fold2', e.target.value)} className="w-full bg-gray-900 border border-gray-700 rounded-xl p-4 text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  3. Pliegue del Muslo
                </label>
                <input type="number" placeholder="Ej: 15" value={data.fold3} onChange={(e) => handleChange('fold3', e.target.value)} className="w-full bg-gray-900 border border-gray-700 rounded-xl p-4 text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none" />
              </div>

              <button 
                onClick={calculateResult} 
                disabled={!data.fold1 || !data.fold2 || !data.fold3}
                className="w-full h-14 mt-2 bg-primary hover:bg-primary-hover text-bg-dark font-bold rounded-btn transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                Calcular Resultado
              </button>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div key="step3" variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.4 }} className="text-center space-y-6">
              
              <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
                <p className="text-gray-400 font-medium mb-2">Tu Grasa Corporal Estimada</p>
                <h2 className="text-6xl font-extrabold text-white mb-2">
                  {resultBF}<span className="text-3xl text-primary">%</span>
                </h2>
                <div className="w-full bg-gray-800 h-3 rounded-full mt-6 overflow-hidden flex">
                  <div className="h-full bg-blue-500" style={{ width: '15%' }}></div>
                  <div className="h-full bg-primary" style={{ width: '45%' }}></div>
                  <div className="h-full bg-yellow-500" style={{ width: '25%' }}></div>
                  <div className="h-full bg-red-500" style={{ width: '15%' }}></div>
                </div>
              </div>

              {/* 🟢 5. RENDERIZADO CONDICIONAL DEL DESGLOSE (Masa Magra/Grasa) */}
              <div className="relative bg-gray-900/50 rounded-2xl p-6 border border-gray-800/50 overflow-hidden">
                <div className={!isAuthenticated ? "blur-sm opacity-50 select-none" : ""}>
                  <div className="flex justify-between border-b border-gray-700 pb-3 mb-3">
                    <span className="text-gray-400">Masa Magra (Músculo):</span>
                    <span className="font-bold text-white">
                      {isAuthenticated ? `${masses.lean} kg` : '??.? kg'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Masa Grasa:</span>
                    <span className="font-bold text-white">
                      {isAuthenticated ? `${masses.fat} kg` : '??.? kg'}
                    </span>
                  </div>
                </div>
                
                {!isAuthenticated && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-bg-card/40 backdrop-blur-[2px]">
                    <Lock className="w-8 h-8 text-primary mb-2" />
                    <p className="text-sm font-medium text-white px-4">Análisis detallado bloqueado</p>
                  </div>
                )}
              </div>

              {/* 🟢 6. BOTÓN DINÁMICO (Guardar vs Registrarse) */}
              {isAuthenticated ? (
                <button 
                  onClick={handleSaveToDashboard}
                  disabled={isSaving || saveSuccess}
                  className={`w-full h-16 font-extrabold rounded-btn transition-all flex items-center justify-center gap-2 text-lg shadow-lg cursor-pointer disabled:opacity-80 ${saveSuccess ? 'bg-green-500 text-white' : 'bg-primary hover:bg-primary-hover text-bg-dark shadow-primary/10'}`}
                >
                  {isSaving ? 'Guardando...' : saveSuccess ? '¡Guardado!' : 'Guardar en mi Historial'}
                  {saveSuccess ? <CheckCircle2 className="w-6 h-6" /> : <ArrowRight className="w-6 h-6" />}
                </button>
              ) : (
                <>
                  <button 
                    onClick={() => navigate('/register')}
                    className="w-full h-16 bg-white hover:bg-gray-200 text-bg-dark font-extrabold rounded-btn transition-colors flex items-center justify-center gap-2 text-lg shadow-lg shadow-white/10"
                  >
                    Guardar Resultado Gratis
                    <ArrowRight className="w-6 h-6" />
                  </button>
                  <p className="text-xs text-gray-500">Crea tu cuenta en 10 segundos y desbloquea tu historial.</p>
                </>
              )}
              
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}