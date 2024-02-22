import express from 'express';
import {
  placeOrder,
  getOrder,
  paypalPayment,
} from '../controllers/orderController';

const router = express.Router();

router.get('/:id', getOrder);
router.post('/', placeOrder);
router.put('/:id/pay', paypalPayment);

export default router;
