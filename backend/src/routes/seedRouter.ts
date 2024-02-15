import express from 'express';
import { seed } from '../controllers/seedController';

const router = express.Router();

router.get('/', seed);

export default router;




