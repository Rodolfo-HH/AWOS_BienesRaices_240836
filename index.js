import express from 'express'
import usuariosRoutes from "./routes/usuariosRoutes.js"

// Craear la app
const app = express()

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