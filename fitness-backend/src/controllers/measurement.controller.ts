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

    const {
      weightKg, waistCm, hipCm,
      tricepFold, pectoralFold, abdominalFold, thighFold,
      bicepFold, subscapularFold, suprailiacFold, midaxillaryFold
    } = req.body;

    const profile = await prisma.profile.findUnique({ where: { userId } });

    // ==========================================
    // 🟢 EL FIX DEFINITIVO (Adiós al Hack)
    // ==========================================
    // Si el perfil no tiene género o fecha de nacimiento, detenemos todo
    // y le enviamos un error 400 (Bad Request) al frontend con instrucciones claras.
    if (!profile || !profile.gender || !profile.dateOfBirth) {
      res.status(400).json({ 
        error: 'Para calcular tu composición corporal con precisión, primero debes completar tu Ficha Médica (Género y Fecha de Nacimiento).' 
      });
      return; // Salimos de la función aquí mismo
    }

    // Si llegamos aquí, el usuario SÍ tiene los datos completos.
    // Hacemos la matemática real y científica.
    const age = calculateAge(profile.dateOfBirth);
    const folds: Skinfolds = {
      tricep: tricepFold, pectoral: pectoralFold, abdominal: abdominalFold, thigh: thighFold,
      bicep: bicepFold, subscapular: subscapularFold, suprailiac: suprailiacFold, midaxillary: midaxillaryFold
    };

    const compResult = analyzeComposition(profile.gender, age, weightKg, folds, req.body.formulaUsed);

    // Guardamos en la base de datos
    const newMeasurement = await prisma.measurement.create({
      data: {
        userId,
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

        // 🟢 EL FIX DE PRISMA: Obligamos a que el undefined se convierta en null
        formulaUsed: compResult?.formulaUsed ?? null,
        bodyDensity: compResult?.bodyDensity ?? null,
        bodyFatPercentage: compResult?.bodyFatPercentage ?? null,
        fatMassKg: compResult?.fatMassKg ?? null,
        fatFreeMassKg: compResult?.fatFreeMassKg ?? null
      },
    });

    res.status(201).json({
      message: `Cálculo exitoso usando la fórmula ${compResult?.formulaUsed}`,
      measurement: newMeasurement,
    });
  } catch (error) {
    console.error('Error en createMeasurement:', error);
    res.status(500).json({ error: 'Error interno del servidor en Lugym.' });
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

// PUT: Actualizar una medición existente
export const updateMeasurement = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const id = req.params.id; // Leemos el ID directamente

    if (!userId) {
      res.status(401).json({ error: 'Usuario no autenticado.' });
      return;
    }

    // 🟢 EL FIX PARA TYPESCRIPT: Validación estricta del tipo
    if (!id || typeof id !== 'string') {
      res.status(400).json({ error: 'ID de medición inválido o ausente.' });
      return;
    }

    // 1. Verificamos que la medición exista y pertenezca a este usuario
    const existingMeasurement = await prisma.measurement.findUnique({
      where: { id }
    });

    if (!existingMeasurement || existingMeasurement.userId !== userId) {
      res.status(404).json({ error: 'Medición no encontrada o no tienes permisos para editarla.' });
      return;
    }

    const {
      weightKg, waistCm, hipCm,
      tricepFold, pectoralFold, abdominalFold, thighFold,
      bicepFold, subscapularFold, suprailiacFold, midaxillaryFold,
      formulaUsed
    } = req.body;

    const profile = await prisma.profile.findUnique({ where: { userId } });

    if (!profile || !profile.gender || !profile.dateOfBirth) {
      res.status(400).json({ 
        error: 'Para calcular tu composición corporal, debes completar tu Ficha Médica.' 
      });
      return;
    }

    // 2. Recalculamos la matemática con los datos modificados
    const age = calculateAge(profile.dateOfBirth);
    const folds: Skinfolds = {
      tricep: tricepFold, pectoral: pectoralFold, abdominal: abdominalFold, thigh: thighFold,
      bicep: bicepFold, subscapular: subscapularFold, suprailiac: suprailiacFold, midaxillary: midaxillaryFold
    };

    const compResult = analyzeComposition(profile.gender, age, weightKg, folds, formulaUsed);

    // 3. Sobreescribimos el registro en la base de datos
    const updatedMeasurement = await prisma.measurement.update({
      where: { id },
      data: {
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

        formulaUsed: compResult?.formulaUsed ?? null,
        bodyDensity: compResult?.bodyDensity ?? null,
        bodyFatPercentage: compResult?.bodyFatPercentage ?? null,
        fatMassKg: compResult?.fatMassKg ?? null,
        fatFreeMassKg: compResult?.fatFreeMassKg ?? null
      },
    });

    res.status(200).json({
      message: `Registro actualizado correctamente usando ${compResult?.formulaUsed}`,
      measurement: updatedMeasurement,
    });
  } catch (error) {
    console.error('Error en updateMeasurement:', error);
    res.status(500).json({ error: 'Error interno al actualizar la medición.' });
  }
};