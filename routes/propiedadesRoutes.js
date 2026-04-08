import express from 'express';
import { body } from 'express-validator';
import { admin, crear, guardar } from '../controllers/propiedadController.js';

const router = express.Router();

router.get('/mis-propiedades', admin);
router.get('/propiedades/crear', crear);
router.post('/propiedades/crear', 
    body('titulo').notEmpty().withMessage('El título es obligatorio'),
    body('descripcion')
        .notEmpty().withMessage('La descripción no puede estar vacía')
        .isLength({ min: 20 }).withMessage('La descripción debe tener al menos 20 caracteres'),
    body('categoria').notEmpty().withMessage('La categoría es obligatoria'),
    body('precio').notEmpty().withMessage('El precio es obligatorio'),
    body('habitaciones').notEmpty().withMessage('El número de habitaciones es obligatorio'),
    body('estacionamientos').notEmpty().withMessage('El número de estacionamientos es obligatorio'),
    body('wc').notEmpty().withMessage('El número de baños es obligatorio'),
    body('lat').notEmpty().withMessage('Ubica la propiedad en el mapa').bail(),
    guardar

);

export default router;
