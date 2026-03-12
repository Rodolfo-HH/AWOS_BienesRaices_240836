import express from "express";
import { formularioLogin, formularioRegistro, registrar, confirmar, formularioRecuperarPassword } from '../controllers/usuarioController.js';

// Creamos el ruteador
const router = express.Router();

router.get("/login", formularioLogin)

router.get("/registro", formularioRegistro)
router.post("/registro", registrar)

router.get("/confirmar/:token", confirmar)
router.get("/recuperacion-Password", formularioRecuperarPassword)

export default router