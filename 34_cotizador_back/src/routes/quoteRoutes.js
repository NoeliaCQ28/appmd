import express from 'express';
import QuoteController from '../controllers/quoteController.js';
import QuoteDetailsController from '../controllers/quoteDetailsController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', authMiddleware, QuoteController.getAll);
router.get('/tipos', authMiddleware, QuoteController.getAllQuoteTypes);
router.get('/:id', authMiddleware, QuoteController.getById);
router.get('/:id/economic-offer', authMiddleware, QuoteController.economicOffer);
router.post('/', authMiddleware, QuoteController.create);
router.put('/:id', authMiddleware, QuoteController.update);
router.put('/:id/estado', authMiddleware, QuoteController.updateState);
router.delete('/:id', authMiddleware, QuoteController.delete);
router.get('/validar/:id', authMiddleware, QuoteController.validateQuote);

router.get('/:id/detalles', authMiddleware, QuoteDetailsController.getAllByQuoteId);
router.get('/:id/ficha-tecnica', authMiddleware, QuoteDetailsController.getIntegradora);
router.delete('/:id/detalles/:detalle_id', authMiddleware, QuoteDetailsController.delete);
router.put('/:id/detalles/:detalle_id', authMiddleware, QuoteDetailsController.update);

router.put('/update/quantity/:cotizacion_id', authMiddleware, QuoteDetailsController.updateQuantity);

router.get('/:id/items/:detalle_id', authMiddleware, QuoteDetailsController.getDetails);
router.post('/:quote_id/add-items', authMiddleware, QuoteDetailsController.addItemsDetails);
router.post('/:id/detalles/add', authMiddleware, QuoteDetailsController.addDetails);
export default router;
