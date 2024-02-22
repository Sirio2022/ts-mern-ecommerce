import express from 'express';
import { placeOrder, getOrder } from '../controllers/orderController';

const router = express.Router();

router.get('/:id', getOrder);
router.post('/', placeOrder);

export default router;
