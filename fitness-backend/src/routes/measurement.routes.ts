import { Router } from 'express';
import { verifyToken } from '../middlewares/auth.middleware.js';
import { createMeasurement, getMeasurements, updateMeasurement } from '../controllers/measurement.controller.js';

const router: Router = Router();

// Ambas rutas están protegidas
router.post('/', verifyToken, createMeasurement);
router.get('/', verifyToken, getMeasurements);
router.put('/:id', verifyToken, updateMeasurement);

export default router;