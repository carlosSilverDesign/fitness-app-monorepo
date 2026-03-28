import type { Response, NextFunction } from 'express';
// Importamos la interfaz que ya tiene el req.user
import { type AuthRequest } from './auth.middleware.js';

// Este guardia recibe un arreglo con los roles que tienen permiso de pasar.
// Ejemplo de uso: authorizeRoles('PREMIUM', 'TRAINER')
export const authorizeRoles = (...allowedRoles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    // 1. Verificamos que el usuario exista en la petición (cortesía del verifyToken)
    if (!req.user || !req.user.role) {
      res.status(401).json({ error: 'Usuario no autenticado o rol no definido.' });
      return;
    }

    // 2. Verificamos si el rol del usuario está dentro de la lista de permitidos
    if (!allowedRoles.includes(req.user.role)) {
      res.status(403).json({ 
        error: 'Acceso denegado. Se requiere una suscripción o permisos superiores para esta acción.' 
      });
      return;
    }

    // 3. Si tiene el rol correcto, ¡lo dejamos pasar al controlador!
    next();
  };
};