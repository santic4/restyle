import { Router } from 'express'
import { captureMP, createOrderMP,  successOrder,  webHookMP } from '../../controllers/paymentsControllers/mercadoPagoController.js';
import { ACCESS_TOKEN_MP } from '../../config/config.js';


export const MercadoPagoRouter = Router();

MercadoPagoRouter.post('/create-order', 
    createOrderMP
)

MercadoPagoRouter.get('/payment-methods', async (req, res) => {
    try {
        const response = await fetch('https://api.mercadopago.com/v1/payment_methods', {
            headers: {
                Authorization: `Bearer ${ACCESS_TOKEN_MP}`, 
                'Content-Type': 'application/json',
            },
        });
        const data = await response.json();

        res.json(data); 
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener métodos de pago' });
    }
});

MercadoPagoRouter.post('/installments', async (req, res) => {
    const { method_id, amount} = req.body;

    try {
        const response = await fetch(`https://api.mercadopago.com/v1/payment_methods/installments?amount=${amount}&payment_method_id=${method_id}`, {
            headers: {
              Authorization: `Bearer ${ACCESS_TOKEN_MP}`,
            },
          });
          const data = await response.json();

        res.json(data); 
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener métodos de pago' });
    }
});

MercadoPagoRouter.get('/success', 
    successOrder
);

MercadoPagoRouter.get('/failure',  (req, res) => {
    res.redirect('/success');
});

MercadoPagoRouter.get('/pending', (req, res) => {
    res.redirect('/checkout'); 
});

MercadoPagoRouter.get('/capture-order', 
    captureMP
);

MercadoPagoRouter.post('/webhook', webHookMP)

