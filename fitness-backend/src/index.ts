import express, { type Request,  type Response } from 'express';

// Inicializamos la aplicación de Express
const app = express();
const PORT = 3000;

// Permitimos que nuestra API entienda formato JSON
app.use(express.json());

// Nuestro primer Endpoint de prueba
app.get('/', (req: Request, res: Response) => {
  res.send('¡Hola! El servidor del Fitness App está vivo y estrictamente tipado.');
});

// Le decimos al servidor que escuche en el puerto 3000
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});