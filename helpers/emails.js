import nodemailer from 'nodemailer';

const emailRegistro = async (datos) => {
    // Looking to send emails in production? Check out our Email API/SMTP product!
    const transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD
        }
    });

    const { nombre, email, token } = datos

    // Enviar email
    await transport.sendMail({
        from: 'Bienes Raices - 240836 ',
        to: email,
        subject: 'Confirma tu cuenta en Bienes Raices',
        text: 'Confirma tu cuenta en Bienes Raices',
        html: `<p>Hola ${nombre}, comprueba tu cuenta en Bienes Raices</p>
        <a href="${process.env.BASE_URL}:${process.env.PORT ?? 3000}/auth/confirmar/${token}">Comprobar Cuenta</a>
        <p>Si tu no creaste esta cuenta, puedes ignorar este mensaje</p>`
    })
}


const emailOlvidePassword = async (datos) => {
    // Looking to send emails in production? Check out our Email API/SMTP product!
    const transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD
        }
    });

    const { nombre, email, token } = datos

    // Enviar email
    await transport.sendMail({
        from: 'Bienes Raices - 240836 ',
        to: email,
        subject: 'Reestablece tu contraseña en Bienes Raices',
        text: 'Reestablece tu contraseña en Bienes Raices',
        html: `<p>Hola ${nombre}, has solicitado reestablecer tu contraseña en Bienes Raices</p>
        <p>Tu cuenta ya esta casi lista, solo debes comprobarla en el siguiente enlace:</p>
        <a href="${process.env.BASE_URL}:${process.env.PORT ?? 3000}/auth/recuperacion-password/${token}">Reestablecer Contraseña</a>
        <p>Si tu no solicitaste este cambio, puedes ignorar este mensaje</p>`
    })
}

export {
    emailRegistro,
    emailOlvidePassword
}