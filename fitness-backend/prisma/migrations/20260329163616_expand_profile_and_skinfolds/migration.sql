-- AlterTable
ALTER TABLE "Measurement" ADD COLUMN     "bicepFold" DOUBLE PRECISION,
ADD COLUMN     "bodyDensity" DOUBLE PRECISION,
ADD COLUMN     "fatFreeMassKg" DOUBLE PRECISION,
ADD COLUMN     "fatMassKg" DOUBLE PRECISION,
ADD COLUMN     "formulaUsed" TEXT,
ADD COLUMN     "midaxillaryFold" DOUBLE PRECISION,
ADD COLUMN     "subscapularFold" DOUBLE PRECISION,
ADD COLUMN     "suprailiacFold" DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "Profile" ADD COLUMN     "activityLevel" TEXT,
ADD COLUMN     "dietPreference" TEXT,
ADD COLUMN     "fitnessGoals" TEXT,
ADD COLUMN     "medicalConditions" TEXT,
ADD COLUMN     "phone" TEXT;
