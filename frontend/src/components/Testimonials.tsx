import { motion } from 'framer-motion';
import { Quote, Star } from 'lucide-react';

const testimonials = [
  {
    name: "Carlos R.",
    achievement: "-12kg Grasa",
    content: "Lo que más me voló la cabeza fue la precisión. Con los pliegues supe exactamente qué estaba perdiendo. Coach Lucy no te da una dieta, te da una educación biológica.",
    image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=200&h=200&auto=format&fit=crop"
  },
  {
    name: "Elena M.",
    achievement: "+4kg Músculo",
    content: "Entrenar a domicilio me salvó la vida. Lucy adaptó todo a mis mancuernas y los resultados en el espejo son increíbles. ¡Ver mi gráfica de evolución en el dashboard me motiva cada lunes!",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200&h=200&auto=format&fit=crop"
  },
  {
    name: "Ricardo V.",
    achievement: "Recomposición",
    content: "Pasé de estar estancado a ver mis abdominales por primera vez en 10 años. La app de Lugym es la herramienta que me faltaba.",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&h=200&auto=format&fit=crop"
  }
];

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

        <motion.div 
          variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {testimonials.map((t, i) => (
            <motion.div 
              key={i} variants={cardVariants}
              className="bg-gray-900/50 p-8 rounded-[2rem] border border-gray-800 hover:border-primary/30 transition-all group relative"
            >
              <Quote className="absolute top-6 right-8 w-12 h-12 text-primary/5 group-hover:text-primary/10 transition-colors" />
              
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, starI) => (
                  <Star key={starI} className="w-4 h-4 fill-primary text-primary" />
                ))}
              </div>

              <p className="text-gray-200 italic mb-8 leading-relaxed relative z-10">
                "{t.content}"
              </p>

              <div className="flex items-center gap-4 border-t border-gray-800 pt-6">
                <img src={t.image} alt={t.name} className="w-14 h-14 rounded-full object-cover border-2 border-primary/20" />
                <div>
                  <h4 className="text-white font-bold">{t.name}</h4>
                  <span className="text-xs font-bold text-primary uppercase tracking-widest">{t.achievement}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Call to action final para cerrar la sección */}
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