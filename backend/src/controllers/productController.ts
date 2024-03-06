import { Request, Response } from 'express';
import expressAsyncHandler from 'express-async-handler';
import { ProductModel } from '../models/productModel';

const getProducts = expressAsyncHandler(async (req: Request, res: Response) => {
  const products = await ProductModel.find().sort({ createdAt: 1 });
  res.json(products);
}) as any;

const getProduct = expressAsyncHandler(async (req: Request, res: Response) => {
  const product = await ProductModel.findOne({ slug: req.params.slug });
  if (product) {
    res.json(product);
  } else {
    res.status(404).json({ message: 'Product not found' });
  }
}) as any;

const getCategoryProducts = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const categories = await ProductModel.find().distinct('category');
    res.json(categories);
  }
) as any;

const getSearchProducts = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const query = req.query.query
      ? { name: { $regex: req.query.query, $options: 'i' } }
      : {};
    const products = await ProductModel.find({ ...query });
    res.json(products);
  }
) as any;

const getSearchCategoryProducts = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const products = await ProductModel.find({ category: req.params.category });
    if (products.length === 0) {
      res.status(404).json({ message: 'No products found in this category' });
      return;
    }
    res.json(products);
  }
) as any;

const getAdminProducts = expressAsyncHandler(
  async (req: Request, res: Response) => {
    if (!req.user?.isAdmin) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }
    const products = await ProductModel.find().sort({ createdAt: 1 });
    res.json(products);
  }
) as any;

const createAdminProduct = expressAsyncHandler(
  async (req: Request, res: Response) => {
    if (!req.user?.isAdmin) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }
    const createdProduct = await ProductModel.create({
      name: req.body.name,
      slug: req.body.slug,
      image: req.body.image,
      brand: req.body.brand,
      category: req.body.category,
      description: req.body.description,
      price: req.body.price,
      countInStock: req.body.countInStock,
      rating: req.body.rating,
      numReviews: req.body.numReviews,
    });
    res.json({
      message: 'Product created successfully',
      product: createdProduct,
    });
  }
) as any;

const updateAdminProduct = expressAsyncHandler(
  async (req: Request, res: Response) => {
    if (!req.user?.isAdmin) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }
    const updatedProduct = await ProductModel.findById(req.params.id);

    if (!updatedProduct) {
      res.status(404).json({ message: 'Product not found' });
      return;
    }

    updatedProduct.name = req.body.name;
    updatedProduct.slug = req.body.slug;
    updatedProduct.image = req.body.image;
    updatedProduct.brand = req.body.brand;
    updatedProduct.category = req.body.category;
    updatedProduct.description = req.body.description;
    updatedProduct.price = req.body.price;
    updatedProduct.countInStock = req.body.countInStock;
    updatedProduct.rating = req.body.rating;
    updatedProduct.numReviews = req.body.numReviews;

    await updatedProduct.save();
    res.json({ message: 'Product updated successfully' });
  }
) as any;

const deleteAdminProduct = expressAsyncHandler(
  async (req: Request, res: Response) => {
    if (!req.user?.isAdmin) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }
    const product = await ProductModel.findById(req.params.id);

    if (!product) {
      res.status(404).json({ message: 'Product not found' });
      return;
    }
    await product.deleteOne();
    res.json({ message: 'Product removed successfully' });
  }
) as any;

const getProductById = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const product = await ProductModel.findById(req.params.id);
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  }
) as any;

export {
  getProducts,
  getProduct,
  getCategoryProducts,
  getSearchProducts,
  getSearchCategoryProducts,
  getAdminProducts,
  createAdminProduct,
  updateAdminProduct,
  deleteAdminProduct,
  getProductById,
};
