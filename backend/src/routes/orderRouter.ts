import express from 'express';
import {
  placeOrder,
  getOrder,
  paypalPayment,
  getOrders,
  Summary,
  getAdminOrders,
  updateAdminOrder,
} from '../controllers/orderController';

const router = express.Router();

router.put('/adminorders/:id/deliver', updateAdminOrder);
router.get('/adminorders', getAdminOrders);
router.get('/summary', Summary);
router.get('/mine', getOrders);
router.get('/:id', getOrder);
router.post('/', placeOrder);
router.put('/:id/pay', paypalPayment);

export default router;
