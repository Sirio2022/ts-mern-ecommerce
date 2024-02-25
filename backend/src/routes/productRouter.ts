import express from 'express';
import {
  getProducts,
  getProduct,
  getCategoryProducts,
  getSearchProducts,
  getSearchCategoryProducts,
} from '../controllers/productController';

const router = express.Router();

router.get('/', getProducts);
router.get('/slug/:slug', getProduct);
router.get('/categories', getCategoryProducts);
router.get('/search', getSearchProducts);
router.get('/search/category/:category', getSearchCategoryProducts);

export default router;
