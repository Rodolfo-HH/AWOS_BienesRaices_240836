import jwt from 'jsonwebtoken';
import  { Usuario }  from '../models/index.js';

const protegerRuta = async (req, res, next) => {
    // Verificar si hay un token

    const token = req.cookies.token;

    if (!token) {
        return res.redirect('/auth/login');
    }

    // Verificar el token

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const usuario = await Usuario.scope('eliminarPassword').findByPk(decoded.id)

        // Agregar el usuario a la req para que esté disponible en los controladores
        if (usuario) {
            req.usuario = usuario;
        } else {
            return res.redirect('/auth/login');
        }

        return next();

    } catch (error) {
        return res.clearCookie('token').redirect('/auth/login');
    }
}

export default protegerRuta;