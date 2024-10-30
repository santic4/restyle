import { MercadoPagoConfig, Payment, Preference } from 'mercadopago';
import { findTransactionByPaymentId, saveTransactionWithToken, updateTransactionStatusMercadoPago } from '../transactions/transactionServicesMP.js';
import { DataInvalid } from '../../models/errors/dataInvalid.js';
import { ACCESS_TOKEN_MP } from '../../config/config.js';

const client = new MercadoPagoConfig({
    accessToken: ACCESS_TOKEN_MP,
    options: { timeout: 10000, idempotencyKey: 'abc' }
})

class PaymentsServicesMP{

    async createOrder(items, carrito, externalReference, client, totalPrice, shippingCost){

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
  
            const preference = new Preference(client);

    
            const response = await preference.create({
                body: {
                    additional_info: 'RE STYLE',
                    auto_return: 'approved',
                    back_urls: {
                        success: 'https://be44-191-102-247-165.ngrok-free.app',
                        failure: 'https://be44-191-102-247-165.ngrok-free.app',
                        pending: 'https://be44-191-102-247-165.ngrok-free.app'
                    },
                    expiration_date_from: new Date().toISOString(),
                    expiration_date_to: new Date(new Date().getTime() + 24 * 60 * 60 * 1000).toISOString(), 
                    expires: false,
                    external_reference: externalReference,
                    items: carrito,
                    notification_url: 'https://be44-191-102-247-165.ngrok-free.app/api/cards/webhook',
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
                            number: client.DNI
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

            console.log('pase')
            const allFileadj = items.flatMap(item => 
                item.productID.fileadj.map(file => ({
                    url: file.url, 
                    name: file.name 
                }))
            );
   
            if(client.email && externalReference){
                await saveTransactionWithToken(client.email, externalReference, response.id, allFileadj, totalPrice, client);
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
        const application = new Payment(client);
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