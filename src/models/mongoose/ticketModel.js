import  mongoose from 'mongoose';
import { randomUUID } from 'crypto'

const ticketSchema = new mongoose.Schema({
  code: {
    type: String, unique: true, default: randomUUID
  },
  purchase_datetime: {
    type: Date,
    default: Date.now,
  },
  amount: {
    type: Number,
    required: true,
  },
  purchaser: {
    type: String,
    required: true,
  },
});

export const Ticket = mongoose.model('Ticket', ticketSchema);