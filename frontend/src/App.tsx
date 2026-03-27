import type { ReactElement } from 'react';

// Definimos estrictamente que la función devuelve un elemento de React
function App(): ReactElement {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-950">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-emerald-400 mb-4">
          ¡Frontend Iniciado!
        </h1>
        <p className="text-gray-300 text-lg">
          Vite + React + Tailwind v4 con Tipado Estricto 🚀
        </p>
      </div>
    </div>
  );
}

export default App;