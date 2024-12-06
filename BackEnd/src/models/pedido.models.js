// c:\Users\ASUS\Documents\GitHub\PYFJS\BackEnd\src\models\pedido.models.js
import mongoose from "mongoose";

const pedidoSchema = new mongoose.Schema({
    idPedido: {
        type: String,
        required: true,
        unique: true 
    },
    ruc: {
        type: String,
        required: true,
        trim: true
    },
    mandiles: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Mandil', 
        required: true,
    }],
    estado: {
        type: String,
        enum: ['pendiente', 'en_proceso', 'completado', 'cancelado'], 
        default: 'pendiente' 
    },
    fechaPedido: {
        type: Date,
        default: Date.now,
    }
}, {
    timestamps: true,
    versionKey: false
});

export default mongoose.model('Pedido', pedidoSchema);