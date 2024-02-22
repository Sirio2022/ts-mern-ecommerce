import express from 'express';
import { paypalKeys } from '../controllers/paypalController';

const paypalRouter = express.Router();

paypalRouter.get('/', paypalKeys);


export default paypalRouter;