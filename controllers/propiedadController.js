import { validationResult } from "express-validator";
import { Categoria, Precio, Propiedad } from "../models/index.js";

const admin = async (req, res) => { 
    try {
        const { id } = req.usuario;

        const propiedades = await Propiedad.findAll({
            where: {
                usuarioId: id
            },
            include: [
                { model: Categoria, as: 'categoria' },
                { model: Precio, as: 'precio' }
            ]
        });

        console.log('Propiedades encontradas:', propiedades.length);

        res.render('propiedades/admin', {
            pagina: 'Bienvenido al Sistema de Bienes Raices',
            propiedades
        });
    } catch (error) {
        console.error(error);
        res.redirect('/mis-propiedades');
    }
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

        return res.render('propiedades/editar', {
            pagina: 'Editar Propiedad',
            csrfToken: req.csrfToken(),
            categorias,
            precios,
            errores: resultado.array(),
            datos: req.body
        });
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

const agregarImagen = async (req, res) => {

    const { id } = req.params;

    // Validar que la propiedad exista y que el usuario sea el propietario

    const propiedad = await Propiedad.findByPk(id);
    if (!propiedad) {
        return res.redirect('/mis-propiedades');
    }

    // Validar que la propiedad no este publicada

    if (propiedad.publicado) {
        return res.redirect('/mis-propiedades');
    }

    // Validar que la propiedad pertenezca a quien visita la página

    if(req.usuario.id.toString() !== propiedad.usuarioId.toString()) {
        return res.redirect('/mis-propiedades');
    }

    res.render('propiedades/agregar-imagen', {
        pagina: `Agregar Imagen: ${propiedad.titulo}`,
        csrfToken: req.csrfToken(),
        propiedad
    })
}

const almacenarImagen = async (req, res) => {
    const { id } = req.params;

    // Validar que la propiedad exista
    const propiedad = await Propiedad.findByPk(id);
    if (!propiedad) {
        return res.redirect('/mis-propiedades');
    }

    // Validar que la propiedad no este publicada

    if (propiedad.publicado) {
        return res.redirect('/mis-propiedades');
    }

    // Validar que la propiedad pertenezca a quien visita la página

    if(req.usuario.id.toString() !== propiedad.usuarioId.toString()) {
        return res.redirect('/mis-propiedades');
    }

    try {
        propiedad.imagen = req.file.filename;
        propiedad.publicado = 1;
        await propiedad.save();

        res.redirect('/mis-propiedades');

    } catch (error) {
        console.error(error);
    }
}

const editar = async (req, res) => {

    const { id } = req.params;

    // Validar que la propiedad exista
    const propiedad = await Propiedad.findByPk(id);
    if (!propiedad) {
        return res.redirect('/mis-propiedades');
    }

    // Validar que la propiedad pertenezca a quien visita la página
    if(req.usuario.id.toString() !== propiedad.usuarioId.toString()) {
        return res.redirect('/mis-propiedades');
    }

    const [categorias, precios] = await Promise.all([
        Categoria.findAll(),
        Precio.findAll()
    ]);

    res.render('propiedades/editar', {
        pagina: 'Estás editando: ' + propiedad.titulo,
        csrfToken: req.csrfToken(),
        categorias,
        precios,
        datos: propiedad
    })
}

const guardarCambios = async (req, res) => {

    // Verificar la validación de los datos del formulario
    let resultado = validationResult(req);

    if (!resultado.isEmpty()) {
        const [categorias, precios] = await Promise.all([
            Categoria.findAll(),
            Precio.findAll()
        ]);

        return res.render('propiedades/editar', {
            pagina: 'Editar Propiedad',
            csrfToken: req.csrfToken(),
            categorias,
            precios,
            errores: resultado.array(),
            datos: req.body
        });
    }

    const { id } = req.params;

    // Validar que la propiedad exista
    const propiedad = await Propiedad.findByPk(id);
    if (!propiedad) {
        return res.redirect('/mis-propiedades');
    }

    // Validar que la propiedad pertenezca a quien visita la página
    if(req.usuario.id.toString() !== propiedad.usuarioId.toString()) {
        return res.redirect('/mis-propiedades');
    }

    const [categorias, precios] = await Promise.all([
        Categoria.findAll(),
        Precio.findAll()
    ]);

    // Actualizar la propiedad con los nuevos datos

    try {

        const { titulo, descripcion, categoria, precio, habitaciones, estacionamientos, wc, calle, lat, lng } = req.body;

        propiedad.set({
            titulo,
            descripcion,
            categoriaId: categoria,
            precioId: precio,
            habitaciones,
            estacionamientos,
            wc,
            calle,
            lat,
            lng
        });

        await propiedad.save();

        res.redirect('/mis-propiedades');

    } catch (error) {
        console.error(error);
    }

}


export {
    admin,
    crear,
    guardar,
    guardarCambios,
    agregarImagen,
    almacenarImagen,
    editar
};