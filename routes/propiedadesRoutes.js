import express from 'express';
import { body } from 'express-validator';
import { admin, crear, guardar, agregarImagen, almacenarImagen } from '../controllers/propiedadController.js';
import protegerRuta from '../middleware/protegerRuta.js';
import upload from '../middleware/subirImagen.js';

const router = express.Router();

router.get('/mis-propiedades',protegerRuta, admin);
router.get('/propiedades/crear',protegerRuta, crear);
router.post('/propiedades/crear', protegerRuta,
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

)    

router.get('/propiedades/agregar-imagen/:id',protegerRuta, agregarImagen);

router.post('/propiedades/agregar-imagen/:id', protegerRuta,
    upload.single('imagen'),
    almacenarImagen
)

export default router;
