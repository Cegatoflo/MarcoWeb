import mongoose from 'mongoose';

export const connectDB = async ()=> {
    try {
        await mongoose.connect('mongodb+srv://cesargabrieltorresflorez:cesar@cluster0.xrbdb.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
        console.log('Database is connected');
    } catch (error) {
        console.log(error);
        
    }
}