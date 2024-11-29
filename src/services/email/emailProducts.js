import { transactionsDao } from "../../DAO/MongooseDAO.js/transactionsDao.js";
import { emailService } from "./emailServices.js";

class CartServicesMP {
  async sendEmailProducts(transaction) {
    try {
      if (!transaction) {
        throw new Error("No existe la transacción para mandar el mail.");
      }

      if (transaction?.completed === true) {
        throw new Error("El correo ya fue enviado previamente.");
      }

      const itemsList = transaction.carrito
        .map(
          (item) =>
            `<li style="color: #000; font-size: 16px; margin-bottom: 5px;">
              <strong>${item.title}</strong> - Cantidad: ${item.quantity} - Precio: $${item.unit_price}
            </li>`
        )
        .join("");

      const message = `
        <div style="font-family: Arial, sans-serif; color: #000; background-color: #fff; padding: 20px; border: 1px solid #ddd;">
          <h1 style="text-align: center; color: #000;">¡Hola, ${transaction.client.name}!</h1>
          <p style="font-size: 18px; color: #000;">
            😊 Tu compra se procesó con éxito, y acá te dejamos todos los detalles:
          </p>

          <h2 style="color: #000;">🛍 Resumen de tu compra</h2>
          <ul style="list-style: none; padding: 0; color: #000;">
            ${itemsList}
          </ul>
          <p style="font-size: 18px; color: #000;"><strong>Total:</strong> $${transaction.total}</p>
          <p style="font-size: 18px; color: #000;"><strong>Costo de envío:</strong> $${transaction.shippingCost}</p>

          <h2 style="color: #000;">🚚 Información de envío</h2>
          <p style="font-size: 16px; color: #000;">
            Tu pedido estará en camino muy pronto y te enviaremos el código de seguimiento por esta misma vía y por WhatsApp. Si necesitás algo más, escribinos.
          </p>

          <h2 style="color: #000;">📅 Fecha de compra</h2>
          <p style="font-size: 16px; color: #000;">${transaction.createdAt}</p>

          <h2 style="color: #000;">💳 Estado de pago</h2>
          <p style="font-size: 16px; color: #000;">
            <strong>ID de pago:</strong> ${transaction.payment_id} <br>
            <strong>Estado:</strong> ${transaction.status}
          </p>

          <p style="font-size: 18px; color: #000;">
            Muchas gracias por elegirnos, ${transaction.client.name}. ¡Te esperamos pronto en <strong>INDIS Indumentaria</strong>! 😊
          </p>

          <p style="text-align: center; font-size: 16px; color: #000;">
            <em>Un abrazo,</em><br>
            <strong>El equipo de INDIS Indumentaria</strong>
          </p>
        </div>
      `;

      // Enviar el correo
      await emailService.send(
        transaction.client.email,
        "Recibiste tu compra de INDIS Indumentaria.",
        message
      );

      console.log(transaction,'transaction antes de mandar mail')
      
      const transactionId = transaction._id;

      const transactionSend = await transactionsDao.updateTransactionByPaymentId(transactionId, {
        completed: true,
      });

      return transactionSend
    } catch (error) {
      throw new Error("No se pudo enviar el mail.");
    }
  }
}

export const cartServicesMP = new CartServicesMP();
