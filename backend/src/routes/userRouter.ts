import express from 'express';
import { getUser } from '../controllers/userController';

const router = express.Router();

router.post('/', getUser )



export default router;

