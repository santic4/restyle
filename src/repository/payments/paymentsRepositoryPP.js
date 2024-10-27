import axios from 'axios';
import { PAYPAL_API } from '../../config/config.js';
import { getAccessToken } from '../../services/payments/tokenCache.js';

class PaymentsRepositoryPP {
  async createOrderPP(currency_selected, amountUSD, externalReference) {
    try {
      const order = {
        intent: 'CAPTURE',
        purchase_units: [
          {
            reference_id: externalReference,
            amount: {
              currency_code: currency_selected,
              value: amountUSD,
            },
          },
        ],
        application_context: {
          brand_name: 'ALFIL DIGITAL',
          landing_page: 'NO_PREFERENCE',
          user_action: 'PAY_NOW',
          return_url: `https://alfildigital.com.ar`,
          cancel_url: `https://alfildigital.com.ar`,
        },
      };

      const accessToken = await getAccessToken();

      const response = await axios.post(
        `${PAYPAL_API}v2/checkout/orders`,
        order,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );

      return response;
    } catch (error) {
      console.error('Error en createOrderPP:', error);
      throw new Error('No se pudo crear la orden.');
    }
  }

  async captureOrderPP(token) {
    try {
      const accessToken = await getAccessToken();

      const response = await axios.post(
        `${PAYPAL_API}v2/checkout/orders/${token}/capture`,
        {},
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );

      if (response.data.status !== 'COMPLETED') {
        throw new Error('No se realizó correctamente el pago.');
      }

      return response;
    } catch (error) {
      console.error('Error en captureOrderPP:', error);
      throw new Error('No se pudo capturar la orden.');
    }
  }
}

export const paymentsRepositoryPP = new PaymentsRepositoryPP();
