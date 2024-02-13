import { Request, Response } from 'express';
import { sampleProducts } from '../data';

const getProducts = (req: Request, res: Response) => {
  res.json(sampleProducts);
};

const getProduct = (req: Request, res: Response) => {
  const product = sampleProducts.find((p) => p.slug === req.params.slug);
  res.json(product);
};

export { getProducts, getProduct};
