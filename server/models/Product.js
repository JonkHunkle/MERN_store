import { Schema, model } from 'mongoose';

const productSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true
    },
    quantity: {
      type: Number,
      required: true
    },
    onHold: {
      type: Boolean,
    },
  }
);

const Product = model('Product', productSchema);

export default Product