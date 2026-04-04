import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldAlert, Quote, User as UserIcon, Trophy, Image as ImageIcon, CheckCircle2, Loader2, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import SEO from '../components/SEO';

export default function AdminDashboard() {
  const navigate = useNavigate();
  // 🟢 1. Traemos checkAuth y quitamos el authLoading que no existía
  const { user, isAuthenticated, checkAuth } = useAuth();
  console.log("Datos del usuario en memoria:", user);
  
  // 🟢 2. Estado local de carga (Idéntico a tu Dashboard normal)
  const [isPageLoading, setIsPageLoading] = useState(true);

  // SEGURIDAD: Cambia esto por el correo real
  const ADMIN_EMAIL = 'percy-gatito@mail.com'; 

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    achievement: '',
    content: '',
    imageUrl: ''
  });

  // 🟢 3. Flujo de carga inicial
  useEffect(() => {
    if (!localStorage.getItem('token')) {
      navigate('/login');
    } else {
      checkAuth().then(() => {
        setIsPageLoading(false);
      });
    }
  }, [navigate, checkAuth]);

  // 🟢 4. Verificación de acceso Admin (después de cargar)
  useEffect(() => {
    if (!isPageLoading) {
      if (!isAuthenticated) {
        navigate('/login');
      } else if (user?.email?.toLowerCase() !== ADMIN_EMAIL.toLowerCase()) {
        navigate('/dashboard'); // Si no es admin, lo devolvemos a su panel
      }
    }
  }, [isAuthenticated, user, isPageLoading, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3000/api/v1/testimonials', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setSuccess(true);
        setFormData({ name: '', achievement: '', content: '', imageUrl: '' });
        setTimeout(() => setSuccess(false), 3000);
      } else {
        console.error("Error al publicar testimonio");
      }
    } catch (error) {
      console.error("Error de red:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // 🟢 5. Pantalla de carga segura
  if (isPageLoading || user?.email?.toLowerCase() !== ADMIN_EMAIL.toLowerCase()) {
    return (
      <div className="min-h-screen bg-bg-dark flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
      </div>
    );
  }
  return (
    <main className="bg-bg-dark min-h-screen text-white pb-12 selection:bg-primary selection:text-white">
      <SEO title="Admin | Lugym" description="Panel de Administración" />

      {/* HEADER ADMIN */}
      <header className="bg-gray-900 border-b border-red-500/20 pt-8 pb-6 px-4 md:px-8">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-extrabold text-white flex items-center gap-3">
              <ShieldAlert className="w-8 h-8 text-red-500" />
              Cuartel General
            </h1>
            <p className="text-red-400 mt-1 font-medium">Acceso restringido: Modo Administrador</p>
          </div>
          <button onClick={() => navigate('/dashboard')} className="text-gray-400 hover:text-white flex items-center gap-2 transition-colors">
            <ArrowLeft className="w-5 h-5" /> Volver a mi panel
          </button>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 md:px-8 mt-12">
        <motion.section 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="bg-bg-card rounded-2xl p-6 md:p-8 border border-gray-800 shadow-2xl"
        >
          <div className="flex items-center gap-3 mb-8 border-b border-gray-800 pb-6">
            <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center text-primary">
              <Quote className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Publicar Nuevo Testimonio</h2>
              <p className="text-gray-400 text-sm">Este testimonio aparecerá instantáneamente en la Landing Page.</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Nombre */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Nombre del Atleta</label>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input required type="text" placeholder="Ej: Carlos R." value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full bg-gray-900 border border-gray-700 rounded-xl py-3 pl-10 pr-4 text-white focus:border-primary outline-none transition-all" />
                </div>
              </div>

              {/* Logro */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Logro Principal</label>
                <div className="relative">
                  <Trophy className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input required type="text" placeholder="Ej: -12kg Grasa" value={formData.achievement} onChange={(e) => setFormData({...formData, achievement: e.target.value})} className="w-full bg-gray-900 border border-gray-700 rounded-xl py-3 pl-10 pr-4 text-white focus:border-primary outline-none transition-all" />
                </div>
              </div>
            </div>

            {/* URL Imagen */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">URL de la Foto (Opcional)</label>
              <div className="relative">
                <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input type="url" placeholder="https://ejemplo.com/foto.jpg" value={formData.imageUrl} onChange={(e) => setFormData({...formData, imageUrl: e.target.value})} className="w-full bg-gray-900 border border-gray-700 rounded-xl py-3 pl-10 pr-4 text-white focus:border-primary outline-none transition-all" />
              </div>
              <p className="text-xs text-gray-500 mt-2">Puedes subir la foto a un servicio gratuito como Imgur y pegar el link aquí.</p>
            </div>

            {/* Contenido / Comentario */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Comentario / Testimonio</label>
              <textarea required rows={4} placeholder="Escribe la experiencia del atleta aquí..." value={formData.content} onChange={(e) => setFormData({...formData, content: e.target.value})} className="w-full bg-gray-900 border border-gray-700 rounded-xl p-4 text-white focus:border-primary outline-none transition-all resize-none" />
            </div>

            <button 
              type="submit" disabled={isSubmitting || success}
              className={`w-full py-4 font-extrabold rounded-xl transition-all flex items-center justify-center gap-2 ${success ? 'bg-emerald-500 text-white' : 'bg-primary hover:bg-primary-hover text-bg-dark'}`}
            >
              {isSubmitting ? <Loader2 className="w-6 h-6 animate-spin" /> : success ? <>¡Publicado con éxito! <CheckCircle2 className="w-6 h-6" /></> : 'Publicar Testimonio'}
            </button>
          </form>
        </motion.section>
      </div>
    </main>
  );
}