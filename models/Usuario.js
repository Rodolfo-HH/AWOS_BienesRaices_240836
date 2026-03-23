import { DataTypes } from "sequelize";
import bcrypt from 'bcrypt'
import db from "../config/db.js";

const Usuario = db.define('usuarios', {
    nombre: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    token: DataTypes.STRING,
    confirmado: DataTypes.BOOLEAN
},{
    hooks: {
        beforeCreate: async function(usuario) {
            const salt = await bcrypt.genSalt(10)
            usuario.password = await bcrypt.hash( usuario.password, salt);
        }
    }
})

// Agregar un método para comparar el password ingresado por el usuario con el hash almacenado en la base de datos
Usuario.prototype.verificarPassword = function(password) {
    return bcrypt.compare(password, this.password)
}

export default Usuario