import express from 'express';
import { getCloudinarySignature } from '../controllers/cloudinaryController';

const router = express.Router();

router.get('/', getCloudinarySignature);

export default router;
