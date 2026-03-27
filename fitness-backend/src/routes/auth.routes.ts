import { Router } from 'express';
// Recuerda: Importación local siempre con ".js" al final
import { registerUser, loginUser } from '../controllers/auth.controller.js';

const router: Router = Router();

// Endpoint para registro
router.post('/register', registerUser);

// NUEVO: Endpoint para inicio de sesión
router.post('/login', loginUser);

export default router;