import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import 'dotenv/config';

// 1. Magia de TypeScript: Creamos una interfaz personalizada que hereda de Request.
// Esto nos permite añadirle la propiedad "user" a la petición para que los
// controladores sepan exactamente quién está haciendo la solicitud.
export interface AuthRequest extends Request {
  user?: {
    userId: string;
    role: string;
  };
}

// 2. Nuestro Middleware (El Guardia)
export const verifyToken = (req: AuthRequest, res: Response, next: NextFunction): void => {
  try {
    // A. El cliente debe enviar el token en los "Headers" bajo la llave "Authorization"
    // El formato estándar de la industria es: "Bearer eyJhbGciOi..."
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ error: 'Acceso denegado. No se proporcionó un token o el formato es incorrecto.' });
      return;
    }

    // B. Extraemos solo el token, separando la palabra "Bearer "
    const token = authHeader.split(' ')[1];

    if (!token) {
      res.status(401).json({ error: 'Acceso denegado. Token vacío.' });
      return;
    }

    // C. Verificamos la firma usando nuestra clave secreta del .env
    const jwtSecret = process.env.JWT_SECRET!;
    
    // Si el token es falso o expiró, esta línea lanzará un error y caerá en el "catch"
    const decoded = jwt.verify(token, jwtSecret) as { userId: string; role: string };

    // D. ¡El token es válido! Pegamos los datos del usuario en la petición (req)
    req.user = decoded;

    // E. Le decimos a Express: "Todo en orden, deja pasar la petición al controlador"
    next();
    
  } catch (error) {
    // Atrapamos errores específicos de JWT por si el token expiró o fue manipulado
    console.error('Error al verificar el token:', error);
    res.status(401).json({ error: 'Token inválido o ha expirado. Por favor, inicia sesión nuevamente.' });
  }
};

