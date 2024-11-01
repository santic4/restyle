import { MercadoPagoConfig, Payment, Preference } from 'mercadopago';
import { findTransactionByPaymentId, saveTransactionWithToken, updateTransactionStatusMercadoPago } from '../transactions/transactionServicesMP.js';
import { DataInvalid } from '../../models/errors/dataInvalid.js';
import { ACCESS_TOKEN_MP } from '../../config/config.js';

const clientConfig = new MercadoPagoConfig({
    accessToken: 'APP_USR-4646418936536455-051102-9c9a15b2c4e55bc8b7ca461272059450-1808896698',
    options: { timeout: 20000, idempotencyKey: 'abc' }
})

class PaymentsServicesMP{

    async createOrder(items, carrito, externalReference, client){

        try {

            if (!client) {
                throw new Error('Falta información requerida (información personal)');
            }

            if (!carrito || carrito.length === 0) {
                throw new Error('El carrito está vacío o no fue proporcionado.');
            }

            if (!externalReference) {
                throw new Error('No se pudo generar una referencia externa.');
            }

            carrito.forEach(item => {
                if (!item.id || !item.title || !item.quantity || !item.unit_price) {
                    throw new Error('Uno o más artículos del carrito no tienen todos los campos necesarios.');
                }
            });  
  
            const costShip = items.shippingCost;
            const preference = new Preference(clientConfig);

            const response = await preference.create({
                body: {
                    additional_info: 'RESTYLE',
                    auto_return: 'approved',
                    back_urls: {
                        success: 'https://1e70-191-102-247-165.ngrok-free.app/pago-completado',
                        failure: 'https://1e70-191-102-247-165.ngrok-free.app',
                        pending: 'https://1e70-191-102-247-165.ngrok-free.app'
                    },
                    expiration_date_from: new Date().toISOString(),
                    expiration_date_to: new Date(new Date().getTime() + 24 * 60 * 60 * 1000).toISOString(), 
                    expires: false,
                    external_reference: externalReference,
                    items: [
                        ...carrito,
                        {
                            title: 'Costo de Envío',
                            description: 'Costo de envío calculado',
                            quantity: 1,
                            currency_id: 'ARS', 
                            unit_price: costShip,
                        }
                    ],
                    notification_url: 'https://1e70-191-102-247-165.ngrok-free.app/api/tarjetas/webhook',
                    payer: {
                        name: client.name,
                        surname: client.lastName,
                        email: client.email,
                        phone: {
                            area_code: client.areaCode,
                            number: client.phoneNumber
                        },
                        identification: {
                            type: 'DNI',
                            number: client.dni
                        },
                        date_created: new Date().toISOString()
                    },
                    payment_methods: {
                        excluded_payment_methods: [],
                        excluded_payment_types: [],
                        installments: 10,
                        default_installments: 1
                    }
                }
            });

            const shippingCost = items.shippingCost;

            if(client && externalReference){
                await saveTransactionWithToken( items, externalReference, response.id, carrito, client, shippingCost);
            }else{
                throw new DataInvalid()
            }        

            return response
        } catch (error) {
        console.error('Error en createOrderMP:', error);
        throw new Error('No se puede realizar el pago.');
        }
    }

    async webHook(payment){
        const application = new Payment(clientConfig);
            try {

                if (payment.type === 'payment') {
            
                const captureResult = await application.capture({
                    id: payment['data.id'],
                    requestOptions: {
                        idempotencyKey: 'abc'
                    }
                });

                if (captureResult.status !== 'approved' ) {
                    throw new Error('Pago rechazado.')
                }
            
                if (captureResult.status_detail === 'accredited' ) {
                    await updateTransactionStatusMercadoPago(captureResult.external_reference, captureResult.status_detail, captureResult.id);
          
                }
                
                const foundedTransaction = payment['data.id'] ? await findTransactionByPaymentId(payment['data.id']) : null;

                return foundedTransaction;
            
              } else {
                  throw new Error('Tipo de pago no reconocido o no es un pago');
              }

            }catch (error) {
                console.error('Error en createOrderMP:', error);
                    throw new Error('No se puede realizar el pago.');
            }
    }
}

export const paymentsServicesMP = new PaymentsServicesMP()