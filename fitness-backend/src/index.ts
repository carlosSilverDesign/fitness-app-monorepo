import express, { type Request, type Response } from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.routes.js'; // Importamos el router
import profileRoutes from './routes/profile.routes.js';
import measurementRoutes from './routes/measurement.routes.js';

const app = express();
app.use(cors({
  origin: 'http://localhost:5173', // Solo permitimos a nuestro frontend
  credentials: true
}));
const PORT: number = 3000;

// 1. PRIMERO: El middleware que traduce el JSON
app.use(express.json());

// 2. Rutas públicas (No requieren token)
app.use('/api/v1/auth', authRoutes);

// 3. Rutas protegidas (Requerirán token gracias al router que configuramos)
app.use('/api/v1/profiles', profileRoutes);

app.use('/api/v1/measurements', measurementRoutes);

app.get('/', (req: Request, res: Response): void => {
  res.send('¡Hola! El servidor del Fitness App está vivo y estrictamente tipado.');
});

app.listen(PORT, (): void => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});