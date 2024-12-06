import { Router } from "express";
import { createMandil, getMandiles, getMandilById, updateMandil, deleteMandil, searchMandilesByColor, searchMandilesByEstado } from '../controllers/mandil.controllers.js';

const router = Router();

router.post('/mandiles', createMandil);
router.get('/mandiles', getMandiles);
router.get('/mandiles/:id', getMandilById);
router.put('/mandiles/:id', updateMandil);
router.delete('/mandiles/:id', deleteMandil);
router.get('/mandiles/search/color', searchMandilesByColor);
router.get('/mandiles/search/estado', searchMandilesByEstado);

export default router;