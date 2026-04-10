import Propiedad from "./Propiedad.js";
import Categoria from "./Categoria.js";
import Precio from "./Precio.js";
import Usuario from "./Usuario.js";

// Relaciones
Propiedad.belongsTo(Categoria, { foreignKey: "categoriaId" });
Propiedad.belongsTo(Precio, { foreignKey: "precioId" });
Propiedad.belongsTo(Usuario, { foreignKey: "usuarioId" });

export {
    Propiedad,
    Categoria,
    Precio,
    Usuario
}