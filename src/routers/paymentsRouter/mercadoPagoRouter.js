import { Router } from 'express'
import { captureMP, createOrderMP,  successOrder,  webHookMP } from '../../controllers/paymentsControllers/mercadoPagoController.js';


export const MercadoPagoRouter = Router();

MercadoPagoRouter.post('/create-order', 
    createOrderMP
)

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

