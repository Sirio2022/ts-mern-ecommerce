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
import cloudinary from 'cloudinary';
import crypto from 'crypto';

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

// Enable CORS
app.use(
  cors({
    origin: [`${process.env.FRONTEND_URL}`],
    credentials: true,
  })
);


// Configura Cloudinary con tus credenciales
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

app.get('/api/cloudinary/signature', (req: Request, res: Response) => {
  // Genera una firma
  const timestamp = Math.floor((new Date()).getTime() / 1000);
  const params_to_sign = {
    timestamp: timestamp,
    upload_preset: process.env.CLOUDINARY_UPLOAD_PRESET
  };
  const signature = crypto.createHash('sha1').update(cloudinary.v2.utils.api_sign_request(params_to_sign, process.env.CLOUDINARY_API_SECRET || '')).digest('hex');

  // Envía la firma y el timestamp como respuesta
  res.json({ signature, timestamp });
});

// Routes
app.use('/api/products', productRoutes);
app.use('/api/users/signin', userRoutes);
app.use('/api/users/register', registerRoutes);
app.use('/api/users/profile', isAuth, userRoutes);
app.use('/api/orders', isAuth, orderRoutes);
app.use('/api/keys/paypal', isAuth, paypalRoutes);

// Serve static files

app.use(express.static(path.join(__dirname, '../../frontend/dist')));
app.get('*', (req: Request, res: Response) =>
  res.sendFile(path.join(__dirname, '../../frontend/dist/index.html'))
);

const PORT: number = parseInt((process.env.PORT || '5005') as string, 10);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
