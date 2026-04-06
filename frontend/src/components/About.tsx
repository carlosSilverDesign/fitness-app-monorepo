import { motion } from 'framer-motion';
import { Award, Users, TrendingUp } from 'lucide-react';
import coachLucyImg from '../assets/coach-lucy.jpg';

export default function About() {
  return (
    <section className="scroll-mt-20 relative bg-bg-dark py-24 overflow-hidden" id="sobre-mi">
      {/* Elemento de fondo audaz */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-primary/10 blur-[100px] rounded-full pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Columna Izquierda: Imagen + Tarjeta Flotante */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative md:pr-12 md:pb-12"
          >
            <div className="aspect-[4/5] bg-gray-900 rounded-3xl overflow-hidden border border-gray-800 relative shadow-2xl z-10">
              <div className="absolute inset-0 bg-gradient-to-t from-bg-dark via-bg-dark/20 to-transparent z-10" />
              <img 
                src={coachLucyImg} 
                alt="Coach Lucy Pérez" 
                className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
              />
            </div>

            {/* Tarjeta Flotante Animada */}
            <motion.div 
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="absolute bottom-4 right-4 md:-bottom-4 md:-right-4 bg-gray-800/90 backdrop-blur-xl p-5 md:p-6 rounded-2xl border border-gray-700 shadow-2xl z-20 w-max"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 md:w-14 md:h-14 bg-primary/20 rounded-full flex items-center justify-center text-primary shrink-0">
                  <Award className="w-6 h-6 md:w-7 md:h-7" />
                </div>
                <div>
                  <p className="text-2xl md:text-3xl font-extrabold text-white">+5<span className="text-primary">Años</span></p>
                  <p className="text-xs md:text-sm text-gray-400 font-medium uppercase tracking-wider">De Experiencia Clínica</p>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Columna Derecha: Tipografía Audaz y Texto */}
          <div className="space-y-8">
            <motion.h2 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-5xl md:text-7xl font-black text-white tracking-tighter leading-tight"
            >
              La ciencia <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-emerald-400">
                no miente.
              </span>
            </motion.h2>

            <motion.p 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg text-gray-400 leading-relaxed"
            >
              Soy Coach Lucy. Durante años vi cómo las básculas tradicionales destruían la motivación de mis atletas. El peso es solo un número ciego; la composición corporal es la verdadera historia de tu transformación.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="grid grid-cols-2 gap-6 pt-6 border-t border-gray-800"
            >
              <div>
                <Users className="w-8 h-8 text-primary mb-3" />
                <h4 className="text-white font-bold text-xl mb-1">+2,000</h4>
                <p className="text-sm text-gray-500">Vidas Transformadas</p>
              </div>
              <div>
                <TrendingUp className="w-8 h-8 text-primary mb-3" />
                <h4 className="text-white font-bold text-xl mb-1">Resultados</h4>
                <p className="text-sm text-gray-500">Basados en evidencia</p>
              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}