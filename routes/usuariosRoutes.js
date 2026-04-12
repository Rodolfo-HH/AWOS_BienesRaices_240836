import express from "express";
import { formularioLogin, autenticar ,formularioRegistro, registrar, confirmar, formularioRecuperarPassword, resetPassword, comprobarToken, nuevoPassword, formularioCrearPassword, guardarPassword } from '../controllers/usuarioController.js';
import passport from "passport";

// Creamos el ruteador
const router = express.Router();

router.get("/login", formularioLogin)
router.post("/login", autenticar)

router.get("/registro", formularioRegistro)
router.post("/registro", registrar)

router.get("/confirmar/:token", confirmar)

router.get("/recuperacion-password", formularioRecuperarPassword)
router.post("/recuperacion-password", resetPassword)

// Almacenar el nuevo password
router.get("/recuperacion-password/:token", comprobarToken)
router.post("/recuperacion-password/:token", nuevoPassword)

// Rutas para crear nuevo password desde el perfil
const protegerRuta = (req, res, next) => {
    if (req.isAuthenticated()) return next();
    return res.redirect('/auth/login');
};

router.get('/crear-password', protegerRuta, formularioCrearPassword)
router.post('/crear-password', protegerRuta, guardarPassword)

// Rutas para autenticación con Google
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));
router.get('/google/callback',
    passport.authenticate('google', {
        failureRedirect: '/auth/login'
    }),
    (req, res) => {

        if (!req.user.password) {
            return res.redirect('/auth/crear-password');
        }

        res.redirect('/mis-propiedades');
    }
);

export default router