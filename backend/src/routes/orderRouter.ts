import express from 'express';
import {
  placeOrder,
  getOrder,
  paypalPayment,
  getOrders,
} from '../controllers/orderController';

const router = express.Router();

router.get('/mine', getOrders)
router.get('/:id', getOrder);
router.post('/', placeOrder);
router.put('/:id/pay', paypalPayment);

export default router;
