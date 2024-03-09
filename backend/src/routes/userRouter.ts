import express from 'express';
import {
  getUser,
  userUpdate,
  adminUsers,
  deleteAdminUserById,
  getAdminUserById,
  updateUserById,
} from '../controllers/userController';
import { isAuth } from '../utils';

const router = express.Router();

router.post('/', getUser);
router.put('/', userUpdate);
router.get('/', isAuth, adminUsers);
router.get('/:id', isAuth, getAdminUserById);
router.delete('/deleteuser/:id', deleteAdminUserById);
router.put('/updateuser/:id', updateUserById);

export default router;
