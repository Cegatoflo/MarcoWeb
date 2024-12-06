import nodemailer from 'nodemailer';

// Función para generar una contraseña aleatoria
export function generarClaveAcceso(longitud = 12) {
    const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()';
    let clave = '';
    for (let i = 0; i < longitud; i++) {
        const indice = Math.floor(Math.random() * caracteres.length);
        clave += caracteres[indice];
    }
    return clave;
}

// Función para enviar un correo con la clave de acceso
export async function enviarCorreo(email, claveAcceso) {
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'cesargabrieltorresflorez@gmail.com',
                pass: 'dayk zwjk ugsj ygem' // Asegúrate de no exponer tu contraseña en el código
            }
        });

        const info = await transporter.sendMail({
            from: '"Sistema de Autenticación" <tuCorreo@gmail.com>',
            to: email,
            subject: "Clave de acceso para cambio de contraseña",
            text: `Tu clave de acceso es: ${claveAcceso}`,
        });

        console.log('Mensaje enviado: %s', info.messageId);
    } catch (error) {
        console.error('Error al enviar el correo:', error);
    }
}