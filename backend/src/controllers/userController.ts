import { Request, Response } from 'express';
import expressAsyncHandler from 'express-async-handler';
import { UserModel } from '../models/userModel';
import bcrypt from 'bcryptjs';
import { generateToken } from '../utils';

const getUser = expressAsyncHandler(async (req: Request, res: Response) => {
  const user = await UserModel.findOne({ email: req.body.email });
  if (user) {
    if (bcrypt.compareSync(req.body.password, user.password)) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        token: generateToken(user),
      });
      return;
    }
  }
  res.status(401).json({ mesaage: 'Invalid Email or Password' });
});

export { getUser };
