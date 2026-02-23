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

const formularioRecuperarPassword = (req, res) =>{
    res.render('auth/recuperacion-password',{
        pagina: 'Recuperar Contraseña'
    })
}

export {
    formularioLogin,
    formularioRegistro,
    formularioRecuperarPassword
}