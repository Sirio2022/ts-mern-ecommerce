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
router
  .route('/:id')
  .delete(isAuth, deleteAdminUserById)
  .get(isAuth, getAdminUserById)
  .put(isAuth, updateUserById);

export default router;
