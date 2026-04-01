import type { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
// IMPORTANTE: En NodeNext (ES Modules), las importaciones locales DEBEN llevar la extensión ".js" 
// aunque el archivo físico sea ".ts". Es una regla estricta de Node.js moderno.
import prisma from '../db/prisma.js';

export const registerUser = async (req: Request, res: Response): Promise<void> => {
  try {
    // 🟢 1. Recibimos TODOS los datos del frontend (incluyendo el nombre)
    const { email, password, firstName, lastName } = req.body;

    // 2. Validación básica actualizada
    if (!email || !password || !firstName || !lastName) {
      res.status(400).json({ error: 'Todos los campos son obligatorios (email, password, nombre y apellido).' });
      return;
    }

    // 3. Verificar si el usuario ya existe en la base de datos
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      res.status(409).json({ error: 'El usuario ya está registrado.' });
      return;
    }

    // 4. Encriptar la contraseña (Hashing)
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // ==========================================
    // 🟢 EL ESLABÓN PERDIDO: CREAR USUARIO + PERFIL
    // ==========================================
    // Usamos una "Escritura Anidada" de Prisma para que sea transaccional.
    // Si falla el perfil, falla el usuario, evitando cuentas huérfanas.
    const newUser = await prisma.user.create({
      data: {
        email,
        passwordHash,
        role: 'FREE', // Valor por defecto
        // Le decimos a Prisma que cree el perfil vinculado automáticamente
        profile: {
          create: {
            firstName,
            lastName,
          }
        }
      },
      // Le pedimos a Prisma que nos devuelva el usuario con su perfil incluido
      include: {
        profile: true
      }
    });

    // 6. Responder al frontend (Omitiendo enviar el passwordHash por seguridad)
    res.status(201).json({
      message: 'Usuario y perfil creados exitosamente',
      user: {
        id: newUser.id,
        email: newUser.email,
        role: newUser.role,
        createdAt: newUser.createdAt,
        profile: newUser.profile // Devolvemos el perfil recién creado
      },
    });
  } catch (error) {
    console.error('Error en registerUser:', error);
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
};

// NUEVA FUNCIÓN: Inicio de sesión (Se mantiene intacta)
export const loginUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    // 1. Validar que envíen los datos
    if (!email || !password) {
      res.status(400).json({ error: 'El email y la contraseña son obligatorios.' });
      return;
    }

    // 2. Buscar al usuario en la base de datos
    const user = await prisma.user.findUnique({
      where: { email },
    });

    // Tip de Senior: Por seguridad, nunca decimos si falló el correo o la contraseña.
    if (!user) {
      res.status(401).json({ error: 'Credenciales inválidas.' });
      return;
    }

    // 3. Verificar que la contraseña coincida con el hash
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    
    if (!isPasswordValid) {
      res.status(401).json({ error: 'Credenciales inválidas.' });
      return;
    }

    // 4. Asegurarnos para TypeScript que el secreto existe
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw new Error('JWT_SECRET no está configurado en el archivo .env');
    }

    // 5. Generar el JWT (El "Carnet Digital")
    const token = jwt.sign(
      { userId: user.id, role: user.role }, // Payload
      jwtSecret,                            // La firma secreta
      { expiresIn: '7d' }                   // Expiración: 7 días
    );

    // 6. Enviar la respuesta exitosa
    res.status(200).json({
      message: 'Inicio de sesión exitoso',
      token, // Aquí va nuestro JWT
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Error en loginUser:', error);
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
};