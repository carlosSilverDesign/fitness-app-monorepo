import { Router } from 'express';
// Importamos nuestro guardia de seguridad
import { verifyToken } from '../middlewares/auth.middleware.js';
import { createProfile, getProfile, updateProfile } from '../controllers/profile.controller.js';

const router: Router = Router();

// POST: Crear perfil (El que ya probaste)
router.post('/', verifyToken, createProfile);

// GET: Leer el perfil del usuario actual
router.get('/', verifyToken, getProfile);

// PUT: Actualizar datos del perfil
router.put('/', verifyToken, updateProfile);

export default router;