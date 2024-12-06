import * as yup from 'yup';

export const mandilSchema = yup.object().shape({
    ubicacion: yup
        .string()
        .required("La ubicación es obligatoria")
        .trim(),
    color: yup
        .string()
        .required("El color es obligatorio")
        .trim(),
    id: yup
        .string()
        .required("El ID es obligatorio")
        .trim(),
    estado: yup
        .boolean()
        .default(false) 
});