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

  @prop()
  public lat?: number;

  @prop()
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
  @prop()
  public paymentId!: string;

  @prop()
  public status!: string;

  @prop()
  public update_time!: string;

  @prop()
  public email_address!: string;
}

modelOptions({ schemaOptions: { timestamps: true } });

export class Order {
  public _id!: string;

  @prop({ ref: User, allowMixed: Severity.ALLOW }) // allow the use and execution of mongoose.Schema.Types.Mixed, if the inferred type cannot be set otherwise
  public user?: Ref<User>;

  @prop({ allowMixed: Severity.ALLOW }) // allow the use and execution of mongoose.Schema.Types.Mixed, if the inferred type cannot be set otherwise
  public orderItems!: Item[];

  @prop()
  public shippingAddress?: ShippingAddress;

  @prop({ required: true })
  public paymentMethod!: string;

  @prop()
  public paymentResult?: PaymentResult;

  @prop({ allowMixed: Severity.ALLOW })
  public cartPrices!: {
    itemsPrice: number;
    shippingPrice: number;
    taxPrice: number;
    totalPrice: number;
  };

  @prop({ default: false })
  public isPaid!: boolean;

  @prop()
  public paidAt!: Date;

  @prop({ required: true, default: false })
  public isDelivered!: boolean;

  @prop()
  public deliveredAt!: Date;
}

export const OrderModel = getModelForClass(Order);
