import express from 'express';
import { getUser, userUpdate } from '../controllers/userController';

const router = express.Router();

router.post('/', getUser);
router.put('/', userUpdate);

export default router;
