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

export { placeOrder, getOrder, paypalPayment };
