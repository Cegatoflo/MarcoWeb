
import mongoose from "mongoose";

const clientSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        trim: true
    },
    RUC: {
        type: String,
        required: true,
        unique: true,
        trim: true
    }
}, {
    timestamps: true,
    versionKey: false
});

export default mongoose.model('Client', clientSchema);