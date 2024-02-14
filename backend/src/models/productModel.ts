import { modelOptions, prop, getModelForClass } from '@typegoose/typegoose';

@modelOptions({ schemaOptions: { timestamps: true } })
export class Product {
  public _id!: string;

  @prop({ required: true })
  name!: string;

  @prop({ required: true, unique: true })
  slug!: string;

  @prop({ required: true })
  image!: string;

  @prop({ required: true })
  description!: string;

  @prop({ required: true })
  price!: number;

  @prop({ required: true })
  countInStock!: number;

  @prop({ required: true })
  rating!: number;

  @prop({ required: true })
  numReviews!: number;
}
