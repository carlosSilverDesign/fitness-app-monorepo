import type { Response } from 'express';
import prisma from '../db/prisma.js';
import { type AuthRequest } from '../middlewares/auth.middleware.js';
import { analyzeComposition, calculateAge, type Skinfolds } from '../utils/bodyComposition.js';

// POST: Registrar una nueva medición
export const createMeasurement = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ error: 'Usuario no autenticado.' });
      return;
    }

    // 2. Obtenemos los datos que envía el usuario en el Body
    const {
      weightKg, waistCm, hipCm,
      tricepFold, pectoralFold, abdominalFold, thighFold,
      bicepFold, subscapularFold, suprailiacFold, midaxillaryFold
    } = req.body;

    // 3. Buscamos el perfil del usuario para obtener su género y fecha de nacimiento (necesarios para las fórmulas)
    const profile = await prisma.profile.findUnique({ where: { userId } });

    let compResult = null;

    // 4. Si el usuario tiene perfil con género y fecha de nacimiento, intentamos calcular su composición
    if (profile && profile.gender && profile.dateOfBirth) {
      const age = calculateAge(profile.dateOfBirth);
      const folds: Skinfolds = {
        tricep: tricepFold, pectoral: pectoralFold, abdominal: abdominalFold, thigh: thighFold,
        bicep: bicepFold, subscapular: subscapularFold, suprailiac: suprailiacFold, midaxillary: midaxillaryFold
      };

      // Enviamos todo a nuestro cerebro matemático
      compResult = analyzeComposition(profile.gender, age, weightKg, folds);
    }

    // 5. Guardamos en la base de datos, combinando los datos manuales con los calculados
    const newMeasurement = await prisma.measurement.create({
      data: {
        userId,
        // Datos del body (Si vienen undefined de Postman, los forzamos a null)
        weightKg: weightKg ?? null,
        waistCm: waistCm ?? null,
        hipCm: hipCm ?? null,
        tricepFold: tricepFold ?? null,
        pectoralFold: pectoralFold ?? null,
        abdominalFold: abdominalFold ?? null,
        thighFold: thighFold ?? null,
        bicepFold: bicepFold ?? null,
        subscapularFold: subscapularFold ?? null,
        suprailiacFold: suprailiacFold ?? null,
        midaxillaryFold: midaxillaryFold ?? null,

        // Metadatos científicos (Si compResult es nulo, todo esto será nulo)
        formulaUsed: compResult?.formulaUsed ?? null,
        bodyDensity: compResult?.bodyDensity ?? null,
        bodyFatPercentage: compResult?.bodyFatPercentage ?? null,
        fatMassKg: compResult?.fatMassKg ?? null,
        fatFreeMassKg: compResult?.fatFreeMassKg ?? null
      },
    });

    res.status(201).json({
      message: 'Medición registrada. ' + (compResult ? `Cálculo realizado con ${compResult.formulaUsed}` : 'Solo medidas simples.'),
      measurement: newMeasurement,
    });
  } catch (error) {
    // ...
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