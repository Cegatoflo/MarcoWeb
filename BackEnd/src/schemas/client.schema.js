import * as yup from 'yup';

export const clientSchema = yup.object().shape({
    nombre: yup
        .string()
        .required("El nombre es obligatorio")
        .min(2, "El nombre debe tener al menos 2 caracteres")
        .max(100, "El nombre no puede exceder los 100 caracteres"),
    RUC: yup
        .string()
        .required("El RUC es obligatorio")
        .matches(/^\d{8}$|^\d{11}$/, "El RUC debe tener 8 dígitos (personal) o 11 dígitos (empresa)") 
});