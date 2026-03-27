import express, { type Request, type Response } from 'express';
import authRoutes from './routes/auth.routes.js'; // Importamos el router

const app = express();
const PORT: number = 3000;

// 1. PRIMERO: El middleware que traduce el JSON
app.use(express.json());

// 2. DESPUÉS: Tus rutas
app.use('/api/v1/auth', authRoutes);

app.get('/', (req: Request, res: Response): void => {
  res.send('¡Hola! El servidor del Fitness App está vivo.');
});

app.listen(PORT, (): void => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});