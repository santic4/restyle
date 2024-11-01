import { transactionsDao } from "../../DAO/MongooseDAO.js/transactionsDao.js";
import { DataInvalid } from "../../models/errors/dataInvalid.js";

export const saveTransactionWithToken = async ( items, externalReference, payment_id, carrito,  client, shippingCost) => {
  try {

    if (!items || !externalReference || !payment_id || !carrito || !client) {
      throw new DataInvalid();
    }

    const transaction = await transactionsDao.postTransaction(externalReference, payment_id, carrito, client, items, shippingCost)

    return transaction;
  } catch (error) {
    console.error('Error al guardar la transacción:', error);
  }
};

export const findTransactionByPaymentId = async (payment_id) => {
  try {
    if(!payment_id){
      throw new DataInvalid()
    }

    const transaction = await transactionsDao.getTransaction(payment_id)

    return transaction;
  } catch (error) {

    throw new Error('Error al buscar la transacción');
  }
};

export const updateTransactionStatusMercadoPago = async (externalReference, status, payment_id) => {
  try {
    if(!payment_id || !externalReference  || !status){
      throw new DataInvalid()
    }

    const transaction = await transactionsDao.updateTransactionMercadoPago(externalReference, status, payment_id);
 
    return transaction;
  } catch (error) {

    throw new Error('Error al actualizar el estado de la transacción');
  }
};

export const findTransactionGetAll = async () => {
  try {
    const transactionDTO = await transactionsDao.getAllTransactions();

    return transactionDTO;
  } catch (error) {

    throw new Error('Error al buscar la transacción');
  }
};
