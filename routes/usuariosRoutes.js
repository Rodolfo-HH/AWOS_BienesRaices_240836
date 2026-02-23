import express from "express";
import { formularioLogin, formularioRegistro, formularioRecuperarPassword } from '../controllers/usuarioController.js';

// Creamos el ruteador
const router = express.Router();
router.get("/login", formularioLogin)
router.get("/registro", formularioRegistro)
router.get("/recuperacion-Password", formularioRecuperarPassword)

export default router