import mongoose from 'mongoose';

const { Schema } = mongoose;

const cartItemSchema = new Schema({
  productID: { type: mongoose.Schema.Types.ObjectId, ref: 'products', required: true },
  quantity: { type: Number, required: true, default: 1 },
  price: { type: Number, required: true, default: 0 },
  colorSelected: { type: String },
  tailSelected: { type: String }
});

const cartSchema = new Schema({
  items: [cartItemSchema],
  totalPrice: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

const Cart = mongoose.model('Cart', cartSchema);

export default Cart;