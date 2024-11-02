import mongoose from 'mongoose';

const { Schema } = mongoose;

const cartItemSchema = new Schema({
  productID: { type: mongoose.Schema.Types.ObjectId, ref: 'products', required: true },
  title: { type: String },
  quantity: { type: Number, default: 1 },
  price: { type: Number, required: true, default: 0 },
  colorSelected: { type: String },
  tailSelected: { type: String },
  images: {
    type: [String], 
    required: true
  },
});

const cartSchema = new Schema({
  items: [cartItemSchema],
  totalPrice: { type: Number, default: 0 },
  shippingCost: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

const Cart = mongoose.model('Cart', cartSchema);

export default Cart;