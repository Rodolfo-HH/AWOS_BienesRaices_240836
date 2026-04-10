import categorias from "./categorias.js";
import precios from "./precios.js";
import usuarios from "./usuarios.js";
import db from "../config/db.js";
import { Categoria, Precio, Usuario } from "../models/index.js";

const importarDatos = async () => {
    try {
        // Autenticar
        await db.authenticate();
        console.log("Conexión a la base de datos establecida correctamente.");
        // Generar las columnas
        await db.sync({ force: true });
        console.log("Base de datos sincronizada correctamente.");
        // Insertar los datos
        await Promise.all([
            Categoria.bulkCreate(categorias),
            Precio.bulkCreate(precios),
            Usuario.bulkCreate(usuarios)
        ])
        console.log("Datos importados correctamente.");
        process.exit();
    }
    catch (error) {
        console.error("Error al importar los datos:", error);
        process.exit(1);
    }
}

const eliminarDatos = async () => {
    try {
        // Eliminar los datos
        await Promise.all([
            Categoria.destroy({ where: {}, truncate: true }),
            Precio.destroy({ where: {}, truncate: true })
        ])
        console.log("Datos eliminados correctamente.");
        process.exit();
    }
    catch (error) {
        console.error("Error al eliminar los datos:", error);
        process.exit(1);
    }
}

if (process.argv[2] === "-i") {
    importarDatos();
} 

if (process.argv[2] === "-e") {
    eliminarDatos();
} 