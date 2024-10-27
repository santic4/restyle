import { Schema, model } from 'mongoose';

const transactionSchema = new Schema({
    payment_id: { type: String, required: true, sparse: true },
    emailSend: { type: String, required: true },
    cart_id: { type: String, required: true },
    status: { type: String, default: 'pending' },
  });

const TransactionPP = model('TransactionPP', transactionSchema);

export default TransactionPP;