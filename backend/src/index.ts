import express from 'express';
import dotenv from 'dotenv';
import productRoutes from './routes/productRouter';
import cors from 'cors';
import mongoose from 'mongoose';

const app = express();
dotenv.config();

app.use(express.json());

const dataBaseConnection = process.env.MONGO_URI;
mongoose.set('strictQuery', true);

if (dataBaseConnection) {
  mongoose
    .connect(dataBaseConnection)
    .then(() => console.log('MongoDB connected successfully'));
}

const whitelist = [process.env.FRONTEND_URL];
const corsOptions = {
  origin: (origin: string | undefined, callback: any) => {
    // Review the access to the server
    const exist = whitelist.some((domain) => domain === origin);
    if (exist) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
};

app.use(cors(corsOptions));

app.use('/api/products', productRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
