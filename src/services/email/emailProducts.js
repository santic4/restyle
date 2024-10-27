import { transactionsDao } from "../../DAO/MongooseDAO.js/transactionsDao.js";
import { findTransactionByPaymentId } from "../transactions/transactionServicesMP.js";
import { emailService } from "./emailServices.js";


class CartServicesMP {

    async sendEmailProducts(paymentID, fileUrls, emailSend) {

        try {
          if (!paymentID || !Array.isArray(fileUrls)) {
            throw new Error('Formato de datos inválido');
          }

          const transactionAccredited = await findTransactionByPaymentId(paymentID)

          if (transactionAccredited?.completed === true) {
            throw new Error('El correo ya fue enviado previamente.');
          }

          if(transactionAccredited?.status === 'pending'){
            throw new Error('Transacciòn no aprobada.')
          }

          const message = `
            <section style="
                width: 100%;
                max-width: 600px;
                margin: 0 auto;
                height: auto;
                justify-content: center;
                align-items: center;
                font-family: 'Montserrat', sans-serif;
                color: #333;
                padding: 20px;
                border: 1px solid #ddd;
                border-radius: 10px;
                background-color: #f9f9f9;
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                text-align: center;
                overflow: hidden;
                position: relative;
            ">
                    
                <!-- Imagen de fondo -->
                <div style="
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    opacity: 0.15;
                    z-index: 0;
                "></div>
                    
                <div style="position: relative; z-index: 1;">
                    
                    <!-- Título principal -->
                    <div style="margin-bottom: 20px;">
                        <h2 style="
                            color: #2C3360;
                            font-size: 2vh;
                            margin: 0;
                        ">Recibiste tu compra de ALFIL DIGITAL</h2>
                         <h3 style="
                            color: #2C3360;
                            font-size: 2vh;
                            margin: 0;
                        ">¡Que la disfrutes! :)</h3>
                    </div>
                    
                    <!-- Mensaje -->
                    <div style="margin-bottom: 25px;">
                        <p style="
                            font-size: 1.7vh;
                            line-height: 1.5;
                            margin: 0;
                        ">Podés descargar tus archivos desde los siguientes enlaces</p>
                    </div>
                    
                    <!-- Lista de enlaces de descarga -->
                    <div style="margin-bottom: 20px;">
                        <ul style="
                            list-style-type: none;
                            padding: 0;
                            margin: 0;
                        ">
                            ${fileUrls.map(e => `
                                <li style="margin-bottom: 10px;">
                                    <a href="${e.url}" target="_blank" style="
                                        text-decoration: none;
                                        padding: 10px 20px;
                                        background-color: #2C3360;
                                        color: white;
                                        border-radius: 5px;
                                        display: inline-block;
                                        transition: background-color 0.3s ease;
                                    ">
                                        Ir a descargar archivo ${e.name}
                                    </a>
                                </li>`).join('')}
                        </ul>
                    </div>
                            
                    <!-- Agradecimiento -->
                    <div style="margin-top: 30px;">
                        <p style="
                            font-size: 1.7vh;
                            color: #6C7856;
                            margin: 0;
                        ">Gracias por confiar en ALFIL DIGITAL.</p>
                    </div>
                </div>
            </section>
          `;
      
          await emailService.send(emailSend, 'Recibiste tu compra de ALFIL DIGITAL', message);

          await transactionsDao.updateTransactionByPaymentId(paymentID, { completed: true });

        } catch (error) {
          throw new Error('No se pudo enviar el mail.')
        }
      }

}

export const cartServicesMP = new CartServicesMP();