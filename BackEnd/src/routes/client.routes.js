import { Router } from "express";
import { createClient, getClients, getClientById, updateClient, deleteClient, searchClientsByName } from '../controllers/client.controllers.js';

const router = Router();

router.post('/clients', createClient);
router.get('/clients', getClients);
router.get('/clients/:id', getClientById);
router.put('/clients/:id', updateClient);
router.delete('/clients/:id', deleteClient);
router.get('/clients/search', searchClientsByName);

export default router;