import { Request, Response } from 'express';
import expressAsyncHandler from 'express-async-handler';
import { OrderModel } from '../models/orderModel';
import { Product } from '../models/productModel';

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
      itemsPrice: req.body.itemsPrice,
      shippingPrice: req.body.shippingPrice,
      taxPrice: req.body.taxPrice,
      totalPrice: req.body.totalPrice,
      user: req.user._id,
    });
    res.status(201).json({
      order: createOrder,
      message: 'Order created successfully',
    });
  }
});

export { placeOrder };
