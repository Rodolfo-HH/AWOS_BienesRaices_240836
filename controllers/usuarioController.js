import { check, validationResult } from "express-validator"
import Usuario from "../models/Usuario.js"
import { generarId } from "../helpers/tokens.js"
import { emailRegistro } from "../helpers/emails.js"

const formularioLogin = (req, res) =>{
    res.render('auth/login',{
        pagina: 'Iniciar Sesión'
    })
}

const formularioRegistro = (req, res) =>{
    res.render('auth/registro',{
        pagina: 'Crear Cuenta'
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
    console.log( token )
}

const formularioRecuperarPassword = (req, res) =>{
    res.render('auth/recuperacion-password',{
        pagina: 'Recuperar Contraseña'
    })
}

export {
    formularioLogin,
    formularioRegistro,
    registrar,
    confirmar,
    formularioRecuperarPassword
}