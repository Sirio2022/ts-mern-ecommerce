import express from 'express';
import {
  getProducts,
  getProduct,
  getCategoryProducts,
} from '../controllers/productController';

const router = express.Router();

router.get('/', getProducts);
router.get('/slug/:slug', getProduct);
router.get('/categories', getCategoryProducts);

export default router;
