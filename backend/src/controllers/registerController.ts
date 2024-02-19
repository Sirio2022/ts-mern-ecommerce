import { Request, Response } from 'express';
import expressAsyncHandler from 'express-async-handler';
import { User, UserModel } from '../models/userModel';
import bcrypt from 'bcryptjs';
import { generateToken } from '../utils';

const registerUser = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const user = await UserModel.create({
      name: req.body.name,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 10),
    } as User);

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user),
    });
  }
);

export { registerUser };
