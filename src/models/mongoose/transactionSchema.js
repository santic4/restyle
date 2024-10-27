import { Schema, model } from 'mongoose';

const transactionSchema = new Schema({
    externalReference: { type: String, required: true, sparse: true },
    emailSend: { type: String, required: true },
    status: { type: String, default: 'pending' },
    payment_id: { type: String, sparse: true},
    carrito: [
      {
        url: { type: String, required: true }, 
        name: { type: String, required: true } 
      }
    ],
    total: { type: Number },
    clientData: {
      Nombre: { type: String },
      Apellido: { type: String },
      CodArea: { type: String },
      Telefono: { type: String },
      DNI: { type: String },
    },
    completed: { type: Boolean, default: false },
    createdAt: { type: String }
  });

const Transaction = model('Transaction', transactionSchema);

export default Transaction;