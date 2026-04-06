import type { Request, Response } from 'express';
import prisma from '../db/prisma.js';
import { type AuthRequest } from '../middlewares/auth.middleware.js';

// Crear un nuevo testimonio (Solo para Coach Lucy)
export const createTestimonial = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    // Los datos vienen del formulario que acabamos de hacer
    const { name, achievement, content, imageUrl, rating } = req.body;

    if (!name || !achievement || !content) {
      res.status(400).json({ error: 'Nombre, logro y contenido son obligatorios.' });
      return;
    }

    const newTestimonial = await prisma.testimonial.create({
      data: {
        name,
        achievement,
        content,
        imageUrl: imageUrl || null, // Si está vacío, guardamos null
        rating: rating || 5, // Si no se envía, serán 5 por defecto
      },
    });

    res.status(201).json({
      message: 'Testimonio publicado exitosamente',
      testimonial: newTestimonial,
    });
  } catch (error) {
    console.error('Error en createTestimonial:', error);
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
};

// Obtener todos los testimonios (Público, para la Landing Page)
export const getTestimonials = async (req: Request, res: Response): Promise<void> => {
  try {
    const testimonials = await prisma.testimonial.findMany({
      orderBy: { createdAt: 'desc' }, // Los más nuevos primero
    });

    res.status(200).json(testimonials);
  } catch (error) {
    console.error('Error en getTestimonials:', error);
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
};

// 🟢 FUNCIÓN ACTUALIZADA: Eliminar Testimonio
export const deleteTestimonial = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    // Le aseguramos a TypeScript que esto es un string
    const id = req.params.id as string; 

    if (!id) {
      res.status(400).json({ error: 'El ID del testimonio es obligatorio.' });
      return;
    }

    await prisma.testimonial.delete({
      where: { id }, // Ahora Prisma está feliz
    });
    res.status(200).json({ message: 'Testimonio eliminado exitosamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar el testimonio.' });
  }
};

// 🟢 FUNCIÓN ACTUALIZADA: Editar Testimonio
export const updateTestimonial = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const { name, achievement, content, imageUrl, rating } = req.body;

    if (!id) {
      res.status(400).json({ error: 'El ID del testimonio es obligatorio.' });
      return;
    }

    const updatedTestimonial = await prisma.testimonial.update({
      where: { id },
      data: { name, achievement, content, imageUrl, rating },
    });
    res.status(200).json({ message: 'Testimonio actualizado', testimonial: updatedTestimonial });
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar el testimonio.' });
  }
};

