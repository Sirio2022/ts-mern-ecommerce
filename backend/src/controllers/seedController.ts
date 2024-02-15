import { Request, Response } from 'express';
import expressAsyncHandler from 'express-async-handler';
import { ProductModel } from '../models/productModel';
import { sampleProducts } from '../data';

const seed = expressAsyncHandler(async (req: Request, res: Response) => {
  await ProductModel.deleteMany({});
  const createdProducts = await ProductModel.insertMany(sampleProducts);
  res.json({ createdProducts });
});

export { seed };
