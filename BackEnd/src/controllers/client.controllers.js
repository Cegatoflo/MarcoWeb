import Client from '../models/client.models.js';

// Crear un nuevo cliente
export const createClient = async (req, res) => {
    try {
        const client = new Client(req.body);
        await client.save();
        res.status(201).json(client);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Obtener todos los clientes
export const getClients = async (req, res) => {
    try {
        const clients = await Client.find();
        res.status(200).json(clients);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Obtener un cliente por ID
export const getClientById = async (req, res) => {
    try {
        const client = await Client.findById(req.params.id);
        if (client) {
            res.status(200).json(client);
        } else {
            res.status(404).json({ error: 'Cliente no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Actualizar un cliente por ID
export const updateClient = async (req, res) => {
    try {
        const client = await Client.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (client) {
            res.status(200).json(client);
        } else {
            res.status(404).json({ error: 'Cliente no encontrado' });
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Eliminar un cliente por ID
export const deleteClient = async (req, res) => {
    try {
        const client = await Client.findByIdAndDelete(req.params.id);
        if (client) {
            res.status(204).end();
        } else {
            res.status(404).json({ error: 'Cliente no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Buscar clientes por nombre
export const searchClientsByName = async (req, res) => {
    try {
        const { nombre } = req.query;
        if (!nombre) {
            return res.status(400).json({ error: 'El parámetro de nombre es requerido' });
        }

        const clients = await Client.find({ nombre: new RegExp(nombre, 'i') });
        res.status(200).json(clients);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
