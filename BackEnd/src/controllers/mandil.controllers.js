import Mandil from '../models/mandil.model.js';

export const createMandil = async (req, res) => {
    try {
        const lastMandil = await Mandil.findOne().sort({ _id: -1 }).exec();
        const lastId = lastMandil ? lastMandil.id_mandil : 'mandil_000';

        const numberPart = parseInt(lastId.split('_')[1], 10);
        const newId = `mandil_${String(numberPart + 1).padStart(3, '0')}`;

        const mandil = new Mandil({
            ...req.body,
            id: newId,
            estado: false, 
        });

        await mandil.save();
        res.status(201).json(mandil);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Obtener todos los mandiles
export const getMandiles = async (req, res) => {
    try {
        const mandiles = await Mandil.find();
        res.status(200).json(mandiles);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Obtener un mandil por ID
export const getMandilById = async (req, res) => {
    try {
        const mandil = await Mandil.findById(req.params.id);
        if (mandil) {
            res.status(200).json(mandil);
        } else {
            res.status(404).json({ error: 'Mandil no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Actualizar un mandil por ID
export const updateMandil = async (req, res) => {
    try {
        const mandil = await Mandil.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (mandil) {
            res.status(200).json(mandil);
        } else {
            res.status(404).json({ error: 'Mandil no encontrado' });
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Eliminar un mandil por ID
export const deleteMandil = async (req, res) => {
    try {
        const mandil = await Mandil.findByIdAndDelete(req.params.id);
        if (mandil) {
            res.status(204).end();
        } else {
            res.status(404).json({ error: 'Mandil no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Buscar mandiles por color
export const searchMandilesByColor = async (req, res) => {
    try {
        const { color } = req.query;
        if (!color) {
            return res.status(400).json({ error: 'El parámetro de color es requerido' });
        }

        const mandiles = await Mandil.find({ color: new RegExp(color, 'i') });
        res.status(200).json(mandiles);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const searchMandilesByEstado = async (req, res) => {
    try {
        const { estado } = req.query;

        if (estado === undefined) {
            const mandiles = await Mandil.find();
            return res.status(200).json(mandiles);
        }

        const estadoBool = estado === 'true';
        const mandiles = await Mandil.find({ estado: estadoBool });
        res.status(200).json(mandiles);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};