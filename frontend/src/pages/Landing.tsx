import Hero from '../components/Hero';

export default function Landing() {
  return (
    <main className="bg-gray-950 min-h-screen text-white selection:bg-emerald-500 selection:text-white">
      {/* Sección 1: El Hero Parallax */}
      <Hero />
      
      {/* Sección 2: Espacio temporal para probar el Scroll (Aquí irá la Calculadora) */}
      <section 
        id="calculator-section" 
        className="h-screen flex items-center justify-center bg-gray-950 border-t border-gray-800 relative z-20"
      >
        <div className="text-center">
          <h2 className="text-4xl text-gray-400 font-bold mb-4">Aquí irá la Calculadora Científica...</h2>
          <p className="text-gray-600">Haz scroll hacia arriba y abajo para ver el efecto Parallax en el Hero.</p>
        </div>
      </section>
    </main>
  );
}