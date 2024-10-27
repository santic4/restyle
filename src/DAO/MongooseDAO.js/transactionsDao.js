import TransactionDTO from "../../dto/transactionDTO.js";
import Transaction from "../../models/mongoose/transactionSchema.js";
import moment from 'moment-timezone';
import { logger } from "../../utils/logger.js";

class TransactionsDao {
    
    async getTransaction(payment_id){
      try{
        const transaction = await Transaction.findOne({payment_id}).lean();

        return transaction
      }catch(error){
        throw new Error(`Error al obtener el transacción por ID: ${error.message}`);
      }
    }

    async updateTransactionByPaymentId(paymentID, updateData) {
      try {
        return await Transaction.findOneAndUpdate({ payment_id: paymentID }, updateData, { new: true });
      } catch (error) {
        throw new Error(`Error al actualizar la transacción con payment_id ${paymentID}: ${error.message}`);
      }
    }

    async postTransaction(emailSend, externalReference, payment_id, carrito, total, clientData){
      try{
      const existingTransaction = await Transaction.findOne({ externalReference });

      if (!existingTransaction) {
        const formattedDate = moment.tz('America/Argentina/Buenos_Aires').format('DD/MM/YYYY - HH:mm');

        const transaction = new Transaction({
          emailSend: emailSend,
          externalReference,
          payment_id,
          carrito,
          total,
          clientData,
          createdAt: formattedDate
        });
        await transaction.save();
 
      } else {
        console.log('Transacción ya existe');
      }
      }catch(error){
        throw new Error(`Error al crear una transacción: ${error.message}`);
      }
  }


    async updateTransaction(externalReference, status, payment_id){
        try{
          
          const existingTransaction = await Transaction.findOne({ payment_id });

          if (existingTransaction?.status === 'pending') {
            await Transaction.findOneAndUpdate(
              { externalReference },
              { status, payment_id }
            );  
          }

        }catch(error){
          throw new Error(`Error al actualizar la transacción: ${error.message}`);
        }
    }

    async updateTransactionMercadoPago(externalReference, status, payment_id){
      try{

          const existingTransaction = await Transaction.findOne({ externalReference });

          if (existingTransaction?.status === 'pending') {
            await Transaction.findOneAndUpdate(
              { externalReference },
              { status, payment_id }
            );  
          }

      }catch(error){
        throw new Error(`Error al actualizar la transacción: ${error.message}`);
      }
  }

    async getAllTransactions(){
        try{
            const transaction = await Transaction.find({}).lean();

            const transactionDTO = transaction.map(trans => new TransactionDTO(trans));

            return transactionDTO
        }catch(error){
          throw new Error(`Error al obtener el transactiones: ${error.message}`);
        }
      }

}

export const transactionsDao = new TransactionsDao()