import { Router } from 'express';
// Importamos nuestro guardia de seguridad
import { verifyToken } from '../middlewares/auth.middleware.js';
import type { Response } from 'express';
import type { AuthRequest } from '../middlewares/auth.middleware.js';
import { authorizeRoles } from '../middlewares/role.middleware.js';

import { createProfile, getProfile, updateProfile } from '../controllers/profile.controller.js';

const router: Router = Router();

// POST: Crear perfil (El que ya probaste)
router.post('/', verifyToken, createProfile);

// GET: Leer el perfil del usuario actual
router.get('/', verifyToken, getProfile);

// PUT: Actualizar datos del perfil
router.put('/', verifyToken, updateProfile);

// ==========================================
// NUEVA RUTA DE PRUEBA VIP
// ==========================================
// Orden: 1. Verifica Token -> 2. Verifica Rol -> 3. Ejecuta Controlador
router.get('/vip-area', 
  verifyToken, 
  authorizeRoles('PREMIUM', 'TRAINER', 'ADMIN'), // El rol FREE NO está aquí
  (req: AuthRequest, res: Response) => {
    res.status(200).json({ 
      message: '¡Bienvenido a la zona VIP!',
      tuRolEs: req.user?.role 
    });
  }
);

export default router;