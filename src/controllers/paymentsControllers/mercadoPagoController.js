import { logger } from '../../utils/logger.js';
import { generateToken } from '../../utils/cryptografia.js';
import { findTransactionByPaymentId } from '../../services/transactions/transactionServicesMP.js';
import { paymentsServicesMP } from '../../services/payments/paymentServices.js';

export const createOrderMP = async (req, res) => {
    const { items, carrito, client } = req.body;

    try {

        const externalReference = generateToken();
        const response = await paymentsServicesMP.createOrder(items, carrito, externalReference, client);

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
            res.redirect(`https://indisindumentaria.com.ar?payment_id=${payment_id}`);
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
        const payment_id = payment.payment_id;

        const foundedTransaction = await findTransactionByPaymentId(payment_id)

        if (foundedTransaction?.status !== 'accredited') {
            throw new Error('La transacción no está acreditada.');
        }

        const transaction = {
            idTransaction: foundedTransaction?._id,
            carrito: foundedTransaction?.carrito,
            email: foundedTransaction?.client?.email,
            total: foundedTransaction?.total,
        }

        return res.status(200).json(transaction);
    } catch (error) {
        res.status(500).send('Error al procesar el pago');
    }
};
