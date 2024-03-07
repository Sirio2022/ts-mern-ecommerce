import { Request, Response } from 'express';

const uploadFile = async (req: Request, res: Response) => {
  res.send(`/${req.file?.path}`);
};

export { uploadFile };
