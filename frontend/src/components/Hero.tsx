import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
// Importamos tu imagen desde la carpeta assets
import heroImg from '../assets/hero.jpg';

export default function Hero() {
  // Referencia para saber cuánto hemos hecho scroll en esta sección
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"]
  });

  // Animación Parallax: El texto baja más rápido (50%) y la imagen más lento (20%)
  const yText = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const yImage = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section ref={ref} className="relative h-screen w-full overflow-hidden bg-gray-950 flex items-center">
      {/* CAPA 1: Imagen de Fondo con Parallax */}
      <motion.div 
        className="absolute inset-0 z-0"
        style={{ y: yImage, opacity }}
      >
        <img 
          src={heroImg} 
          alt="Personal Trainer" 
          className="w-full h-full object-cover opacity-50"
        />
        {/* Gradiente elegante para oscurecer la base y hacer legible el texto */}
        <div className="absolute inset-0 bg-linear-to-t from-gray-950 via-gray-900/60 to-transparent" />
      </motion.div> 

      {/* CAPA 2: Contenido Frontal */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-12 w-full">
        <motion.div 
          style={{ y: yText }}
          className="max-w-2xl"
        >
          <motion.h1 
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl md:text-7xl font-extrabold text-white tracking-tight mb-6"
          >
            Transforma tu cuerpo con <span className="text-emerald-500">Ciencia</span>
          </motion.h1>
          
          <motion.p 
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-lg md:text-xl text-gray-300 mb-8"
          >
            Descubre tu composición corporal real y alcanza tus metas con un plan diseñado milimétricamente para ti.
          </motion.p>

          <motion.button 
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-gray-950 px-8 py-4 rounded-full font-bold text-lg transition-colors cursor-pointer"
            onClick={() => {
              document.getElementById('calculator-section')?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            Calcula tu % de Grasa Gratis
            <ArrowRight className="w-5 h-5" />
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}