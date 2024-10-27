import { Router } from 'express'
import { webHookMP } from '../../controllers/paymentsControllers/mercadoPagoController.js';

export const CardsPay = Router();

CardsPay.post('/webhook', webHookMP)