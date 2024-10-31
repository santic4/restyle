import { Router } from 'express'
import { captureMP, createOrderMP,  successOrder,  webHookMP } from '../../controllers/paymentsControllers/mercadoPagoController.js';


export const MercadoPagoRouter = Router();

MercadoPagoRouter.post('/create-order', 
    createOrderMP
)

MercadoPagoRouter.get('/payment-methods', async (req, res) => {
    try {
        const response = await fetch('https://api.mercadopago.com/v1/payment_methods', {
            headers: {
                Authorization: `Bearer TEST-1227822103444956-103019-38ffb406a2ce9b549c84be3c03d716b9-674717908`, // token de acceso de Mercado Pago
                'Content-Type': 'application/json',
            },
        });
        const data = await response.json();
        console.log(data,'data')
        res.json(data); // Enviar los datos al frontend
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

MercadoPagoRouter.post('/capture-order', (req, res) => {
    captureMP
});


MercadoPagoRouter.post('/webhook', webHookMP)

