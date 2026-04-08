import express from 'express'
import csurf from 'csurf'
import session from "express-session";
import passport from "passport";
import "./config/passport.js";
import cookieParser from 'cookie-parser'
import usuariosRoutes from "./routes/usuariosRoutes.js"
import propiedadesRoutes from "./routes/propiedadesRoutes.js"
import db from './config/db.js'  

// Crear la app
const app = express()

// Habilitar lectura de datos de formularios
app.use(express.urlencoded({ extended: true }))

// Habilitar Cookies Parser
app.use(cookieParser())

// 🔥 SESIONES (ANTES DE PASSPORT)
app.use(session({
    secret: "RimuruTempest240836",
    resave: false,
    saveUninitialized: false
}));

// 🔥 PASSPORT (DESPUÉS DE SESSION)
app.use(passport.initialize());
app.use(passport.session());

// 🔥 CSURF (DESPUÉS DE COOKIE Y SESSION)
app.use(csurf({ cookie: true }))

// Conexion a la base de Datos
try {
    await db.authenticate();
    console.log('Conexion Correcta a la Base de Datos')
    await db.sync();
} catch (error) {
    console.log(error)
}

// Habilitar pug
app.set('view engine', 'pug')
app.set('views', './views')

// Carpeta publica
app.use(express.static('public'))

// 🔥 RUTAS (AL FINAL)
app.use("/auth", usuariosRoutes)
app.use("/", propiedadesRoutes)

// Definir un puerto y arrancar el proyecto
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`El Servidor esta funcionando en el puerto ${port}`)
});