import express from 'express';
import productRoutes from './routes/productRouter';

const app = express();

app.use('/api/products', productRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
