import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';

function App() {
  return (
    <Router>
      <Routes>
        {/* El Landing Page será nuestra ruta principal */}
        <Route path="/" element={<Landing />} />
        
        {/* Dejamos preparadas las rutas separadas para el futuro */}
        <Route path="/login" element={<div className="p-10 text-white text-2xl">Página de Login en construcción...</div>} />
        <Route path="/register" element={<div className="p-10 text-white text-2xl">Página de Registro en construcción...</div>} />
        <Route path="/dashboard" element={<div className="p-10 text-white text-2xl">Dashboard VIP en construcción...</div>} />
      </Routes>
    </Router>
  );
}

export default App;