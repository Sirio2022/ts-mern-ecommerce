import express from 'express';
import { getProducts, getProduct } from '../controllers/productController';

const router = express.Router();

router.get('/', getProducts);
router.get('/:slug', getProduct);

export default router;
