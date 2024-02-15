import express from 'express';
import { getProducts, getProduct } from '../controllers/productController';
import { seed } from '../controllers/seedController';

const router = express.Router();

router.get('/seed', seed);
router.get('/', getProducts);
router.get('/slug/:slug', getProduct);

export default router;
