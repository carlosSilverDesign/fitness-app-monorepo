import { Mail } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
// 🟢 1. IMPORTAMOS TU LOGO
import logoSvg from '../assets/Logo-Lugym-2026.svg';

const InstagramIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
);

const FacebookIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
);

const TiktokIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5v3a8 8 0 0 1-5-3v5.5a4 4 0 0 1-4 4 4 4 0 0 1-4-4 4 4 0 0 1 4-4v3a1 1 0 0 0-1 1 1 1 0 0 0 1 1 1 1 0 0 0 1-1z"/></svg>
);

export default function Footer() {
  const navigate = useNavigate();
  const location = useLocation();

  // 🟢 2. LÓGICA DE NAVEGACIÓN INTELIGENTE (Igual que en tu Navbar)
  const handleScrollTo = (id: string) => {
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        const element = document.getElementById(id);
        // Si es la calculadora, también disparamos el evento del resplandor
        if (id === 'calculator-section') window.dispatchEvent(new Event('nav-calculator-clicked'));
        if (element) element.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const element = document.getElementById(id);
      if (id === 'calculator-section') window.dispatchEvent(new Event('nav-calculator-clicked'));
      if (element) element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-bg-dark border-t border-gray-800 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          
          {/* LOGO Y DESCRIPCIÓN */}
          <div className="col-span-1 md:col-span-2">
            <Link to="/" onClick={() => window.scrollTo(0,0)} className="block mb-6">
              {/* 🟢 Reemplazamos el texto por la imagen de tu logo */}
              <img src={logoSvg} alt="Coach Lucy Perez Logo" className="h-16 w-auto object-contain" />
            </Link>
            <p className="text-gray-400 max-w-md">
              Transformando la ciencia de la composición corporal en resultados reales. No adivines tu progreso, mídelo con precisión clínica.
            </p>
          </div>

          {/* PLATAFORMA (ENLACES CONECTADOS) */}
          <div>
            <h4 className="text-white font-bold mb-4 uppercase tracking-wider text-sm">Plataforma</h4>
            <ul className="space-y-3 text-gray-400">
              <li>
                <button onClick={() => handleScrollTo('calculator-section')} className="hover:text-primary transition-colors text-left">
                  Calculadora Gratuita
                </button>
              </li>
              <li>
                <button onClick={() => handleScrollTo('services-section')} className="hover:text-primary transition-colors text-left">
                  Servicios
                </button>
              </li>
              <li>
                <button onClick={() => handleScrollTo('services-section')} className="hover:text-primary transition-colors text-left">
                  Asesoría Premium
                </button>
              </li>
            </ul>
          </div>

          {/* SÍGUENOS (REDES SOCIALES) */}
          <div>
            <h4 className="text-white font-bold mb-4 uppercase tracking-wider text-sm">Síguenos</h4>
            <div className="flex gap-4">
              {/* 🟢 REEMPLAZA EL '#' POR TU ENLACE REAL EN EL ATRIBUTO href="..." */}
              
              <a href="#" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-gray-900 flex items-center justify-center text-gray-400 hover:bg-primary hover:text-bg-dark transition-all">
                <InstagramIcon className="w-5 h-5" />
              </a>
              
              <a href="#" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-gray-900 flex items-center justify-center text-gray-400 hover:bg-primary hover:text-bg-dark transition-all">
                <FacebookIcon className="w-5 h-5" />
              </a>
              
              <a href="#" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-gray-900 flex items-center justify-center text-gray-400 hover:bg-primary hover:text-bg-dark transition-all">
                <TiktokIcon className="w-5 h-5" />
              </a>
              
              <a href="mailto:hola@coachlucy.com" className="w-10 h-10 rounded-full bg-gray-900 flex items-center justify-center text-gray-400 hover:bg-primary hover:text-bg-dark transition-all">
                <Mail className="w-5 h-5" />
              </a>

            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm">© {new Date().getFullYear()} Coach Lucy. Todos los derechos reservados.</p>
          <div className="flex gap-6 text-sm text-gray-500">
            <a href="#" className="hover:text-white transition-colors">Privacidad</a>
            <a href="#" className="hover:text-white transition-colors">Términos</a>
          </div>
        </div>
      </div>
    </footer>
  );
}