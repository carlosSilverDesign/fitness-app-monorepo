import { Router } from 'express';
import { createTestimonial, getTestimonials, deleteTestimonial, updateTestimonial } from '../controllers/testimonial.controller.js';
import { verifyToken } from '../middlewares/auth.middleware.js';

const router = Router();

// Ruta pública para que la Landing page pueda leerlos
router.get('/', getTestimonials);

// Ruta protegida para que solo administradores logueados puedan crearlos
router.post('/', verifyToken, createTestimonial);

// RUTAS CON PARÁMETRO ID PARA ELIMINAR O ACTUALIZAR TESTIMONIOS
router.delete('/:id', verifyToken, deleteTestimonial);
router.put('/:id', verifyToken, updateTestimonial);

export default router;