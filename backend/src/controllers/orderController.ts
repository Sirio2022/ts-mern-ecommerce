import { Request, Response } from 'express';
import expressAsyncHandler from 'express-async-handler';
import { OrderModel } from '../models/orderModel';
import { Product, ProductModel } from '../models/productModel';
import { UserModel } from '../models/userModel';

const getOrders = expressAsyncHandler(async (req: Request, res: Response) => {
  const orders = await OrderModel.find({ user: req.user._id });
  res.json(orders);
});

const placeOrder = expressAsyncHandler(async (req: Request, res: Response) => {
  if (req.body.orderItems.length === 0) {
    res.status(400).send({ message: 'Cart is empty' });
  } else {
    const createOrder = await OrderModel.create({
      orderItems: req.body.orderItems.map((item: Product) => ({
        ...item,
        product: item._id,
      })),
      shippingAddress: req.body.shippingAddress,
      paymentMethod: req.body.paymentMethod,
      cartPrices: req.body.cartPrices,
      user: req.user._id,
    });
    res.status(201).json({ message: 'New Order Created', order: createOrder });
  }
});

const getOrder = expressAsyncHandler(async (req: Request, res: Response) => {
  const order = await OrderModel.findById(req.params.id);
  if (order) {
    res.json(order);
  } else {
    res.status(404).json({ message: 'Order not found' });
  }
});

const paypalPayment = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const order = await OrderModel.findById(req.params.id).populate('user');

    if (order) {
      order.isPaid = true;
      order.paidAt = new Date(Date.now());
      order.paymentResult = {
        paymentId: req.body.id,
        status: req.body.status,
        update_time: req.body.update_time,
        email_address: req.body.email_address,
      };

      const updatedOrder = await order.save();

      res.status(200).json({ message: 'Order Paid', order: updatedOrder });
    } else {
      res.status(404).json({ message: 'Order Not Found' });
    }
  }
);

const Summary = expressAsyncHandler(async (req: Request, res: Response) => {
  const ordersCount = await OrderModel.countDocuments();
  const usersCount = await UserModel.countDocuments();
  const productsCount = await ProductModel.countDocuments();

  const ordersPriceGroup = await OrderModel.aggregate([
    {
      $group: {
        _id: null,
        sales: { $sum: '$cartPrices.totalPrice' },
      },
    },
  ]);

  const ordersPrice =
    ordersPriceGroup.length > 0 ? ordersPriceGroup[0]?.sales : 0;

  const salesData = await OrderModel.aggregate([
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
        totalOrders: { $sum: 1 },
        totalSales: { $sum: '$cartPrices.totalPrice' },
      },
    },
    {
      $sort: { _id: 1 },
    },
  ]);

  const productsData = await ProductModel.aggregate([
    {
      $group: {
        _id: '$category',
        totalProducts: { $sum: 1 },
      },
    },
    {
      $sort: { _id: 1 },
    },
  ]);

  const userData = await UserModel.aggregate([
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
        totalUsers: { $sum: 1 },
      },
    },
    {
      $sort: { _id: 1 },
    },
  ]);

  res.json({
    ordersCount,
    usersCount,
    productsCount,
    ordersPrice,
    salesData,
    productsData,
    userData,
  });
});

const getAdminOrders = expressAsyncHandler(
  async (req: Request, res: Response) => {
    if (!req.user?.isAdmin) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }
    const orders = await OrderModel.find({})
      .sort({ createdAt: -1 })
      .populate('user', 'name');
    res.json(orders);
  }
) as any;

const updateAdminOrder = expressAsyncHandler(
  async (req: Request, res: Response) => {
    if (!req.user?.isAdmin) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }
    const order = await OrderModel.findById(req.params.id);

    if (order) {
      if (!order.isPaid) res.status(400).json({ message: 'Order not paid' });

      order.isDelivered = true;
      order.deliveredAt = new Date(Date.now());

      const updatedOrder = await order.save();

      res.status(200).json({ message: 'Order Delivered', order: updatedOrder });
    } else {
      res.status(404).json({ message: 'Order Not Found' });
    }
  }
) as any;

export {
  placeOrder,
  getOrder,
  paypalPayment,
  getOrders,
  Summary,
  getAdminOrders,
  updateAdminOrder,
};
