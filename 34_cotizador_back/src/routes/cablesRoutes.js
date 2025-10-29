import CablesController from '#controllers/CablesController.js';
import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/parametros', authMiddleware, CablesController.getParams);
router.post('/buscar', authMiddleware, CablesController.getCables);
router.get('/', authMiddleware, CablesController.getAll);

router.post('/create', authMiddleware, CablesController.create);
router.put('/update/:id', authMiddleware, CablesController.update);
router.patch('/delete/:id', authMiddleware, CablesController.delete);

export default router;
