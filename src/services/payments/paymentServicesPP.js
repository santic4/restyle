import { paymentsRepositoryPP } from "../../repository/payments/paymentsRepositoryPP.js";

import { findTransactionByPaymentId, saveTransactionWithToken, updateTransactionStatus } from "../transactions/transactionServicesMP.js";

class PaymentsServicesPP {
  async createOrderPP(currency_selected, amountUSD, emailSend, carrito, externalReference) {
    try {
      if (!currency_selected || !amountUSD || !emailSend || !carrito || !externalReference) {
        throw new Error('Faltan parámetros requeridos');
      }

      const nombresArchivos = carrito.map(item => item.productID.fileadj).flat();

      const response = await paymentsRepositoryPP.createOrderPP(currency_selected, amountUSD, externalReference);

      const approvalUrl = response.data.links.find(link => link.rel === 'approve')?.href;
      const payment_id = response.data.id;

      if (approvalUrl && payment_id) {
        await saveTransactionWithToken(emailSend, externalReference, payment_id, nombresArchivos);
      } else {
        throw new Error('No se puede realizar el pago.');
      }
      console.log(approvalUrl, payment_id,'response dataaa')
      return { approvalUrl, payment_id };
    } catch (error) {
      console.error('Error en createOrderPP:', error);
      throw new Error('No se puede realizar el pago.');
    }
  }

  async captureOrderPP(token) {
    try {
      if (!token) {
        throw new Error('Token no existe');
      }

      const response = await paymentsRepositoryPP.captureOrderPP(token);

      const referenceId = response.data.purchase_units[0].reference_id;
      const paymentId = response.data.id;

      if (referenceId && paymentId) {
        await updateTransactionStatus(referenceId, response.data.status, paymentId);


      } else {
        throw new Error('No se puede realizar el pago.');
      }

      const foundedTransaction = paymentId ? await findTransactionByPaymentId(paymentId) : null;

      return foundedTransaction;
    } catch (error) {
      console.error('Error en captureOrderPP:', error);
      throw new Error('No se puede realizar el pago.');
    }
  }
}

export const paymentsServicesPP = new PaymentsServicesPP();
