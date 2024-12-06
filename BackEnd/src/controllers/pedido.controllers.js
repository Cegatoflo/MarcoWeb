import Pedido from '../models/pedido.models.js';
import { crearDocumentoPDF } from '../libs/pdf.js';

// Crear un nuevo pedido
export const createPedido = async (req, res) => {
    try {
        const pedido = new Pedido(req.body);
        await pedido.save();

        // Actualizar el estado de los mandiles a "no disponible" (true)
        await Mandil.updateMany(
            { _id: { $in: pedido.mandiles } },
            { $set: { estado: true } }
        );

        res.status(201).json(pedido);
    } catch (error) {
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
        res.status(500).json({ error: error.message });
    }
};