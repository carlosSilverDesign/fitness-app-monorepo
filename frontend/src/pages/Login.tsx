import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, ArrowRight, LogIn } from 'lucide-react';
import SEO from '../components/SEO';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation(); // 🟢 Aquí atrapamos la "maleta" de la redirección
  
  // Extraemos el mensaje de éxito si es que viene desde la página de Registro
  const successMessage = location.state?.message;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:3000/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Credenciales inválidas');
      }

      // 🟢 ¡Éxito! Guardamos el Token (Carnet VIP) en la memoria del navegador
      localStorage.setItem('token', data.token);
      
      // Redirigimos al área privada
      navigate('/dashboard');
      
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Error inesperado al conectar con el servidor.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="bg-bg-dark min-h-screen flex items-center justify-center px-4 py-12 selection:bg-primary selection:text-white">
      <SEO title="Iniciar Sesión | Coach Lucy" description="Ingresa a tu cuenta para ver tu progreso." />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md bg-bg-card rounded-card p-8 shadow-2xl border border-gray-800"
      >
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <LogIn className="w-6 h-6 text-primary" />
            </div>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight mb-2">Bienvenido de vuelta</h1>
          <p className="text-gray-400">Ingresa tus credenciales para continuar.</p>
        </div>

        {/* 🟢 El Mensaje de Éxito del Registro */}
        {successMessage && (
          <div className="bg-emerald-500/10 border border-emerald-500/50 text-emerald-500 text-sm p-4 rounded-xl mb-6 text-center font-medium">
            {successMessage}
          </div>
        )}

        {/* Mensaje de Error */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-500 text-sm p-4 rounded-xl mb-6 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Correo Electrónico</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input 
                type="email" name="email" required
                value={formData.email} onChange={handleChange}
                className="w-full bg-gray-900 border border-gray-700 rounded-xl py-3 pl-10 pr-4 text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all" 
                placeholder="tu@email.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Contraseña</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input 
                type="password" name="password" required
                value={formData.password} onChange={handleChange}
                className="w-full bg-gray-900 border border-gray-700 rounded-xl py-3 pl-10 pr-4 text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all" 
                placeholder="••••••••"
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full h-14 mt-4 bg-primary hover:bg-primary-hover text-bg-dark font-bold rounded-btn transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? 'Ingresando...' : 'Iniciar Sesión'}
            {!loading && <ArrowRight className="w-5 h-5" />}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-400">
          ¿No tienes una cuenta?{' '}
          <Link to="/register" className="text-primary hover:text-primary-hover font-semibold transition-colors">
            Regístrate gratis
          </Link>
        </div>
      </motion.div>
    </main>
  );
}