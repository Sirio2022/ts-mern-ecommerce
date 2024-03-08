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
}) as any;

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
}) as any;

const adminUsers = expressAsyncHandler(async (req: Request, res: Response) => {
  const users = await UserModel.find({});
  res.json(users);
}) as any;

const deleteAdminUserById = expressAsyncHandler(
  async (req: Request, res: Response) => {
    try {
      const user = await UserModel.findById(req.params.id);
      if (user) {
        if (user.isAdmin) {
          res.status(400).json({ message: 'You cannot delete an admin' });
          return;
        }
        const deleteUser = await user.deleteOne();
        res.json({ message: 'User deleted successfully', deleteUser });
      } else {
        res.status(404).json({ message: 'User not found' });
      }
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }
) as any;

const getAdminUserById = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const user = await UserModel.findById(req.params.id).select('-password');
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  }
) as any;

const updateUserById = expressAsyncHandler(
  async (req: Request, res: Response) => {
    try {
      const user = await UserModel.findById(req.params.id);

      if (user) {
        const { name, email, isAdmin } = req.body;
        user.name = name || user.name;
        user.email = email || user.email;
        user.isAdmin = Boolean(isAdmin);

        const updateUser = await user.save();

        res.status(200).json({
          message: 'User updated successfully',
          user: updateUser,
        });
      }
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }
) as any;

export {
  getUser,
  userUpdate,
  adminUsers,
  deleteAdminUserById,
  getAdminUserById,
  updateUserById,
};
