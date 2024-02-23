import { modelOptions, prop, getModelForClass } from '@typegoose/typegoose';

@modelOptions({ schemaOptions: { timestamps: true } })
export class Product {
  public _id?: string;

  @prop()
  public name!: string;

  @prop({ unique: true })
  public slug!: string;

  @prop()
  public image!: string;

  @prop()
  public brand!: string;

  @prop()
  public category!: string;

  @prop()
  public description!: string;

  @prop({ default: 0 })
  public price!: number;

  @prop({ default: 0 })
  public countInStock!: number;

  @prop({ default: 0 })
  public rating!: number;

  @prop({ default: 0 })
  public numReviews!: number;
}

export const ProductModel = getModelForClass(Product);
