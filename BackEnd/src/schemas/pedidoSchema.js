import * as yup from 'yup';

export const pedidoSchema = yup.object().shape({
    idPedido: yup
        .string()
        .required("El ID de pedido es obligatorio")
        .trim(),
    ruc: yup
        .string()
        .required("El RUC es obligatorio")
        .trim()
        .matches(/^\d{8}$|^\d{11}$/, "El RUC debe tener 8 dígitos (personal) o 11 dígitos (empresa)"),
    mandiles: yup
        .array()
        .of(yup.string().required("El ID de mandil es obligatorio")) 
        .required("Se requiere al menos un mandil"),
    estado: yup
        .string()
        .oneOf(['pendiente', 'en_proceso', 'completado', 'cancelado'], "Estado inválido") 
        .default('pendiente'), 
    fechaPedido: yup
        .date()
        .default(() => new Date()), 
});