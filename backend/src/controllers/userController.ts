import { Request, Response } from 'express';
import expressAsyncHandler from 'express-async-handler';
import { UserModel } from '../models/userModel';
import bcrypt from 'bcryptjs';
import { generateToken } from '../utils';

const getUser = expressAsyncHandler(async (req: Request, res: Response) => {
  const user = await UserModel.findOne({ email: req.body.email });

  if (!user) {
    res
      .status(401)
      .json({ message: 'User not found. Please create an account.' });
    return;
  }

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
  res.status(401).json({ message: 'Invalid Email or Password' });
});

const userUpdate = expressAsyncHandler(async (req: Request, res: Response) => {
  const user = await UserModel.findById(req.user._id);

  if (!user) {
    res.status(404).json({ message: 'User not found' });
    return;
  }

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;

    if (req.body.password) {
      user.password = bcrypt.hashSync(req.body.password, 10);
    }

    const updateUser = await user.save();

    res.json({
      _id: updateUser._id,
      name: updateUser.name,
      email: updateUser.email,
      isAdmin: updateUser.isAdmin,
      token: generateToken(updateUser),
    });
    return;
  }
});

export { getUser, userUpdate };
