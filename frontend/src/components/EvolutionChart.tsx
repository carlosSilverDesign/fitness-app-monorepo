import { useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Activity } from 'lucide-react';
import type { MeasurementData } from '../pages/Dashboard';

export default function EvolutionChart({ measurements }: { measurements: MeasurementData[] }) {
  
  // Transformamos los datos para Recharts
  const chartData = useMemo(() => {
    if (!measurements || measurements.length === 0) return [];

    // 1. Invertimos para que el más antiguo esté a la izquierda (línea de tiempo normal)
    // 2. Filtramos solo los que tengan cálculos de masa magra/grasa válidos
    return [...measurements]
      .reverse()
      .filter(m => m.fatFreeMassKg && m.fatMassKg)
      .map(m => {
        const dateObj = new Date(m.date || m.createdAt);
        return {
          fecha: dateObj.toLocaleDateString('es-ES', { day: '2-digit', month: 'short' }),
          Musculo: Number(m.fatFreeMassKg?.toFixed(1)),
          Grasa: Number(m.fatMassKg?.toFixed(1)),
          pesoTotal: m.weightKg
        };
      });
  }, [measurements]);

  if (chartData.length < 2) {
    return (
      <div className="bg-gray-900/50 rounded-2xl border border-gray-800 p-8 text-center">
        <Activity className="w-10 h-10 text-gray-700 mx-auto mb-3" />
        <p className="text-gray-400 font-medium">Registra al menos 2 mediciones para generar tu gráfica de evolución.</p>
      </div>
    );
  }

  return (
    <div className="bg-bg-card rounded-2xl border border-gray-800 p-4 md:p-6 shadow-xl">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <Activity className="w-5 h-5 text-primary" />
          Curva de Recomposición
        </h3>
      </div>
      
      {/* Contenedor Responsivo de Recharts */}
      <div className="w-full h-64 md:h-80">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            {/* Cuadrícula de fondo sutil */}
            <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
            
            {/* Ejes */}
            <XAxis dataKey="fecha" stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} dy={10} />
            <YAxis stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} dx={-10} />
            
            {/* Tooltip personalizado (Modo Oscuro) */}
            <Tooltip 
              contentStyle={{ backgroundColor: '#111827', borderColor: '#374151', borderRadius: '12px', color: '#fff' }}
              itemStyle={{ fontWeight: 'bold' }}
              labelStyle={{ color: '#9ca3af', marginBottom: '4px' }}
            />
            
            <Legend verticalAlign="top" height={36} iconType="circle" wrapperStyle={{ fontSize: '12px', color: '#9ca3af' }}/>

            {/* OLA 1: Músculo (Verde/Primario) - Va en el fondo */}
            <Area 
              type="monotone" 
              dataKey="Musculo" 
              stackId="1" 
              stroke="#10b981" 
              fill="#10b981" 
              fillOpacity={0.2} 
              strokeWidth={3}
            />
            {/* OLA 2: Grasa (Naranja/Rojo) - Se apila encima */}
            <Area 
              type="monotone" 
              dataKey="Grasa" 
              stackId="1" 
              stroke="#f59e0b" 
              fill="#f59e0b" 
              fillOpacity={0.2} 
              strokeWidth={3}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <p className="text-center text-xs text-gray-500 mt-4">
        *Valores expresados en Kilogramos (kg). El objetivo es que la curva verde suba o se mantenga, y la amarilla baje.
      </p>
    </div>
  );
}