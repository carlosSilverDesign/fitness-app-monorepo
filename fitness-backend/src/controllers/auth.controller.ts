import type { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
// IMPORTANTE: En NodeNext (ES Modules), las importaciones locales DEBEN llevar la extensión ".js" 
import prisma from '../db/prisma.js';

export const registerUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, firstName, lastName } = req.body;

    if (!email || !password || !firstName || !lastName) {
      res.status(400).json({ error: 'Todos los campos son obligatorios (email, password, nombre y apellido).' });
      return;
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      res.status(409).json({ error: 'El usuario ya está registrado.' });
      return;
    }

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    const newUser = await prisma.user.create({
      data: {
        email,
        passwordHash,
        role: 'FREE', // Valor por defecto
        profile: {
          create: {
            firstName,
            lastName,
          }
        }
      },
      // 🟢 Pedimos a Prisma que devuelva el perfil
      include: {
        profile: true
      }
    });

    // 🟢 Estandarizamos la respuesta para el Frontend
    res.status(201).json({
      message: 'Usuario y perfil creados exitosamente',
      user: {
        id: newUser.id,
        email: newUser.email,
        role: newUser.role,
        firstName: newUser.profile?.firstName || '',
        lastName: newUser.profile?.lastName || '',
      },
    });
  } catch (error) {
    console.error('Error en registerUser:', error);
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
};


export const loginUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ error: 'El email y la contraseña son obligatorios.' });
      return;
    }

    // 🟢 EL FIX: Agregamos include: { profile: true }
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        profile: true // Ahora Prisma sí traerá el nombre y apellido
      }
    });

    if (!user) {
      res.status(401).json({ error: 'Credenciales inválidas.' });
      return;
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    
    if (!isPasswordValid) {
      res.status(401).json({ error: 'Credenciales inválidas.' });
      return;
    }

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw new Error('JWT_SECRET no está configurado en el archivo .env');
    }

    const token = jwt.sign(
      { userId: user.id, role: user.role },
      jwtSecret,                            
      { expiresIn: '7d' }                   
    );

    // 🟢 Estandarizamos la respuesta para inyectarla perfecto en AuthContext
    res.status(200).json({
      message: 'Inicio de sesión exitoso',
      token, 
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        firstName: user.profile?.firstName || 'Atleta', // Fallback de seguridad
        lastName: user.profile?.lastName || '',
        gender: user.profile?.gender,
        dateOfBirth: user.profile?.dateOfBirth,
        heightCm: user.profile?.heightCm
      },
    });
  } catch (error) {
    console.error('Error en loginUser:', error);
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
};

// 🟢 EXTRA: Función para validar el token (checkAuth)
// Si en tu backend tienes una ruta GET /me para validar la sesión, asegúrate de que sea así:
export const getMe = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user?.userId; // Extraído de tu middleware de JWT
    
    if (!userId) {
      res.status(401).json({ error: 'No autorizado' });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { profile: true } // Siempre incluir el perfil
    });

    if (!user) {
      res.status(404).json({ error: 'Usuario no encontrado' });
      return;
    }

    res.status(200).json({
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        firstName: user.profile?.firstName || 'Atleta',
        lastName: user.profile?.lastName || '',
        gender: user.profile?.gender,
        dateOfBirth: user.profile?.dateOfBirth,
        heightCm: user.profile?.heightCm
      }
    });
  } catch (error) {
    console.error('Error en getMe:', error);
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
};
