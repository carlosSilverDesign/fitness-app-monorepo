import Hero from '../components/Hero';
import SEO from '../components/SEO';
import Calculator from '../components/Calculator';

export default function Landing() {
  return (
    <main className="bg-gray-950 min-h-screen text-white selection:bg-emerald-500 selection:text-white">

    {/* Inyectamos el SEO ultra optimizado */}
      <SEO 
        title="Coach Lucy Pérez | Transforma tu Cuerpo con Ciencia"
        description="Calcula tu porcentaje de grasa gratis y obtén un plan de entrenamiento personalizado basado en tu composición corporal real."
      />

      {/* Sección 1: El Hero Parallax */}
      <Hero />
      
      {/* 🖥️ C A L C U L A D O R A  */}
      <section 
        id="calculator-section" 
        className="min-h-screen py-24 flex flex-col items-center justify-center bg-bg-dark relative z-20 px-4"
      >
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-extrabold mb-4">
            Descubre tu punto de partida
          </h2>
          <p className="text-lg text-gray-400">
            Ingresa tus datos a continuación. Nuestra calculadora científica adaptará las mediciones necesarias según tu perfil biológico.
          </p>
        </div>
        
        {/* Aquí renderizamos la tarjeta interactiva */}
        <Calculator />
      </section>
    </main>
  );
}