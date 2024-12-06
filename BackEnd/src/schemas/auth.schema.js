import yup  from 'yup';

export const authSchema = yup.object({

    email: yup
        .string()
        .email("Ingrese un correo electrónico válido")
        .required("El correo es obligatorio"),
    password: yup
        .string()
        .min(5, "Su contraseña debe contener como mínimo 5 caracteres")
        .required("La contraseña es obligatoria")

})