import { Request, Response } from 'express';
import expressAsyncHandler from 'express-async-handler';

const paypalKeys = expressAsyncHandler(async (req: Request, res: Response) => {
  res.json({ clientId: process.env.PAYPAL_CLIENT_ID || 'sb' });
});

export { paypalKeys };
