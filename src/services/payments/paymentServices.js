import { MercadoPagoConfig, Payment, Preference } from 'mercadopago';
import { findTransactionByPaymentId, saveTransactionWithToken, updateTransactionStatusMercadoPago } from '../transactions/transactionServicesMP.js';
import { DataInvalid } from '../../models/errors/dataInvalid.js';
import { ACCESS_TOKEN_MP } from '../../config/config.js';

const client = new MercadoPagoConfig({
    accessToken: ACCESS_TOKEN_MP,
    options: { timeout: 10000, idempotencyKey: 'abc' }
})

class PaymentsServicesMP{

    async createOrder(items, carrito, emailSend, externalReference, clientData, total){

        try {

            if (!clientData) {
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
                    additional_info: 'ALFIL DIGITAL',
                    auto_return: 'approved',
                    back_urls: {
                        success: 'https://alfildigital.com.ar',
                        failure: 'https://alfildigital.com.ar',
                        pending: 'https://alfildigital.com.ar'
                    },
                    expiration_date_from: new Date().toISOString(),
                    expiration_date_to: new Date(new Date().getTime() + 24 * 60 * 60 * 1000).toISOString(), 
                    expires: false,
                    external_reference: externalReference,
                    items: carrito,
                    notification_url: 'https://alfildigital.com.ar/api/cards/webhook',
                    payer: {
                        name: clientData.Nombre,
                        surname: clientData.Apellido,
                        email: emailSend,
                        phone: {
                            area_code: clientData.CodArea,
                            number: clientData.Telefono
                        },
                        identification: {
                            type: 'DNI',
                            number: clientData.DNI
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

            const allFileadj = items.flatMap(item => 
                item.productID.fileadj.map(file => ({
                    url: file.url, 
                    name: file.name 
                }))
            );
   
            if(emailSend && externalReference){
                await saveTransactionWithToken(emailSend, externalReference, response.id, allFileadj, total, clientData);
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