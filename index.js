import express from 'express'
import usuariosRoutes from "./routes/usuariosRoutes.js"

// Craear la app
const app = express()

// Importamos sus rutas (ruteo)
app.use("/",usuariosRoutes)

// Definir un puerto y arrancar el proyecto
const port = 3000;
app.listen(port, () => {
    console.log(`El Servidor esta funcionando en el puerto ${port}`)
});