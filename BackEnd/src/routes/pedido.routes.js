import { Router } from "express";
import { 
    createPedido, 
    getPedidos, 
    getPedidoById, 
    updatePedido, 
    deletePedido, 
    searchPedidosByEstado, 
    searchPedidosByRuc, 
    searchPedidosByFecha, 
    generatePedidoPDF 
} from '../controllers/pedido.controllers.js';

const router = Router();

router.post('/pedidos', createPedido);
router.get('/pedidos', getPedidos);
router.get('/pedidos/:id', getPedidoById);
router.put('/pedidos/:id', updatePedido);
router.delete('/pedidos/:id', deletePedido);

// Búsqueda por estado
router.get('/pedidos/search/estado', searchPedidosByEstado);

// Búsqueda por RUC
router.get('/pedidos/search/ruc', searchPedidosByRuc);

// Búsqueda por fecha
router.get('/pedidos/search/fecha', searchPedidosByFecha);

//PDF 

router.get('/pedidos/:id/pdf', generatePedidoPDF);

export default router;
