import { Router } from "express";
import { createPedido, getPedidos, getPedidoById, updatePedido, deletePedido, searchPedidosByEstado, searchPedidosByRuc, generatePedidoPDF } from '../controllers/pedido.controllers.js';

const router = Router();

router.post('/pedidos', createPedido);
router.get('/pedidos', getPedidos);
router.get('/pedidos/:id', getPedidoById);
router.put('/pedidos/:id', updatePedido);
router.delete('/pedidos/:id', deletePedido);
router.get('/pedidos/search/estado', searchPedidosByEstado);
router.get('/pedidos/search/ruc', searchPedidosByRuc);
router.get('/pedidos/:id/pdf', generatePedidoPDF);

export default router;