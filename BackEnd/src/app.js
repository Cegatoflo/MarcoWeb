import express from 'express';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import cors from 'cors'; // Importa el middleware CORS
import authRoutes from './routes/auth.routes.js';
import { requestLogger } from './middlewares/RequestLogger.js';
import clientRoutes from './routes/client.routes.js';
import mandilRoutes from "./routes/mandil.routes.js";
import pedidoRoutes from "./routes/pedido.routes.js";

const app = express();

// Configuración de middlewares
app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser());

// Configuración de CORS para permitir solicitudes desde un origen específico
app.use(cors({
    origin: ['http://localhost:5173', 'https://jmar20.github.io'], // Acepta solo solicitudes desde estos dominios
    credentials: true,  // Permite el uso de cookies y credenciales
    sameSite: 'none' // Permitir el uso de cookies en solicitudes entre diferentes orígenes

}));

// Middleware para registrar solicitudes
app.use(requestLogger);

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/client', clientRoutes);
app.use('/api/mandil', mandilRoutes);
app.use('/api/pedido', pedidoRoutes);

// Ruta principal
app.get('/', (req, res) => {
    res.send('<h1>Inicio</h1>');
});

// Manejo de rutas no encontradas (opcional)
app.use((req, res) => {
    res.status(404).json({ message: 'Ruta no encontrada' });
});

export default app;
