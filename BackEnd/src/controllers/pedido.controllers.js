import Pedido from '../models/pedido.models.js';
import { crearDocumentoPDF } from '../libs/pdf.js';
import Mandil from '../models/mandil.model.js';


export const createPedido = async (req, res) => {
    try {
        // Buscar el pedido con el ID más reciente
        const lastPedido = await Pedido.findOne().sort({ _id: -1 }).exec();
        const lastId = lastPedido ? lastPedido.idPedido : 'P0000';  // Default a 'P0000' si no existe ningún pedido

        // Verificar si el ID tiene el formato esperado
        const idPrefix = lastId.slice(0, 1);  // Extraer la letra (P)
        const numberPart = parseInt(lastId.slice(1), 10);  // Extraer el número

        if (idPrefix !== 'P' || isNaN(numberPart)) {
            // Si el ID no tiene el formato correcto, se empieza con 'P0001'
            console.log('ID inicial inválido, generando desde P0001');
            const newIdPedido = `P0001`;  // Comienza desde P0001 en lugar de P0000
            const pedido = new Pedido({
                ...req.body,
                idPedido: newIdPedido,  // Usar el nuevo ID generado
            });

            // Guardar el pedido
            await pedido.save();

            // Actualizar el estado de los mandiles a "no disponible" (true) usando el campo id de mandil
            await Mandil.updateMany(
                { id: { $in: pedido.mandiles } },  // Buscamos mandiles por el campo id
                { $set: { estado: true } }
            );

            return res.status(201).json(pedido);
        }

        // Generar el nuevo ID (incrementando el número)
        const newIdPedido = `P${String(numberPart + 1).padStart(4, '0')}`;

        // Crear el nuevo pedido con el ID generado
        const pedido = new Pedido({
            ...req.body,
            idPedido: newIdPedido,  // Usar el nuevo ID generado
        });

        // Guardar el pedido
        await pedido.save();

        // Actualizar el estado de los mandiles a "no disponible" (true) usando el campo id de mandil
        await Mandil.updateMany(
            { id: { $in: pedido.mandiles } },  // Buscamos mandiles por el campo id
            { $set: { estado: true } }
        );

        // Enviar la respuesta con el pedido creado
        res.status(201).json(pedido);
    } catch (error) {
        // Enviar error en caso de fallo
        res.status(400).json({ error: error.message });
    }
};


// Obtener todos los pedidos
export const getPedidos = async (req, res) => {
    try {
        const pedidos = await Pedido.find().populate('mandiles');
        res.status(200).json(pedidos);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Obtener un pedido por ID
export const getPedidoById = async (req, res) => {
    try {
        const pedido = await Pedido.findById(req.params.id).populate('mandiles');
        if (pedido) {
            res.status(200).json(pedido);
        } else {
            res.status(404).json({ error: 'Pedido no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Actualizar un pedido por ID
export const updatePedido = async (req, res) => {
    try {
        const pedido = await Pedido.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true }).populate('mandiles');
        if (pedido) {
            res.status(200).json(pedido);
        } else {
            res.status(404).json({ error: 'Pedido no encontrado' });
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Eliminar un pedido por ID
export const deletePedido = async (req, res) => {
    try {
        const pedido = await Pedido.findByIdAndDelete(req.params.id);
        if (pedido) {
            res.status(204).end();
        } else {
            res.status(404).json({ error: 'Pedido no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Buscar pedidos por estado
export const searchPedidosByEstado = async (req, res) => {
    try {
        const { estado } = req.query;
        if (!estado) {
            return res.status(400).json({ error: 'El parámetro de estado es requerido' });
        }

        const pedidos = await Pedido.find({ estado: estado }).populate('mandiles');
        res.status(200).json(pedidos);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Buscar pedidos por RUC
export const searchPedidosByRuc = async (req, res) => {
    try {
        const { ruc } = req.query;
        if (!ruc) {
            return res.status(400).json({ error: 'El parámetro de RUC es requerido' });
        }

        const pedidos = await Pedido.find({ ruc: new RegExp(ruc, 'i') }).populate('mandiles');
        res.status(200).json(pedidos);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Buscar pedidos por fecha (rango de fechas)
export const searchPedidosByFecha = async (req, res) => {
    try {
        const { fechaInicio, fechaFin } = req.query;

        // Verificar que ambos parámetros de fecha están presentes
        if (!fechaInicio || !fechaFin) {
            return res.status(400).json({ error: 'Los parámetros de fechaInicio y fechaFin son requeridos' });
        }

        // Filtrar los pedidos por el rango de fechas
        const pedidos = await Pedido.find({
            fechaPedido: { $gte: new Date(fechaInicio), $lte: new Date(fechaFin) }
        }).populate('mandiles');

        res.status(200).json(pedidos);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Generar un PDF de un pedido por ID
export const generatePedidoPDF = async (req, res) => {
    try {
        const pedido = await Pedido.findById(req.params.id).populate('mandiles');
        if (!pedido) {
            return res.status(404).json({ error: 'Pedido no encontrado' });
        }

        // Crear un nuevo documento PDF usando la función de la librería
        const doc = crearDocumentoPDF(pedido);

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=pedido-${pedido.idPedido}.pdf`);

        // Emitir el PDF como respuesta
        doc.pipe(res);

        // Finalizar el documento
        doc.end();
    } catch (error) {
        console.error("Error generating PDF:", error); // Agregar un log para ver el error
        res.status(500).json({ error: error.message });
    }
};
