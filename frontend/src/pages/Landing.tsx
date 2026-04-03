import Hero from '../components/Hero';
import SEO from '../components/SEO';
import Calculator from '../components/Calculator';
import About from '../components/About';
import Footer from '../components/Footer';
import Services from '../components/Services';

export default function Landing() {
  return (
    <main className="bg-bg-dark min-h-screen text-white selection:bg-emerald-500 selection:text-white flex flex-col">

      <SEO 
        title="Coach Lucy Pérez | Transforma tu Cuerpo con Ciencia"
        description="Calcula tu porcentaje de grasa gratis y obtén un plan de entrenamiento personalizado basado en tu composición corporal real."
      />

      <div className="flex-grow">
        <Hero />
        
        {/* 🟢 1. SECCIÓN ABOUT: Ahora es la primera después del Hero */}
        <About />
        
        {/* 🟢 2. SECCIÓN CALCULADORA: Ahora es la segunda, con scroll-mt-24 para reducir el salto */}
        <section 
          id="calculator-section" 
          className="scroll-mt-20 min-h-screen py-16 flex flex-col items-center justify-center relative z-20 px-4"
        >
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-extrabold mb-4">
              Descubre tu punto de partida
            </h2>
            <p className="text-lg text-gray-400">
              Ingresa tus datos a continuación. Nuestra calculadora científica adaptará las mediciones necesarias según tu perfil biológico.
            </p>
          </div>
          
          <Calculator />

        </section>

        <Services />

      </div>
      
      <Footer />
      
    </main>
  );
}