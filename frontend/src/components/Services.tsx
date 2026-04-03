import { motion, type Variants } from 'framer-motion';
import { Clock, Shield, Dumbbell, MapPin, Home, CheckCircle2, Activity } from 'lucide-react';

// Variantes de animación para el Fade-in Up
const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2 }
  }
};

export default function Services() {
  return (
    <section className="scroll-mt-24 bg-bg-dark py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden" id="services-section">
      
      {/* Elementos de fondo para profundidad */}
      <div className="absolute top-1/4 left-0 w-[500px] h-[500px] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-blue-500/5 blur-[100px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* 1. STORYTELLING: Las Barreras */}
        <div className="text-center mb-20">
          <motion.h1 
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={fadeInUp}
            className="text-4xl md:text-5xl font-black text-white tracking-tighter mb-6"
          >
            Tu transformación, <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400">sin excusas.</span>
          </motion.h1>
          <motion.p 
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}
            className="text-lg text-gray-400 max-w-2xl mx-auto"
          >
            Sabemos qué te detiene. Por eso diseñamos un ecosistema que destruye las barreras entre tú y tu mejor versión.
          </motion.p>

          <motion.div 
            variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 max-w-4xl mx-auto"
          >
            {[
              { icon: Clock, title: "Tiempo Limitado", desc: "Rutinas optimizadas para tu agenda. Máximo estímulo en el menor tiempo." },
              { icon: Shield, title: "Falta de Privacidad", desc: "Entrena sin miradas incómodas. Espacios y tratos 100% exclusivos." },
              { icon: Dumbbell, title: "Sin Equipamiento", desc: "Adaptamos la biomecánica a lo que tengas: desde mancuernas hasta tu propio peso." }
            ].map((item, index) => (
              <motion.div key={index} variants={fadeInUp} className="flex flex-col items-center text-center p-6 bg-gray-900/50 rounded-2xl border border-gray-800">
                <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center text-primary mb-4 shadow-lg shadow-primary/5">
                  <item.icon className="w-8 h-8" />
                </div>
                <h3 className="text-white font-bold text-lg mb-2">{item.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* 2. EL NÚCLEO: Programa Personalizado + Gráfico Teaser */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-16 items-center mb-24 bg-gray-900/30 p-5 sm:p-8 md:p-12 rounded-3xl md:rounded-[2.5rem] border border-gray-800/60">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="space-y-6 md:space-y-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-3 md:mb-4">El Programa <span className="text-primary">100% Personalizado</span></h2>
              <p className="text-sm md:text-base text-gray-400">No creemos en plantillas. Tu biología es única, tu plan también debe serlo. Incluye:</p>
            </div>
            <ul className="space-y-3 md:space-y-4">
              {[
                "Asesoría nutricional basada en macros",
                "Evaluación clínica (Medidas Antropométricas)",
                "Test de Valoración de fuerza y movilidad",
                "Seguimiento continuo 24/7 vía app"
              ].map((benefit, i) => (
                <li key={i} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 md:w-6 md:h-6 text-primary shrink-0" />
                  <span className="text-sm md:text-base text-gray-200 font-medium">{benefit}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* TEASER DE GRÁFICOS (Valor Añadido Tech) */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.8 }}
            // 🟢 FIX MOBILE: Padding reducido en móvil (p-4)
            className="relative bg-bg-dark rounded-2xl md:rounded-3xl p-4 md:p-6 border border-gray-700 shadow-2xl w-full"
          >
            <div className="flex justify-between items-center border-b border-gray-800 pb-3 md:pb-4 mb-4 md:mb-6">
              <div className="flex items-center gap-2 text-white font-bold text-sm md:text-base">
                <Activity className="w-4 h-4 md:w-5 md:h-5 text-blue-400" />
                <span>Evolución Corporal</span>
              </div>
              <span className="text-[10px] md:text-xs bg-primary/10 text-primary px-2 md:px-3 py-1 rounded-full font-bold uppercase tracking-wider">Data Real</span>
            </div>
            
            {/* 🟢 GRÁFICO ANIMADO: Ahora sí crecen las barras con Framer Motion */}
            <div className="h-32 md:h-48 flex items-end justify-between gap-1.5 md:gap-2 w-full">
              {[35, 50, 40, 65, 55, 80, 100].map((height, i) => (
                <div key={i} className="w-full h-full flex flex-col justify-end group relative">
                  {/* Animamos la altura desde 0 hasta su valor final al hacer scroll */}
                  <motion.div
                    initial={{ height: "0%" }}
                    whileInView={{ height: `${height}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: 0.3 + (i * 0.1), type: "spring", stiffness: 40 }}
                    className="w-full bg-primary/20 rounded-t-sm md:rounded-t-md relative group-hover:bg-primary/40 transition-colors flex flex-col justify-start"
                  >
                    {/* La línea brillante de arriba */}
                    <div className="w-full bg-primary rounded-t-sm md:rounded-t-md h-1 md:h-1.5 absolute top-0" />
                  </motion.div>
                </div>
              ))}
            </div>

            <div className="flex justify-between mt-3 md:mt-4 text-[10px] md:text-xs text-gray-500 font-medium">
              <span>Semana 1</span>
              <span>Semana 12</span>
            </div>
            <p className="text-center text-[11px] md:text-sm text-gray-400 mt-4 md:mt-6 pt-3 md:pt-4 border-t border-gray-800 leading-relaxed">
              Visualiza cómo tu % de grasa baja mientras tu músculo sube. <br className="hidden md:block"/> Tecnología al servicio de tus metas.
            </p>
          </motion.div>
        </div>

        {/* 3. MODALIDADES: Cards Interactivas (Ley de Fitts aplicada) */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold text-white mb-2">Elige tu Modalidad</h2>
          <p className="text-gray-400">Misma ciencia, diferente escenario.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Card Presencial */}
          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}
            className="group relative bg-gray-900 border border-gray-800 rounded-3xl p-8 hover:border-primary/50 transition-colors flex flex-col h-full"
          >
            <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
              <MapPin className="w-24 h-24 text-primary" />
            </div>
            <div className="relative z-10 flex-grow">
              <h3 className="text-2xl font-black text-white mb-2">Presencial</h3>
              <p className="text-primary font-semibold text-sm uppercase tracking-wider mb-6">Exclusividad Total</p>
              <p className="text-gray-400 mb-6 leading-relaxed">
                Entrena en un gimnasio boutique privado, equipado con maquinaria biomecánica de élite. Sin esperas, sin distracciones.
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex gap-2 text-sm text-gray-300"><CheckCircle2 className="w-5 h-5 text-gray-500" /> Máximo 3 personas por turno.</li>
                <li className="flex gap-2 text-sm text-gray-300"><CheckCircle2 className="w-5 h-5 text-gray-500" /> Corrección técnica presencial.</li>
              </ul>
            </div>
            {/* CTA Massive (Ley de Fitts) */}
            <button className="w-full py-4 bg-white hover:bg-gray-200 text-bg-dark font-black rounded-xl transition-all shadow-lg shadow-white/5 mt-auto">
              Agenda tu diagnóstico
            </button>
          </motion.div>

          {/* Card A Domicilio */}
          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}
            className="group relative bg-gray-900 border border-gray-800 rounded-3xl p-8 hover:border-blue-500/50 transition-colors flex flex-col h-full"
          >
            <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
              <Home className="w-24 h-24 text-blue-500" />
            </div>
            <div className="relative z-10 flex-grow">
              <h3 className="text-2xl font-black text-white mb-2">A Domicilio</h3>
              <p className="text-blue-400 font-semibold text-sm uppercase tracking-wider mb-6">En tu casa o tu Gym</p>
              <p className="text-gray-400 mb-6 leading-relaxed">
                Llevamos la ciencia a tu terreno. Ideal si ya pagas un gimnasio comercial o tienes mancuernas en casa.
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex gap-2 text-sm text-gray-300"><CheckCircle2 className="w-5 h-5 text-gray-500" /> Asesoría de técnica adaptada a tu entorno.</li>
                <li className="flex gap-2 text-sm text-gray-300"><CheckCircle2 className="w-5 h-5 text-gray-500" /> <span className="italic text-gray-400">(No incluye traslado de maquinaria pesada).</span></li>
              </ul>
            </div>
            {/* CTA Massive (Ley de Fitts) */}
            <button className="w-full py-4 bg-white hover:bg-gray-200 text-bg-dark font-black rounded-xl transition-all shadow-lg shadow-white/5 mt-auto">
              Explora tu potencial
            </button>
          </motion.div>
        </div>

      </div>
    </section>
  );
}