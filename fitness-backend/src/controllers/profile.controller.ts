import type { Response } from 'express';
import prisma from '../db/prisma.js';
// Importamos la interfaz especial que creamos en el middleware
import { type AuthRequest } from '../middlewares/auth.middleware.js';

export const createProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    // 1. Extraemos el ID del usuario directamente del token (¡Gracias, Middleware!)
    const userId = req.user?.userId;

    if (!userId) {
      res.status(401).json({ error: 'Usuario no autenticado.' });
      return;
    }

    // 2. Extraemos los datos físicos del cuerpo de la petición
    const { firstName, lastName, gender, heightCm, dateOfBirth } = req.body;

    if (!firstName || !lastName) {
      res.status(400).json({ error: 'El nombre y apellido son obligatorios.' });
      return;
    }

    // 3. Verificamos que el usuario no tenga ya un perfil creado
    const existingProfile = await prisma.profile.findUnique({
      where: { userId },
    });

    if (existingProfile) {
      res.status(409).json({ error: 'El perfil ya existe. Usa la ruta de actualización.' });
      return;
    }

    // 4. Si envían fecha de nacimiento, la convertimos a formato Date para Prisma
    let parsedDate = null;
    if (dateOfBirth) {
      parsedDate = new Date(dateOfBirth);
    }

    // 5. Guardamos el perfil en la base de datos
    const newProfile = await prisma.profile.create({
      data: {
        userId,
        firstName,
        lastName,
        gender,
        heightCm,
        dateOfBirth: parsedDate,
      },
    });

    res.status(201).json({
      message: 'Perfil creado exitosamente',
      profile: newProfile,
    });
  } catch (error) {
    console.error('Error en createProfile:', error);
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
};