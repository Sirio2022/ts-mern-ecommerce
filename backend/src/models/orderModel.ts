import {
  modelOptions,
  prop,
  getModelForClass,
  Ref,
  Severity,
} from '@typegoose/typegoose';
import { Product } from './productModel';
import { User } from './userModel';

class ShippingAddress {
  @prop({ required: true })
  public fullName?: string;

  @prop({ required: true })
  public address?: string;

  @prop({ required: true })
  public city?: string;

  @prop({ required: true })
  public postalCode?: string;

  @prop({ required: true })
  public country?: string;

  @prop({ required: true })
  public lat?: number;

  @prop({ required: true })
  public lng?: number;
}

class Item {
  @prop({ required: true, allowMixed: Severity.ALLOW }) // allow the use and execution of mongoose.Schema.Types.Mixed, if the inferred type cannot be set otherwise
  public product?: Ref<Product>;

  @prop({ required: true })
  public name!: string;

  @prop({ required: true })
  public image!: string;

  @prop({ required: true })
  public price!: number;

  @prop({ required: true })
  public qty!: number;
}

class PaymentResult {
  @prop({ required: true })
  public paymentId!: string;

  @prop({ required: true })
  public status!: string;

  @prop({ required: true })
  public update_time!: string;

  @prop({ required: true })
  public email_address!: string;
}

modelOptions({ schemaOptions: { timestamps: true } });

export class Order {
  public _id!: string;

  @prop({ required: true, allowMixed: Severity.ALLOW })  // allow the use and execution of mongoose.Schema.Types.Mixed, if the inferred type cannot be set otherwise
  public user?: Ref<User>;

  @prop({ required: true, allowMixed: Severity.ALLOW }) // allow the use and execution of mongoose.Schema.Types.Mixed, if the inferred type cannot be set otherwise
  public orderItems?: Item[];

  @prop({ required: true })
  public shippingAddress?: ShippingAddress;

  @prop({ required: true })
  public paymentMethod!: string;

  @prop({ required: true })
  public paymentResult?: PaymentResult;

  @prop({ required: true, default: 0.0 })
  public itemsPrice!: number;

  @prop({ required: true, default: 0.0 })
  public shippingPrice!: number;

  @prop({ required: true, default: 0.0 })
  public taxPrice!: number;

  @prop({ required: true, default: 0.0 })
  public totalPrice!: number;

  @prop({ required: true, default: false })
  public isPaid!: boolean;

  @prop({ required: true })
  public paidAt!: Date;

  @prop({ required: true, default: false })
  public isDelivered!: boolean;

  @prop({ required: true })
  public deliveredAt!: Date;
}

export const OrderModel = getModelForClass(Order);
