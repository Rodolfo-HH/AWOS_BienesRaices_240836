import express from 'express'
import usuariosRoutes from "./routes/usuariosRoutes.js"
import db from './config/db.js'  

// Craear la app
const app = express()

//Conexion a la base de Datos
try {
    await db.authenticate();
    console.log('Conexion Correcta a la Base de Datos')
} catch (error) {
    console.log(error)
}

// Habilitar pug
app.set('view engine', 'pug')
app.set('views', './views')

// Carpeta publica
app.use(express.static('public'))

// Importamos sus rutas (ruteo)
app.use("/auth",usuariosRoutes)

// Definir un puerto y arrancar el proyecto
const port = 3000;
app.listen(port, () => {
    console.log(`El Servidor esta funcionando en el puerto ${port}`)
});