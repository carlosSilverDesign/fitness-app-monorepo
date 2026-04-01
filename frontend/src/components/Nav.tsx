import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
// IMPORTA TU LOGO AQUÍ (Asegúrate de tener el archivo en src/assets)
import logoSvg from '../assets/Logo-Lugym-2026.svg';

const navLinks = [
  { name: 'Sobre Mí', id: 'about-section' },
  { name: 'Calculadora', id: 'calculator-section' },
  { name: 'Servicios', id: 'services-section' },
  { name: 'Testimonios', id: 'testimonials-section' },
];

export default function Nav() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // EFECTO DE SCROLL: Escuchamos cuando el usuario baja más de 50px
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll); // Limpieza
  }, []);

  const scrollToSection = (id: string) => {
    setIsOpen(false);
    const element = document.getElementById(id);
    if (element) {
      const navHeight = 80;
      const elementPosition = element.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({
        top: elementPosition - navHeight,
        behavior: 'smooth'
      });
    }
  };

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 h-20 transition-all duration-300 flex items-center selection:bg-primary selection:text-white
        ${isScrolled
          ? 'bg-transparent border-transparent' /* Si quieres que SE DESVANEZCA al hacer scroll, usa esto */
          /* ? 'bg-bg-dark/80 backdrop-blur-md border-b border-gray-800' // <- ESTE ES EL ESTÁNDAR (Aparece al hacer scroll) */
          : 'bg-bg-dark/80 backdrop-blur-md border-b border-gray-800' /* Estado inicial (Arriba de todo) */
        /* : 'bg-transparent border-transparent' // <- ESTADO INICIAL ESTÁNDAR (Transparente arriba) */
        }
      `}
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-12 w-full flex items-center justify-between">

        {/* LOGO */}
        <Link to="/" className="flex items-center gap-2">
          {/* Si usas tu SVG, descomenta esta línea y borra el texto de abajo */}
          <img src={logoSvg} alt="Coach Lucy Perez Logo" className="pt-2 h-21  w-auto" />

          <div className="hidden md:flex text-2xl font-bold text-white tracking-tighter items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-primary inline-block" />
            Coach<span className="text-primary">Lucy</span>
          </div>
        </Link>

        {/* MENÚ DESKTOP */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => scrollToSection(link.id)}
              className="text-gray-300 hover:text-primary font-medium transition-colors cursor-pointer"
            >
              {link.name}
            </button>
          ))}
        </div>

        {/* CTAs DESKTOP */}
        <div className="hidden md:flex items-center gap-3">
          <Link to="/login" className="text-gray-300 hover:text-white font-medium px-4 py-2 transition-colors">
            Ingresar
          </Link>
          <Link to="/register" className="flex items-center gap-1.5 bg-gray-800 hover:bg-gray-700 text-white px-5 py-2.5 rounded-btn font-semibold transition-colors">
            Registrarse
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* BOTÓN MENÚ MÓVIL */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-gray-300 hover:text-white p-2 cursor-pointer"
        >
          {isOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
        </button>
      </div>

      {/* OVERLAY MENÚ MÓVIL (Animado con Framer Motion) */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="absolute top-20 left-0 w-full bg-gray-900 border-b border-gray-800 p-6 md:hidden z-40 selection:bg-emerald-500 selection:text-white"
          >
            <div className="flex flex-col gap-5 mb-8">
              {navLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => scrollToSection(link.id)}
                  className="text-xl text-gray-200 hover:text-emerald-400 font-medium text-left cursor-pointer"
                >
                  {link.name}
                </button>
              ))}
            </div>

            <div className="flex flex-col gap-3">
              <Link to="/login" className="text-xl text-gray-200 hover:text-white font-medium py-3 text-center transition-colors">
                Ingresar a mi cuenta
              </Link>
              <Link to="/register" className="flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-gray-950 px-5 py-4 rounded-xl font-bold text-lg transition-colors">
                Registrarse Gratis
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}