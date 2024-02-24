import { Request, Response } from 'express';
import expressAsyncHandler from 'express-async-handler';
import { ProductModel } from '../models/productModel';

const getProducts = expressAsyncHandler(async (req: Request, res: Response) => {
  const products = await ProductModel.find().sort({ createdAt: 1 });
  res.json(products);
});

const getProduct = expressAsyncHandler(async (req: Request, res: Response) => {
  const product = await ProductModel.findOne({ slug: req.params.slug });
  if (product) {
    res.json(product);
  } else {
    res.status(404).json({ message: 'Product not found' });
  }
});

const getCategoryProducts = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const categories = await ProductModel.find().distinct('category');
    res.json(categories);
  }
);

export { getProducts, getProduct, getCategoryProducts };
