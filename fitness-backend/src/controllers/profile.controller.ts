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


// NUEVA FUNCIÓN: Obtener el perfil del usuario autenticado
export const getProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    // 1. Extraemos el ID del token
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ error: 'Usuario no autenticado.' });
      return;
    }

    // 2. Buscamos el perfil en la base de datos E INCLUIMOS LOS DATOS DEL USUARIO (Email y Rol)
    const profile = await prisma.profile.findUnique({
      where: { userId },
      include: {
        user: true, // 🟢 EL FIX: Le decimos a Prisma que traiga el email desde la tabla principal
      }
    });

    // 3. Si no existe, le avisamos amablemente
    if (!profile) {
      res.status(404).json({ error: 'Perfil no encontrado. Por favor, crea uno primero.' });
      return;
    }

    // 4. Devolvemos los datos del perfil
    res.status(200).json({
      profile: profile, // Aquí van firstName, lastName, etc.
      user: {
        role: profile.user.role,
        email: profile.user.email, // 🟢 ESTA ES LA LÍNEA MÁGICA QUE SOLUCIONA TU ADMIN
      }
    });
  } catch (error) {
    console.error('Error en getProfile:', error);
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
};


// NUEVA FUNCIÓN: Actualizar el perfil (Estrictamente tipada)
export const updateProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ error: 'Usuario no autenticado.' });
      return;
    }

    const existingProfile = await prisma.profile.findUnique({ where: { userId } });
    if (!existingProfile) {
      res.status(404).json({ error: 'Perfil no encontrado para actualizar.' });
      return;
    }

    const { firstName, lastName, gender, heightCm, dateOfBirth } = req.body;

    // Construimos el objeto de actualización dinámicamente.
    // Si la variable es undefined, la propiedad simplemente no se crea,
    // haciendo a TypeScript (y a Prisma) inmensamente felices.
    const dataToUpdate = {
      ...(firstName !== undefined && { firstName }),
      ...(lastName !== undefined && { lastName }),
      ...(gender !== undefined && { gender }),
      ...(heightCm !== undefined && { heightCm }),
      ...(dateOfBirth !== undefined && { dateOfBirth: new Date(dateOfBirth) }),
    };

    const updatedProfile = await prisma.profile.update({
      where: { userId },
      data: dataToUpdate, // Pasamos el objeto limpio
    });

    res.status(200).json({
      message: 'Perfil actualizado exitosamente',
      profile: updatedProfile,
    });
  } catch (error) {
    console.error('Error en updateProfile:', error);
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
};