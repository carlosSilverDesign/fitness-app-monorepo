import type { Response } from 'express';
import prisma from '../db/prisma.js';
import { type AuthRequest } from '../middlewares/auth.middleware.js';

// POST: Registrar una nueva medición
export const createMeasurement = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ error: 'Usuario no autenticado.' });
      return;
    }

    // Extraemos todos los datos posibles del body (todos son opcionales en el schema)
    const {
      weightKg,
      bodyFatPercentage,
      tricepFold,
      pectoralFold,
      abdominalFold,
      thighFold,
      waistCm,
      hipCm
    } = req.body;

    const newMeasurement = await prisma.measurement.create({
      data: {
        userId,
        weightKg,
        bodyFatPercentage,
        tricepFold,
        pectoralFold,
        abdominalFold,
        thighFold,
        waistCm,
        hipCm,
      },
    });

    res.status(201).json({
      message: 'Medición registrada exitosamente',
      measurement: newMeasurement,
    });
  } catch (error) {
    console.error('Error en createMeasurement:', error);
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
};

// GET: Obtener el historial completo de mediciones del usuario
export const getMeasurements = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ error: 'Usuario no autenticado.' });
      return;
    }

    // Buscamos todas las mediciones y las ordenamos de la más reciente a la más antigua
    const measurements = await prisma.measurement.findMany({
      where: { userId },
      orderBy: { date: 'desc' },
    });

    res.status(200).json({ measurements });
  } catch (error) {
    console.error('Error en getMeasurements:', error);
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
};