import express from 'express';
import {
  getProducts,
  getProduct,
  getCategoryProducts,
  getSearchProducts,
  getSearchCategoryProducts,
  getAdminProducts,
  createAdminProduct,
  updateAdminProduct,
  deleteAdminProduct,
  getProductById,
} from '../controllers/productController';
import { isAuth } from '../utils';

const router = express.Router();

router.get('/', getProducts);
router.get('/slug/:slug', getProduct);
router.get('/categories', getCategoryProducts);
router.get('/search', getSearchProducts);
router.get('/search/category/:category', getSearchCategoryProducts);
router.get('/admin/:id',isAuth, getProductById);
router.get('/admin', isAuth, getAdminProducts);
router.post('/admin/createproduct', isAuth, createAdminProduct);
router.put('/admin/updateproduct/:id', isAuth, updateAdminProduct);
router.delete('/admin/deleteproduct/:id', isAuth, deleteAdminProduct);

export default router;
