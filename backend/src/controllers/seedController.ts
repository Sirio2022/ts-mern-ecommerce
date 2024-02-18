import { Request, Response } from 'express';
import expressAsyncHandler from 'express-async-handler';
import { ProductModel } from '../models/productModel';
import { sampleProducts, sampleUsers } from '../data';
import { UserModel } from '../models/userModel';

const seed = expressAsyncHandler(async (req: Request, res: Response) => {
  await ProductModel.deleteMany({});
  const createdProducts = await ProductModel.insertMany(sampleProducts);

  await UserModel.deleteMany({});
  const createdUsers = await UserModel.insertMany(sampleUsers);
  res.json({ createdProducts, createdUsers });
});

export { seed };
