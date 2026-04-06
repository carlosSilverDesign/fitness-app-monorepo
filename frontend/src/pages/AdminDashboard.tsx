import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, Quote, User as UserIcon, Trophy, Image as ImageIcon, CheckCircle2, Loader2, ArrowLeft, Star, Trash2, Edit2, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import SEO from '../components/SEO';

// Tipamos el testimonio para TypeScript
interface Testimonial {
  id: string;
  name: string;
  achievement: string;
  content: string;
  imageUrl: string | null;
  rating: number;
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { user, isAuthenticated, checkAuth } = useAuth();
  
  const [isPageLoading, setIsPageLoading] = useState(true);
  const ADMIN_EMAIL = 'percy-gatito@mail.com'; // 🟢 Tu correo administrador

  // Estados del CRUD
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null); // null = Crear, string = Editar
  
  const [formData, setFormData] = useState({
    name: '',
    achievement: '',
    content: '',
    imageUrl: '',
    rating: 5 // Por defecto 5 estrellas
  });

  // 1. Carga inicial y validación de token
  useEffect(() => {
    if (!localStorage.getItem('token')) navigate('/login');
    else checkAuth().then(() => setIsPageLoading(false));
  }, [navigate, checkAuth]);

  // 2. Verificación de acceso Admin
  useEffect(() => {
    if (!isPageLoading) {
      if (!isAuthenticated) navigate('/login');
      else if (user?.email?.toLowerCase() !== ADMIN_EMAIL.toLowerCase()) navigate('/dashboard'); 
    }
  }, [isAuthenticated, user, isPageLoading, navigate]);

  // 3. Traer los testimonios existentes
  const fetchTestimonials = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/v1/testimonials');
      if (response.ok) {
        const data = await response.json();
        setTestimonials(data);
      }
    } catch (error) {
      console.error("Error cargando lista de testimonios:", error);
    }
  };

  // Cargar lista al entrar
  useEffect(() => {
    if (!isPageLoading && isAuthenticated) fetchTestimonials();
  }, [isPageLoading, isAuthenticated]);

  // 4. Función de GUARDAR (Crear o Actualizar)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const token = localStorage.getItem('token');
      const url = editingId 
        ? `http://localhost:3000/api/v1/testimonials/${editingId}` 
        : 'http://localhost:3000/api/v1/testimonials';
      
      const method = editingId ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setSuccess(true);
        resetForm();
        fetchTestimonials(); // Refrescamos la lista
        setTimeout(() => setSuccess(false), 3000);
      } else {
        alert("Hubo un error al guardar el testimonio.");
      }
    } catch (error) {
      console.error("Error de red:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // 5. Función de ELIMINAR
  const handleDelete = async (id: string) => {
    if (!window.confirm("¿Seguro que deseas eliminar este testimonio?")) return;
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3000/api/v1/testimonials/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) fetchTestimonials(); // Refrescamos la lista
      else alert("Error al eliminar");
    } catch (error) {
      console.error(error);
    }
  };

  // 6. Función para CARGAR DATOS AL EDITAR
  const handleEdit = (t: Testimonial) => {
    setEditingId(t.id);
    setFormData({
      name: t.name,
      achievement: t.achievement,
      content: t.content,
      imageUrl: t.imageUrl || '',
      rating: t.rating
    });
    // Hacemos scroll suave hacia arriba para ver el formulario
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({ name: '', achievement: '', content: '', imageUrl: '', rating: 5 });
  };

  if (isPageLoading || user?.email?.toLowerCase() !== ADMIN_EMAIL.toLowerCase()) {
    return (
      <div className="min-h-screen bg-bg-dark flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <main className="bg-bg-dark min-h-screen text-white pb-24 selection:bg-primary selection:text-white">
      <SEO title="Admin | Lugym" description="Panel de Administración" />

      {/* HEADER ADMIN */}
      <header className="bg-gray-900 border-b border-red-500/20 pt-8 pb-6 px-4 md:px-8">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
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

      <div className="max-w-5xl mx-auto px-4 md:px-8 mt-12 space-y-12">
        
        {/* ===================== FORMULARIO ===================== */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="bg-bg-card rounded-2xl p-6 md:p-8 border border-gray-800 shadow-2xl relative overflow-hidden"
        >
          {/* Si estamos editando, ponemos un borde superior indicador */}
          {editingId && <div className="absolute top-0 left-0 w-full h-1 bg-amber-500" />}

          <div className="flex items-center justify-between mb-8 border-b border-gray-800 pb-6">
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${editingId ? 'bg-amber-500/20 text-amber-500' : 'bg-primary/20 text-primary'}`}>
                {editingId ? <Edit2 className="w-6 h-6" /> : <Quote className="w-6 h-6" />}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">
                  {editingId ? 'Editando Testimonio' : 'Publicar Nuevo Testimonio'}
                </h2>
                <p className="text-gray-400 text-sm">
                  {editingId ? 'Modifica los datos y guarda los cambios.' : 'Este testimonio aparecerá instantáneamente en la Landing Page.'}
                </p>
              </div>
            </div>
            {/* Botón para cancelar edición */}
            {editingId && (
              <button onClick={resetForm} className="text-gray-400 hover:text-white flex items-center gap-1 text-sm bg-gray-800 px-3 py-1.5 rounded-lg transition-colors">
                <X className="w-4 h-4" /> Cancelar edición
              </button>
            )}
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* URL Imagen */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">URL de la Foto (Opcional)</label>
                <div className="relative">
                  <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input type="url" placeholder="https://ejemplo.com/foto.jpg" value={formData.imageUrl} onChange={(e) => setFormData({...formData, imageUrl: e.target.value})} className="w-full bg-gray-900 border border-gray-700 rounded-xl py-3 pl-10 pr-4 text-white focus:border-primary outline-none transition-all" />
                </div>
              </div>

              {/* Selector de Estrellas */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Calificación</label>
                <div className="flex gap-2 bg-gray-900 border border-gray-700 rounded-xl py-3 px-4 w-max">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star} type="button"
                      onClick={() => setFormData({...formData, rating: star})}
                      className="focus:outline-none"
                    >
                      <Star className={`w-6 h-6 transition-colors ${star <= formData.rating ? 'fill-primary text-primary' : 'text-gray-600'}`} />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Contenido / Comentario */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Comentario / Testimonio</label>
              <textarea required rows={4} placeholder="Escribe la experiencia del atleta aquí..." value={formData.content} onChange={(e) => setFormData({...formData, content: e.target.value})} className="w-full bg-gray-900 border border-gray-700 rounded-xl p-4 text-white focus:border-primary outline-none transition-all resize-none" />
            </div>

            <button 
              type="submit" disabled={isSubmitting || success}
              className={`w-full py-4 font-extrabold rounded-xl transition-all flex items-center justify-center gap-2 ${success ? 'bg-emerald-500 text-white' : editingId ? 'bg-amber-500 hover:bg-amber-400 text-bg-dark' : 'bg-primary hover:bg-primary-hover text-bg-dark'}`}
            >
              {isSubmitting ? <Loader2 className="w-6 h-6 animate-spin" /> : success ? <>¡Guardado con éxito! <CheckCircle2 className="w-6 h-6" /></> : editingId ? 'Actualizar Testimonio' : 'Publicar Testimonio'}
            </button>
          </form>
        </motion.section>

        {/* ===================== TABLA DE GESTIÓN ===================== */}
        <section>
          <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            Testimonios Publicados ({testimonials.length})
          </h3>
          
          <div className="space-y-4">
            <AnimatePresence>
              {testimonials.length === 0 ? (
                <p className="text-gray-500 text-center py-8 bg-bg-card rounded-2xl border border-gray-800">Aún no hay testimonios publicados.</p>
              ) : (
                testimonials.map((t) => (
                  <motion.div 
                    key={t.id}
                    initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, height: 0 }}
                    className="bg-bg-card border border-gray-800 p-4 md:p-6 rounded-2xl flex flex-col md:flex-row gap-6 items-start md:items-center justify-between"
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <img 
                        src={t.imageUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(t.name)}&background=10b981&color=fff&bold=true`} 
                        alt={t.name} className="w-16 h-16 rounded-full object-cover border-2 border-gray-800"
                      />
                      <div>
                        <h4 className="text-white font-bold text-lg">{t.name}</h4>
                        <p className="text-primary text-sm font-bold uppercase tracking-wider mb-1">{t.achievement}</p>
                        <p className="text-gray-400 text-sm line-clamp-1">"{t.content}"</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 w-full md:w-auto justify-end border-t md:border-t-0 border-gray-800 pt-4 md:pt-0">
                      <div className="flex items-center mr-4">
                        <Star className="w-4 h-4 fill-primary text-primary mr-1" />
                        <span className="text-gray-300 font-bold">{t.rating}</span>
                      </div>
                      
                      <button 
                        onClick={() => handleEdit(t)}
                        className="p-2 bg-gray-800 hover:bg-amber-500/20 text-gray-400 hover:text-amber-500 rounded-lg transition-colors" title="Editar"
                      >
                        <Edit2 className="w-5 h-5" />
                      </button>
                      <button 
                        onClick={() => handleDelete(t.id)}
                        className="p-2 bg-gray-800 hover:bg-red-500/20 text-gray-400 hover:text-red-500 rounded-lg transition-colors" title="Eliminar"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        </section>

      </div>
    </main>
  );
}