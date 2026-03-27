import { Router } from 'express';
// Importamos nuestro guardia de seguridad
import { verifyToken } from '../middlewares/auth.middleware.js';
import { createProfile } from '../controllers/profile.controller.js';

const router: Router = Router();

// Protegemos la ruta colocando "verifyToken" ANTES del controlador
router.post('/', verifyToken, createProfile);

export default router;