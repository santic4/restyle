import { logger } from '../../utils/logger.js';
import { generateToken } from '../../utils/cryptografia.js';
import { findTransactionByPaymentId } from '../../services/transactions/transactionServicesMP.js';
import { paymentsServicesMP } from '../../services/payments/paymentServices.js';

export const createOrderMP = async (req, res) => {

    const { items, carrito, client, totalPrice, shippingCost } = req.body;

    try {

        const externalReference = generateToken();
        const response = await paymentsServicesMP.createOrder(items, carrito, externalReference, client, totalPrice, shippingCost);

        res.status(200).json(response);
    } catch (error) {
        logger.error('Error al crear la preferencia:', error);
        res.sendStatus(400);
    }
}

export const successOrder = async (req, res) => {
    try {
        const{ payment_id} = req.query;

        if (payment_id) {
            res.redirect(`https://restyle-869o.onrender.com?payment_id=${payment_id}`);
        } else {
            throw new Error('Transacción no encontrada o no coincide con el payment_id');
        }

    } catch (error) {
        res.status(500).json({ error: 'Error al redireccionar al success.' });
    }
};

export const webHookMP = async (req, res) => {
    const payment = req.query;

    try {
        await paymentsServicesMP.webHook(payment);

        res.status(200);
    } catch (error) {
        res.status(500).send('Error al procesar el pago');
    }
};

export const captureMP = async (req, res) => {
    const payment = req.query;

    try {

        const foundedTransaction = await findTransactionByPaymentId(payment)


        if(foundedTransaction?.status === 'accredited'){
            return res.json({ 
                status: 'Pago capturado exitosamente'
              });
        }

    } catch (error) {
        logger.error(error, 'Error al procesar el pago');
        res.status(500).send('Error al procesar el pago');
    }
};
