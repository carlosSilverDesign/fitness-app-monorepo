import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Quote, Star, Loader2 } from 'lucide-react';

// Tipamos lo que esperamos recibir del backend
interface Testimonial {
  id: string;
  name: string;
  achievement: string;
  content: string;
  imageUrl: string | null;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2 }
  }
};

const cardVariants = {
  hidden: { opacity: 0, scale: 0.9, y: 20 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.5 } }
};

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // 🟢 HACEMOS LA LLAMADA AL BACKEND AL CARGAR EL COMPONENTE
  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/v1/testimonials');
        if (response.ok) {
          const data = await response.json();
          setTestimonials(data);
        }
      } catch (error) {
        console.error("Error cargando testimonios:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTestimonials();
  }, []);

  return (
    <section className="scroll-mt-24 py-24 bg-bg-dark relative overflow-hidden" id="testimonials-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tighter"
          >
            Resultados que <span className="text-primary">hablan por sí solos.</span>
          </motion.h2>
          <p className="text-gray-400 text-lg">Historias reales de atletas que confiaron en la ciencia de Lugym.</p>
        </div>

        {/* ESTADO DE CARGA */}
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-10 h-10 text-primary animate-spin" />
          </div>
        ) : testimonials.length === 0 ? (
          // SI AÚN NO HAY TESTIMONIOS, MOSTRAMOS UN MENSAJE ELEGANTE
          <div className="text-center py-12 bg-gray-900/30 rounded-3xl border border-gray-800">
            <p className="text-gray-500 font-medium">Nuestras nuevas historias de éxito se están procesando...</p>
          </div>
        ) : (
          // 🟢 RENDERIZAMOS LOS TESTIMONIOS REALES
          <motion.div 
            variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {testimonials.map((t) => (
              <motion.div 
                key={t.id} variants={cardVariants}
                className="bg-gray-900/50 p-8 rounded-[2rem] border border-gray-800 hover:border-primary/30 transition-all group relative flex flex-col justify-between"
              >
                <div>
                  <Quote className="absolute top-6 right-8 w-12 h-12 text-primary/5 group-hover:text-primary/10 transition-colors" />
                  
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(5)].map((_, starI) => (
                      <Star key={starI} className="w-4 h-4 fill-primary text-primary" />
                    ))}
                  </div>

                  <p className="text-gray-200 italic mb-8 leading-relaxed relative z-10">
                    "{t.content}"
                  </p>
                </div>

                <div className="flex items-center gap-4 border-t border-gray-800 pt-6 mt-auto">
                  {/* SI NO HAY FOTO, CREAMOS UN AVATAR CON SUS INICIALES */}
                  <img 
                    src={t.imageUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(t.name)}&background=10b981&color=fff&bold=true`} 
                    alt={t.name} 
                    className="w-14 h-14 rounded-full object-cover border-2 border-primary/20" 
                  />
                  <div>
                    <h4 className="text-white font-bold">{t.name}</h4>
                    <span className="text-xs font-bold text-primary uppercase tracking-widest">{t.achievement}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        <motion.div 
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ delay: 0.8 }}
          className="mt-20 text-center"
        >
          <p className="text-gray-500 mb-6 font-medium">¿Listo para ser nuestra próxima historia de éxito?</p>
          <button 
            onClick={() => {
              const el = document.getElementById('calculator-section');
              if(el) el.scrollIntoView({ behavior: 'smooth' });
              window.dispatchEvent(new Event('nav-calculator-clicked'));
            }}
            className="px-8 py-4 bg-gray-800 hover:bg-gray-700 text-white font-bold rounded-xl transition-all border border-gray-700 hover:border-primary/50"
          >
            Empieza tu diagnóstico hoy
          </button>
        </motion.div>
      </div>
    </section>
  );
}