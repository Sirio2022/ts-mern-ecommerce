import { Request, Response } from 'express';
import { sampleProducts } from '../data';

const getProducts = (req: Request, res: Response) => {
  res.json(sampleProducts);
};

export { getProducts };
