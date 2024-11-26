import { Schema, model } from 'mongoose';

const cartItemSchema = new Schema({
  id: { type: String, required: true },
  title: { type: String, required: true },
  category_id: { type: String, default: 'N/A' },
  description: { type: String, default: 'N/A' },
  quantity: { type: Number, required: true },
  unit_price: { type: Number, required: true }
});

const transactionSchema = new Schema({
  externalReference: { type: String, required: true, sparse: true },
  status: { type: String, default: 'pending' },
  payment_id: { type: String, sparse: true },
  carrito: [cartItemSchema], 
  total: { type: Number },
  client: {
    name: { type: String },
    lastName: { type: String },
    email: { type: String },
    areaCode: { type: String },
    phoneNumber: { type: String },
    dni: { type: String },
  },
  shippingCost: { type: Number, sparse: true },
  completed: { type: Boolean, default: false },
  createdAt: { type: String }
});

const Transaction = model('Transaction', transactionSchema);

export default Transaction;
