import mongoose from "mongoose";

const mandilSchema = new mongoose.Schema({
    ubicacion: {
        type: String,
        required: true,
        trim: true
    },
    color: {
        type: String,
        required: true,
        trim: true
    },
    id: {
        type: String,
        required: true,
        unique: true
    },
    estado: {
        type: Boolean,
        default: false 
    }
}, {
    timestamps: true,
    versionKey: false
});

export default mongoose.model('Mandil', mandilSchema);