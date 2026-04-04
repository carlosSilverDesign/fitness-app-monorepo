import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Hero from '../components/Hero';
import SEO from '../components/SEO';
import Calculator from '../components/Calculator';
import About from '../components/About';
import Footer from '../components/Footer';
import Services from '../components/Services';
import Testimonials from '../components/Testimonials';

export default function Landing() {
  // 1. Estado para controlar el resplandor (Glow)
  const [isCalculatorGlowing, setIsCalculatorGlowing] = useState(false);

  // 2. Escuchamos el evento desde el Navbar
  useEffect(() => {
    const handleNavClick = () => {
      setIsCalculatorGlowing(true);
      // Apagamos el resplandor intenso después de 3.5 segundos
      setTimeout(() => setIsCalculatorGlowing(false), 3500);
    };

    window.addEventListener('nav-calculator-clicked', handleNavClick);
    return () => window.removeEventListener('nav-calculator-clicked', handleNavClick);
  }, []);

  return (
    <main className="bg-bg-dark min-h-screen text-white selection:bg-emerald-500 selection:text-white flex flex-col">

      <SEO 
        title="Coach Lucy Pérez | Transforma tu Cuerpo con Ciencia"
        description="Calcula tu porcentaje de grasa gratis y obtén un plan de entrenamiento personalizado basado en tu composición corporal real."
      />

      <div className="flex-grow">
        <Hero />
        
        <About />
        
        {/* 🟢 SECCIÓN CALCULADORA CON OVERFLOW-HIDDEN */}
        <section 
          id="calculator-section" 
          className="scroll-mt-20 min-h-screen py-16 flex flex-col items-center justify-center relative z-20 px-4 overflow-hidden"
        >
          {/* 🟢 1. FONDO ANIMADO: Esferas de luz flotantes */}
          <motion.div
            animate={{ y: [0, -40, 0], scale: [1, 1.1, 1], opacity: [0.1, 0.3, 0.1] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-0 left-0 md:left-1/4 w-[300px] h-[300px] bg-primary/30 blur-[120px] rounded-full pointer-events-none z-0"
          />
          <motion.div
            animate={{ y: [0, 40, 0], scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            className="absolute bottom-0 right-0 md:right-1/4 w-[400px] h-[400px] bg-emerald-500/20 blur-[120px] rounded-full pointer-events-none z-0"
          />

          <div className="max-w-3xl mx-auto text-center mb-12 relative z-10">
            <h2 className="text-3xl md:text-5xl font-extrabold mb-4">
              Descubre tu punto de partida
            </h2>
            <p className="text-lg text-gray-400">
              Ingresa tus datos a continuación. Nuestra calculadora científica adaptará las mediciones necesarias según tu perfil biológico.
            </p>
          </div>
          
          {/* 🟢 2. EL GLOW (RESPLANDOR) DETRÁS DE LA CALCULADORA */}
          <div className="relative z-10 w-full max-w-lg mx-auto">
            {/* Este div es el Drop Shadow dinámico */}
            <div 
              className={`absolute -inset-1 bg-gradient-to-r from-primary via-emerald-400 to-blue-500 rounded-[2rem] blur-xl transition-all duration-1000 ${
                isCalculatorGlowing ? 'opacity-60 scale-105' : 'opacity-0 scale-100'
              }`}
            />
            
            {/* Tu calculadora original queda intacta, simplemente envuelta */}
            <div className="relative">
              <Calculator />
            </div>
          </div>

        </section>

        <Services />
        
        <Testimonials />

      </div>
      
      <Footer />
      
    </main>
  );
}