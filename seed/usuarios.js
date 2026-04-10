import bcrypt from "bcrypt";

const usuarios = [
    {
        nombre: "user1",
        email: "user1@example.com",
        confirmado: 1,
        password: bcrypt.hashSync("password1", 10)

    }
];

export default usuarios;