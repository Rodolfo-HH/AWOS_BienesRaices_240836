import { check, validationResult } from "express-validator"
import bcrypt from "bcrypt"
import Usuario from "../models/Usuario.js"
import { generarId } from "../helpers/tokens.js"
import { emailRegistro, emailOlvidePassword } from "../helpers/emails.js"

const formularioLogin = (req, res) =>{
    res.render('auth/login',{
        pagina: 'Iniciar Sesión'
    })
}

const formularioRegistro = (req, res) =>{
    res.render('auth/registro',{
        pagina: 'Crear Cuenta',
        csrfToken: req.csrfToken()
    })
}

const registrar = async (req, res) =>{

    //Validacion
    await check('nombre').notEmpty().withMessage('El nombre no puede ir vacio').run(req)
    await check('email').isEmail().withMessage('Verifica tu email').run(req)
    await check('password').isLength({ min: 6 }).withMessage('La contraseña debe cumplir los requisitos').run(req)
    await check('repetir_password').custom((value, { req }) => {
        if (value !== req.body.password) {
            throw new Error('Las contraseñas no son iguales');
        }
        return true;
    }).run(req)

    let resultado = validationResult(req)

    // Verificar que el resultado este vacio
    if (!resultado.isEmpty()) {
        //Errores
        return res.render('auth/registro',{
            pagina: 'Crear Cuenta',
            csrfToken: req.csrfToken(),
            errores: resultado.array(),
            usuario: {
                nombre: req.body.nombre,
                email: req.body.email
            }
        })
    }

    //Extraer datos
    const {nombre, email, password} = req.body

    //Verificar que el usuario no este duplicado
    const usuarioExiste = await Usuario.findOne({ where : { email } })
    if (usuarioExiste){
        return res.render('auth/registro',{
            pagina: 'Crear Cuenta',
            csrfToken: req.csrfToken(),
            errores: [{msg: 'El usuario ya esta registrado'}],
            usuario: {
                nombre: req.body.nombre,
                email: req.body.email
            }
        })
    }

   // Almacanar un usuario
    const usuario = await Usuario.create({
        nombre,
        email,
        password,
        token: generarId()
    })

    // Enviar email de confirmacion
    emailRegistro({
        nombre: usuario.nombre,
        email: usuario.email,
        token: usuario.token
    })


   // Mostrar mensaje de confirmacion
   res.render('templates/mensaje', {
    pagina: 'Cuenta Creada Correctamente',
    mensaje: 'Hemos Enviado un Email de Confirmacion, presiona en el enlace'
   })
}

// Funcion para confirmar la cuenta
const confirmar = async (req, res) => {
    const { token } = req.params;

    // Verificar si el token es valido
    const usuario = await Usuario.findOne({ where: {token}})

    if(!usuario) {
        return res.render('auth/confirmar-cuenta', {
            pagina: 'Error al Confirmar tu Cuenta',
            mensaje: 'Hubo un error al confirmar tu cuenta, intente de nuevo',
            error: true
        })
    }

    // Confirmar la cuenta
    usuario.token = null;
    usuario.confirmado = true;
    await usuario.save();

    res.render('auth/confirmar-cuenta', {
            pagina: 'Cuenta Confirmada',
            mensaje: 'La cuenta se confirmo Correctamente'
        })
    }

const formularioRecuperarPassword = (req, res) =>{
    res.render('auth/recuperacion-password',{
        pagina: 'Recuperar Contraseña',
        csrfToken: req.csrfToken(),
    })
}

const resetPassword = async (req, res) => {
    
    //Validacion
    await check('email').isEmail().withMessage('Verifica tu email').run(req)

    let resultado = validationResult(req)

    // Verificar que el resultado este vacio
    if (!resultado.isEmpty()) {
        //Errores
        return res.render('auth/recuperacion-password',{
            pagina: 'Recuperar tu Contraseña de tu cuenta',
            csrfToken: req.csrfToken(),
            errores: resultado.array()
        })
    }

    //Buscar el usuario

    const { email } = req.body

    const usuario = await Usuario.findOne({ where: { email }})

    if(!usuario){
        return res.render('auth/recuperacion-password',{
            pagina: 'Recuperar tu Contraseña de tu cuenta',
            csrfToken: req.csrfToken(),
            errores: [{msg: 'El Email no Pertenece a ningun usuario'}]
        })
    }

    // Generar un Token y enviar el email

    usuario.token = generarId();
    await usuario.save();

    // Enviar un Email
    emailOlvidePassword({
        nombre: usuario.nombre,
        email: usuario.email,
        token: usuario.token
    })


    // Renderizar un mensaje
    res.render('templates/mensaje', {
        pagina: 'Reestablecer tu Contraseña',
        mensaje: 'Hemos Enviado un Email con las Instrucciones para Reestablecer tu Contraseña'
    })

}

const comprobarToken = async (req, res) => {
    const { token } = req.params;
    const usuario = await Usuario.findOne({ where: { token }})

    if(!usuario){
        return res.render('auth/confirmar-cuenta', {
            pagina: 'Reestablecer tu Contraseña',
            mensaje: 'Hubo un error al validar tu información, intenta de nuevo',
            error: true
        })
    }

    // Mostrar formulario para modificar el password
    res.render('auth/reset-password', {
        pagina: 'Reestablecer tu Contraseña',
        csrfToken: req.csrfToken()
    })
}

const nuevoPassword = async (req, res) => {
    // Validacion del password
    await check('password').isLength({ min: 6 }).withMessage('La contraseña debe cumplir los requisitos').run(req)

    let resultado = validationResult(req)
    if (!resultado.isEmpty()) {
        return res.render('auth/reset-password', {
            pagina: 'Reestablecer tu Contraseña',
            csrfToken: req.csrfToken(),
            errores: resultado.array(),
        })
    }

    const { token } = req.params;
    const { password } = req.body;

    // Identificar al usuario que hace el cambio
    const usuario = await Usuario.findOne({ where: { token }})

    // Hash el nuevo password y guardarlo en la base de datos

    const salt = await bcrypt.genSalt(10)
    usuario.password = await bcrypt.hash(password, salt);
    usuario.token = null;
    await usuario.save();

    res.render('auth/confirmar-cuenta', {
        pagina: 'Contraseña Reestablecida',
        mensaje: 'La contraseña se guardo Correctamente'
    })

}

export {
    formularioLogin,
    formularioRegistro,
    registrar,
    confirmar,
    formularioRecuperarPassword,
    resetPassword,
    comprobarToken,
    nuevoPassword
}