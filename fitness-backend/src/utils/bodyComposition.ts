// src/utils/bodyComposition.ts

export type Skinfolds = {
  tricep?: number;
  pectoral?: number;
  abdominal?: number;
  thigh?: number;
  bicep?: number;
  subscapular?: number;
  suprailiac?: number;
  midaxillary?: number;
};

export type CompositionResult = {
  formulaUsed: string;
  bodyDensity: number;
  bodyFatPercentage: number;
  fatMassKg?: number;
  fatFreeMassKg?: number;
};

// Utilidad: Ecuación de Siri
const applySiriEquation = (db: number): number => {
  return (495 / db) - 450;
};

// Utilidad: Calcular masas derivadas si tenemos el peso
const calculateMasses = (weightKg: number | undefined, bfPercentage: number) => {
  if (!weightKg) return { fatMassKg: undefined, fatFreeMassKg: undefined };
  const fatMassKg = (weightKg * bfPercentage) / 100;
  const fatFreeMassKg = weightKg - fatMassKg;
  return { fatMassKg, fatFreeMassKg };
};

// CEREBRO PRINCIPAL
export const analyzeComposition = (
  gender: string,
  age: number,
  weightKg: number | undefined,
  folds: Skinfolds,
  requestedProtocol: string
): CompositionResult | null => {
  let db: number | null = null;
  let formulaUsed = '';

  // 1. Intentamos Jackson & Pollock 7 Pliegues (La más precisa)
  if (folds.tricep && folds.pectoral && folds.abdominal && folds.thigh && 
      folds.suprailiac && folds.subscapular && folds.midaxillary) {
    const sum7 = folds.tricep + folds.pectoral + folds.abdominal + folds.thigh + folds.suprailiac + folds.subscapular + folds.midaxillary;
    if (gender === 'MASCULINO') {
      db = 1.112 - (0.00043499 * sum7) + (0.00000055 * Math.pow(sum7, 2)) - (0.00028826 * age);
    } else if (gender === 'FEMENINO') {
      db = 1.097 - (0.00046971 * sum7) + (0.00000056 * Math.pow(sum7, 2)) - (0.00012828 * age);
    }
    formulaUsed = 'JACKSON_POLLOCK_7';
  } 
  // 2. Si no están los 7, intentamos Jackson & Pollock 3 Pliegues
  else if (gender === 'MASCULINO' && folds.pectoral && folds.abdominal && folds.thigh) {
    const sum3 = folds.pectoral + folds.abdominal + folds.thigh;
    db = 1.10938 - (0.0008267 * sum3) + (0.0000016 * Math.pow(sum3, 2)) - (0.0002574 * age);
    formulaUsed = 'JACKSON_POLLOCK_3';
  } 
  else if (gender === 'FEMENINO' && folds.tricep && folds.suprailiac && folds.thigh) {
    const sum3 = folds.tricep + folds.suprailiac + folds.thigh;
    db = 1.0994921 - (0.0009929 * sum3) + (0.0000023 * Math.pow(sum3, 2)) - (0.0001392 * age);
    formulaUsed = 'JACKSON_POLLOCK_3';
  }

  // 3. 🟢 NUEVA: DURNIN & WOMERSLEY 4 PLIEGUES
  else if (requestedProtocol === 'DW4' && folds.tricep && folds.bicep && folds.subscapular && folds.suprailiac) {
    const sum4 = folds.tricep + folds.bicep + folds.subscapular + folds.suprailiac;
    const logSum = Math.log10(sum4);
    
    if (gender === 'MASCULINO') {
      if (age < 30) db = 1.1620 - (0.0630 * logSum);
      else if (age < 40) db = 1.1422 - (0.0544 * logSum);
      else if (age < 50) db = 1.1620 - (0.0700 * logSum);
      else db = 1.1715 - (0.0779 * logSum);
    } else {
      if (age < 30) db = 1.1549 - (0.0678 * logSum);
      else if (age < 40) db = 1.1423 - (0.0632 * logSum);
      else if (age < 50) db = 1.1333 - (0.0612 * logSum);
      else db = 1.1339 - (0.0645 * logSum);
    }
    formulaUsed = 'DURNIN_WOMERSLEY_4';
  }

  // Evaluar resultados
  if (!db) return null; // No hay suficientes datos para calcular

  const bodyFatPercentage = applySiriEquation(db);
  const { fatMassKg, fatFreeMassKg } = calculateMasses(weightKg, bodyFatPercentage);

  // Construimos el objeto base solo con las propiedades obligatorias
  const result: CompositionResult = {
    formulaUsed,
    bodyDensity: parseFloat(db.toFixed(5)),
    bodyFatPercentage: parseFloat(bodyFatPercentage.toFixed(2)),
  };

  // Agregamos las propiedades opcionales SOLO si existen (esto hace feliz a TypeScript)
  if (fatMassKg !== undefined) {
    result.fatMassKg = parseFloat(fatMassKg.toFixed(2));
  }
  if (fatFreeMassKg !== undefined) {
    result.fatFreeMassKg = parseFloat(fatFreeMassKg.toFixed(2));
  }

  return result;
};

// Utilidad para calcular la edad a partir de la fecha de nacimiento
export const calculateAge = (dob: Date): number => {
  const diffMs = Date.now() - dob.getTime();
  const ageDate = new Date(diffMs);
  return Math.abs(ageDate.getUTCFullYear() - 1970);
};