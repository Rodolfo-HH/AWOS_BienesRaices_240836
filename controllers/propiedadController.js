import { validationResult } from "express-validator";
import { Categoria, Precio, Propiedad } from "../models/index.js";

const admin = (req, res) => {
    res.render('propiedades/admin', {
        pagina: 'Bienvenido al Sistema de Bienes Raices',
        barra: true
    });
}

// Formulario para crear una nueva propiedad
const crear = async (req, res) => {
    // Consultar la base de datos para obtener las categorías y precios
    const [categorias, precios] = await Promise.all([
        Categoria.findAll(),
        Precio.findAll()
    ]);

    res.render('propiedades/crear', {
        pagina: 'Crear Propiedad',
        barra: true,
        csrfToken: req.csrfToken(),
        categorias,
        precios,
        datos: {}
    });
}

const guardar = async (req, res) => {
    // Validar los datos del formulario
    let resultado = validationResult(req);
    
    if (!resultado.isEmpty()) {

        const [categorias, precios] = await Promise.all([
            Categoria.findAll(),
            Precio.findAll()
        ])

        return res.render('propiedades/crear', {
            pagina: 'Crear Propiedad',
            barra: true,
            csrfToken: req.csrfToken(),
            categorias,
            precios,
            errores: resultado.array(),
            datos: req.body
        })
    }

    // Si la validación es correcta, guardar en la base de datos

    const { titulo, descripcion, categoria, precio, habitaciones, estacionamientos, wc, calle, lat, lng } = req.body;

    const { id: usuarioId } = req.usuario;

     try {
        const propiedadGuardada = await Propiedad.create({
            titulo,
            descripcion,
            categoriaId: categoria,
            precioId: precio,
            usuarioId: usuarioId,
            habitaciones,
            estacionamientos,
            wc,
            calle,
            lat,
            lng,
            imagen: ''
        })

        const { id } = propiedadGuardada;

        res.redirect(`/propiedades/agregar-imagen/${id}`);
        
        } catch (error) {
            console.error(error);
        }
}

export {
    admin,
    crear,
    guardar
};