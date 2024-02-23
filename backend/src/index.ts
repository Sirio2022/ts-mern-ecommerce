import express from 'express';
import dotenv from 'dotenv';
import productRoutes from './routes/productRouter';
import userRoutes from './routes/userRouter';
import registerRoutes from './routes/registerRouter';
import orderRoutes from './routes/orderRouter';
import paypalRoutes from './routes/paypalRouter';
import cors from 'cors';
import mongoose from 'mongoose';
import { isAuth } from './utils';
import path from 'path';
import { Request, Response } from 'express';

const app = express();
dotenv.config();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Database connection
const dataBaseConnection = process.env.MONGO_URI;
mongoose.set('strictQuery', true);

if (dataBaseConnection) {
  mongoose
    .connect(dataBaseConnection)
    .then(() => console.log('MongoDB connected successfully'));
}

// Cors configuration

// Enable CORS
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);

// Routes
app.use('/api/products', productRoutes);
app.use('/api/users/signin', userRoutes);
app.use('/api/users/register', registerRoutes);
app.use('/api/orders', isAuth, orderRoutes);
app.use('/api/keys/paypal', isAuth, paypalRoutes);

// Serve static files
app.use(express.static(path.join(__dirname, '../../frontend/dist')));
app.get('*', (req: Request, res: Response) =>
  res.sendFile(path.join(__dirname, '../../frontend/dist/index.html'))
);

const PORT: number = parseInt((process.env.PORT || '5005') as string, 10);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
