import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import 'dotenv/config';

// 1. Obtenemos la URL de conexión principal (Pooler - Puerto 6543)
// Usamos "!" para confirmar a TypeScript que la variable no es nula
const connectionString = process.env.DATABASE_URL!;

// 2. Creamos un Pool de conexiones nativo de PostgreSQL para máximo rendimiento
const pool = new Pool({ connectionString });

// 3. Conectamos el Pool al Adaptador oficial de Prisma
const adapter = new PrismaPg(pool);

// 4. Instanciamos PrismaClient inyectando el adaptador (Patrón Singleton)
const prisma = new PrismaClient({ adapter });

// Lo exportamos por defecto para usar "prisma" en todos nuestros controladores
export default prisma;